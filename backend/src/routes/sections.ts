/**
 * Group C — Sections Routes
 * GET  /filings/:filingId/sections/:sectionKey
 * GET  /filings/:filingId/sections/:sectionKey/status  (polling endpoint)
 * PUT  /filings/:filingId/sections/:sectionKey/inputs
 * PATCH /filings/:filingId/sections/:sectionKey/human-edit
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { filings } from '../db/schema/filings';
import { sections, sectionInputs } from '../db/schema/sections';
import { aiDrafts } from '../db/schema/aiDrafts';
import { flags as flagsTable } from '../db/schema/flags';
import { writeAuditEvent } from '../services/auditService';
import { validateSection } from '../rules/validateSection';
import { generateDraftAsync } from '../services/aiDispatcher';
import { SectionKey } from '../types/api';

function notFound(reply: FastifyReply, reqId: string, msg = 'Not found') {
  return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: msg, requestId: reqId } });
}

export async function sectionsRoutes(fastify: FastifyInstance): Promise<void> {

  // Helper: get section by filing + key
  function getSection(filingId: string, sectionKey: string) {
    return db.select().from(sections)
      .where(and(eq(sections.filing_id, filingId), eq(sections.section_key, sectionKey)))
      .get();
  }

  // ── GET /filings/:filingId/sections/:sectionKey ───────────────────────────
  fastify.get('/filings/:filingId/sections/:sectionKey', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId, sectionKey } = req.params as any;

    const section = getSection(filingId, sectionKey);
    if (!section) return notFound(reply, reqId, 'Section not found');

    // Get latest input data
    const latestInput = db.select().from(sectionInputs).where(eq(sectionInputs.section_id, section.section_id)).all().pop();

    // Get latest AI draft
    const latestDraft = db.select().from(aiDrafts).where(eq(aiDrafts.section_id, section.section_id)).all().pop();

    return reply.send({
      success: true,
      data: {
        sectionKey: section.section_key,
        sectionLabel: section.section_label,
        status: section.status,
        completionPercent: section.completion_percent,
        inputData: latestInput ? JSON.parse(latestInput.variables) : null,
        aiDraft: latestDraft ? {
          draftedText: latestDraft.drafted_text,
          sourceVariablesUsed: JSON.parse(latestDraft.source_variables_used),
          rulesEngineStatus: latestDraft.rules_engine_status,
          verifierStatus: latestDraft.verifier_status,
          verifierConfidence: latestDraft.verifier_confidence,
          verifierFlags: JSON.parse(latestDraft.verifier_flags),
          retryCount: latestDraft.retry_count,
          modelVersion: latestDraft.model_version,
        } : null,
        // Blueprint §5 Group C: humanEdited fields are top-level, NOT nested inside aiDraft
        humanEditedText: latestDraft?.human_edited_text ?? null,
        humanEditedBy: latestDraft?.human_edited_by ?? null,
        humanEditedAt: latestDraft?.human_edited_at
          ? new Date(latestDraft.human_edited_at).toISOString()
          : null,
        certifiedAt: (section as any).certified_at
          ? new Date((section as any).certified_at).toISOString()
          : null,
        updatedAt: new Date(section.updated_at).toISOString(),
      },
      meta: { requestId: reqId },
    });
  });

  // ── GET /filings/:filingId/sections/:sectionKey/status (polling) ──────────
  fastify.get('/filings/:filingId/sections/:sectionKey/status', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId, sectionKey } = req.params as any;

    const section = getSection(filingId, sectionKey);
    if (!section) return notFound(reply, reqId, 'Section not found');

    return reply.send({
      success: true,
      data: { sectionKey: section.section_key, status: section.status, jobId: null },
      meta: { requestId: reqId },
    });
  });

  // ── PUT /filings/:filingId/sections/:sectionKey/inputs ────────────────────
  fastify.put('/filings/:filingId/sections/:sectionKey/inputs', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'PROMOTER' && req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only PROMOTER can submit inputs', requestId: reqId } });
    }

    const { filingId, sectionKey } = req.params as any;
    const { inputs } = req.body as any;

    if (!inputs || typeof inputs !== 'object') {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'inputs object is required', requestId: reqId } });
    }

    const filing = db.select().from(filings).where(eq(filings.filing_id, filingId)).get();
    if (!filing) return notFound(reply, reqId, 'Filing not found');

    const section = getSection(filingId, sectionKey);
    if (!section) return notFound(reply, reqId, 'Section not found');

    // Stage 1: run deterministic rules
    const rulesResult = validateSection(sectionKey as SectionKey, inputs);
    const now = Date.now();

    // Clear old RULES_ENGINE flags for this section
    db.delete(flagsTable)
      .where(and(eq(flagsTable.section_id, section.section_id), eq(flagsTable.source, 'RULES_ENGINE')))
      .run();

    // Write new flags
    for (const f of rulesResult.flags) {
      db.insert(flagsTable).values({
        flag_id:          uuidv4(),
        filing_id:        filingId,
        section_id:       section.section_id,
        source:           'RULES_ENGINE',
        severity:         f.severity,
        status:           'OPEN',
        type:             f.type,
        description:      f.description,
        clause_reference: f.clause_reference,
        created_at:       now,
      }).run();
    }

    // Update flag counts on section
    const critCount = rulesResult.flags.filter(f => f.severity === 'CRITICAL').length;
    const reviewCount = rulesResult.flags.filter(f => f.severity === 'REVIEW').length;

    if (rulesResult.status === 'FAIL') {
      // Do NOT proceed to AI — block and return flags
      db.update(sections).set({
        status: 'INPUT_RECEIVED',
        flag_count_critical: critCount,
        flag_count_review: reviewCount,
        updated_at: now,
      }).where(eq(sections.section_id, section.section_id)).run();

      return reply.status(422).send({
        success: false,
        error: {
          code: 'UNPROCESSABLE',
          message: `Stage 1 validation failed — ${critCount} critical flag(s) must be resolved`,
          details: { flags: rulesResult.flags },
          requestId: reqId,
        },
      });
    }

    // Save inputs
    const existingInputs = db.select().from(sectionInputs).where(eq(sectionInputs.section_id, section.section_id)).all();
    const newVersion = existingInputs.length + 1;

    db.insert(sectionInputs).values({
      input_id:      uuidv4(),
      section_id:    section.section_id,
      input_version: newVersion,
      variables:     JSON.stringify(inputs),
      submitted_by:  req.user!.userId,
      submitted_at:  now,
    }).run();

    // Transition to AI_DRAFTING
    db.update(sections).set({
      status: 'AI_DRAFTING',
      flag_count_critical: critCount,
      flag_count_review: reviewCount,
      completion_percent: 40,
      updated_at: now,
    }).where(eq(sections.section_id, section.section_id)).run();

    // Fire and forget — does NOT block response
    generateDraftAsync({
      filingId,
      sectionId: section.section_id,
      sectionKey,
      inputVariables: inputs,
      requestId: reqId,
    });

    writeAuditEvent({
      filingId,
      eventType: 'SECTION_INPUTS_SUBMITTED',
      actorId: req.user!.userId,
      actorType: 'USER',
      payload: { sectionKey, inputVersion: newVersion },
    });

    return reply.status(200).send({
      success: true,
      data: { sectionKey, status: 'AI_DRAFTING', jobId: reqId },
      meta: { requestId: reqId },
    });
  });

  // ── PATCH /filings/:filingId/sections/:sectionKey/human-edit ─────────────
  fastify.patch('/filings/:filingId/sections/:sectionKey/human-edit', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'INTERMEDIARY' && req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only INTERMEDIARY can redline drafts', requestId: reqId } });
    }

    const { filingId, sectionKey } = req.params as any;
    const { editedText, comment } = req.body as any;

    if (!editedText) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'editedText is required', requestId: reqId } });
    }

    const section = getSection(filingId, sectionKey);
    if (!section) return notFound(reply, reqId, 'Section not found');

    const latestDraft = db.select().from(aiDrafts).where(eq(aiDrafts.section_id, section.section_id)).all().pop();
    if (!latestDraft) {
      return reply.status(422).send({ success: false, error: { code: 'UNPROCESSABLE', message: 'No AI draft exists for this section yet', requestId: reqId } });
    }

    const now = Date.now();
    db.update(aiDrafts).set({
      human_edited_text: editedText,
      human_edited_by:   req.user!.userId,
      human_edited_at:   now,
    }).where(eq(aiDrafts.draft_id, latestDraft.draft_id)).run();

    db.update(sections).set({ status: 'HUMAN_EDITING', completion_percent: 90, updated_at: now })
      .where(eq(sections.section_id, section.section_id)).run();

    writeAuditEvent({
      filingId,
      eventType: 'SECTION_HUMAN_EDITED',
      actorId: req.user!.userId,
      actorType: 'USER',
      payload: { sectionKey, comment: comment || null },
    });

    return reply.send({
      success: true,
      data: { sectionKey, editedAt: new Date(now).toISOString() },
      meta: { requestId: reqId },
    });
  });
}
