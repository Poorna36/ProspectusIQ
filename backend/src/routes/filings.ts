/**
 * Group B — Filings Routes
 * GET  /filings
 * POST /filings
 * GET  /filings/:filingId
 * PATCH /filings/:filingId/submit-to-intermediary
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { filings, filingAssignments } from '../db/schema/filings';
import { sections } from '../db/schema/sections';
import { flags as flagsTable } from '../db/schema/flags';
import { notifications } from '../db/schema/audit';
import { writeAuditEvent } from '../services/auditService';
import { SECTION_KEYS, SECTION_LABELS, SectionKey } from '../types/api';

function notFound(reply: FastifyReply, reqId: string) {
  return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Filing not found', requestId: reqId } });
}

function scopeCheck(filing: any, req: any, reply: FastifyReply, reqId: string): boolean {
  const user = req.user!;
  if (user.role === 'ADMIN') return true;
  if (user.role === 'PROMOTER' && filing.promoter_id === user.userId) return true;
  if (user.role === 'INTERMEDIARY' && user.assignedFilingIds?.includes(filing.filing_id)) return true;
  reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Not authorized for this filing', requestId: reqId } });
  return false;
}

export async function filingsRoutes(fastify: FastifyInstance): Promise<void> {

  // ── GET /filings ─────────────────────────────────────────────────────────
  fastify.get('/filings', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const user = req.user!;

    let allFilings = db.select().from(filings).all();

    // Filter by role
    if (user.role === 'PROMOTER') {
      allFilings = allFilings.filter(f => f.promoter_id === user.userId);
    } else if (user.role === 'INTERMEDIARY') {
      allFilings = allFilings.filter(f => user.assignedFilingIds?.includes(f.filing_id));
    }

    const result = allFilings.map(f => {
      const secs = db.select().from(sections).where(eq(sections.filing_id, f.filing_id)).all();
      const assignments = db.select().from(filingAssignments).where(eq(filingAssignments.filing_id, f.filing_id)).all();
      return {
        filingId: f.filing_id,
        companyName: f.company_name,
        cin: f.cin,
        status: f.status,
        completionPercent: f.completion_percent,
        createdAt: new Date(f.created_at).toISOString(),
        updatedAt: new Date(f.updated_at).toISOString(),
        assignedIntermediaries: assignments.map(a => ({ userId: a.user_id, intermediaryRole: a.assigned_role })),
      };
    });

    return reply.send({ success: true, data: result, meta: { requestId: reqId, total: result.length } });
  });

  // ── POST /filings ─────────────────────────────────────────────────────────
  fastify.post('/filings', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'PROMOTER' && req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only PROMOTER can create filings', requestId: reqId } });
    }

    const { companyName, cin, sector, businessModelSummary } = req.body as any;
    if (!companyName || !cin || !sector) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'companyName, cin, sector are required', requestId: reqId } });
    }

    const now = Date.now();
    const filingId = uuidv4();

    db.insert(filings).values({
      filing_id: filingId,
      promoter_id: req.user!.userId,
      company_name: companyName,
      cin,
      sector,
      business_model_summary: businessModelSummary || null,
      created_at: now,
      updated_at: now,
    }).run();

    // Create all 18 sections upfront in NOT_STARTED state
    for (const key of SECTION_KEYS) {
      db.insert(sections).values({
        section_id:        uuidv4(),
        filing_id:         filingId,
        section_key:       key,
        section_label:     SECTION_LABELS[key as SectionKey],
        created_at:        now,
        updated_at:        now,
      }).run();
    }

    writeAuditEvent({
      filingId,
      eventType: 'FILING_CREATED',
      actorId: req.user!.userId,
      actorType: 'USER',
      payload: { companyName, cin, sector },
    });

    return reply.status(201).send({
      success: true,
      data: { filingId, status: 'DRAFT_IN_PROGRESS', createdAt: new Date(now).toISOString() },
      meta: { requestId: reqId },
    });
  });

  // ── GET /filings/:filingId ────────────────────────────────────────────────
  fastify.get('/filings/:filingId', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;

    const filing = db.select().from(filings).where(eq(filings.filing_id, filingId)).get();
    if (!filing) return notFound(reply, reqId);
    if (!scopeCheck(filing, req, reply, reqId)) return;

    const secs = db.select().from(sections).where(eq(sections.filing_id, filingId)).all();
    const assignments = db.select().from(filingAssignments).where(eq(filingAssignments.filing_id, filingId)).all();

    return reply.send({
      success: true,
      data: {
        filingId: filing.filing_id,
        companyName: filing.company_name,
        cin: filing.cin,
        sector: filing.sector,
        status: filing.status,
        completionPercent: filing.completion_percent,
        lockedAt: filing.locked_at ? new Date(filing.locked_at).toISOString() : null,
        engagementCode: filing.engagement_code,
        sections: secs.map(s => ({
          sectionKey: s.section_key,
          sectionLabel: s.section_label,
          status: s.status,
          completionPercent: s.completion_percent,
          flagCount: {
            critical: s.flag_count_critical,
            review: s.flag_count_review,
            resolved: s.flag_count_resolved,
          },
        })),
        assignedIntermediaries: assignments.map(a => ({ userId: a.user_id, intermediaryRole: a.assigned_role })),
        createdAt: new Date(filing.created_at).toISOString(),
        updatedAt: new Date(filing.updated_at).toISOString(),
      },
      meta: { requestId: reqId },
    });
  });

  // ── PATCH /filings/:filingId/submit-to-intermediary ──────────────────────
  fastify.patch('/filings/:filingId/submit-to-intermediary', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'PROMOTER') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only PROMOTER can submit', requestId: reqId } });
    }

    const { filingId } = req.params as any;
    const filing = db.select().from(filings).where(eq(filings.filing_id, filingId)).get();
    if (!filing) return notFound(reply, reqId);
    if (!scopeCheck(filing, req, reply, reqId)) return;

    // Gate: no unresolved CRITICAL flags allowed
    const criticalFlags = db.select().from(flagsTable)
      .where(and(eq(flagsTable.filing_id, filingId), eq(flagsTable.severity, 'CRITICAL'), eq(flagsTable.status, 'OPEN')))
      .all();

    if (criticalFlags.length > 0) {
      return reply.status(422).send({
        success: false,
        error: {
          code: 'UNPROCESSABLE',
          message: `Cannot submit — ${criticalFlags.length} unresolved CRITICAL flag(s) remain`,
          details: { criticalFlagCount: criticalFlags.length },
          requestId: reqId,
        },
      });
    }

    const now = Date.now();
    db.update(filings).set({ status: 'PENDING_REVIEW', updated_at: now }).where(eq(filings.filing_id, filingId)).run();

    // Notify assigned intermediaries
    const assignments = db.select().from(filingAssignments).where(eq(filingAssignments.filing_id, filingId)).all();
    for (const a of assignments) {
      db.insert(notifications).values({
        id: uuidv4(),
        user_id: a.user_id,
        filing_id: filingId,
        type: 'FILING_SUBMITTED',
        message: `${filing.company_name} DRHP has been submitted for your review.`,
        timestamp: now,
      }).run();
    }

    writeAuditEvent({ filingId, eventType: 'FILING_SUBMITTED_TO_INTERMEDIARY', actorId: req.user!.userId, actorType: 'USER', payload: { companyName: filing.company_name } });

    return reply.send({
      success: true,
      data: { filingId, status: 'PENDING_REVIEW', updatedAt: new Date(now).toISOString() },
      meta: { requestId: reqId },
    });
  });
}
