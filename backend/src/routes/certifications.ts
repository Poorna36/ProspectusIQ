/**
 * Groups E, F, H, I — Certifications, Comments, Documents, Audit Trail
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { filings, filingAssignments } from '../db/schema/filings';
import { sections } from '../db/schema/sections';
import { flags as flagsTable } from '../db/schema/flags';
import { certifications, comments, documents } from '../db/schema/misc';
import { auditEvents } from '../db/schema/audit';
import { writeAuditEvent } from '../services/auditService';
import path from 'path';
import fs from 'fs';

const UPLOADS_DIR = path.resolve(__dirname, '..', '..', 'uploads');

export async function certificationRoutes(fastify: FastifyInstance): Promise<void> {

  // ── POST /filings/:filingId/certifications (Group E) ─────────────────────
  fastify.post('/filings/:filingId/certifications', { preHandler: [fastify.authenticate, fastify.requireStepUpOTP] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'INTERMEDIARY' && req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only INTERMEDIARY can certify', requestId: reqId } });
    }

    const { filingId } = req.params as any;
    const { certifierRole, declaration, signatureHash } = req.body as any;

    if (!certifierRole || !declaration || !signatureHash) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'certifierRole, declaration, signatureHash required', requestId: reqId } });
    }

    // Gate: no unresolved CRITICAL flags
    const critFlags = db.select().from(flagsTable)
      .where(and(eq(flagsTable.filing_id, filingId), eq(flagsTable.severity, 'CRITICAL'), eq(flagsTable.status, 'OPEN'))).all();

    if (critFlags.length > 0) {
      return reply.status(422).send({ success: false, error: { code: 'UNPROCESSABLE', message: `${critFlags.length} CRITICAL flag(s) must be resolved before certification`, requestId: reqId } });
    }

    const now = Date.now();
    const certId = uuidv4();

    db.insert(certifications).values({
      certification_id: certId,
      filing_id:        filingId,
      certified_by:     req.user!.userId,
      certifier_role:   certifierRole,
      declaration_text: declaration,
      signature_hash:   signatureHash,
      certified_at:     now,
    }).run();

    // Check if all 3 roles have certified → lock the filing
    const allCerts = db.select().from(certifications).where(eq(certifications.filing_id, filingId)).all();
    const certifiedRoles = new Set<string>(allCerts.map(c => c.certifier_role));
    const allRolesCertified = ['MERCHANT_BANKER', 'LEGAL_COUNSEL', 'AUDITOR'].every(r => certifiedRoles.has(r));

    let filingStatus = 'UNDER_REVIEW';
    if (allRolesCertified) {
      // Compute locked hash
      const docHash = createHash('sha256').update(`${filingId}:${now}:CERTIFIED`).digest('hex');
      db.update(filings).set({ status: 'CERTIFIED_LOCKED', locked_at: now, locked_hash: docHash, updated_at: now })
        .where(eq(filings.filing_id, filingId)).run();
      // Lock all sections and stamp certified_at timestamp
      db.update(sections).set({ status: 'CERTIFIED_LOCKED', completion_percent: 100, certified_at: now, updated_at: now } as any)
        .where(eq(sections.filing_id, filingId)).run();
      filingStatus = 'CERTIFIED_LOCKED';

      writeAuditEvent({ filingId, eventType: 'FILING_CERTIFIED_LOCKED', actorType: 'SYSTEM', actorName: 'ProspectusIQ', payload: { lockedHash: docHash } });
    }

    writeAuditEvent({ filingId, eventType: 'CERTIFICATION_SUBMITTED', actorId: req.user!.userId, actorType: 'USER', payload: { certifierRole, certId } });

    return reply.status(201).send({
      success: true,
      data: { certificationId: certId, filingId, certifiedBy: req.user!.userId, certifierRole, certifiedAt: new Date(now).toISOString(), filingStatus },
      meta: { requestId: reqId },
    });
  });

  // ── GET /filings/:filingId/certifications (Group E) ──────────────────────
  fastify.get('/filings/:filingId/certifications', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;
    const certs = db.select().from(certifications).where(eq(certifications.filing_id, filingId)).all();
    return reply.send({
      success: true,
      data: certs.map(c => ({ certificationId: c.certification_id, certifiedBy: c.certified_by, certifierRole: c.certifier_role, certifiedAt: new Date(c.certified_at).toISOString() })),
      meta: { requestId: reqId },
    });
  });

  // ── POST /filings/:filingId/sections/:sectionKey/comments (Group F) ───────
  fastify.post('/filings/:filingId/sections/:sectionKey/comments', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId, sectionKey } = req.params as any;
    const { content, type, parentCommentId } = req.body as any;

    if (!content || !type) return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'content and type required', requestId: reqId } });

    const sec = db.select().from(sections).where(and(eq(sections.filing_id, filingId), eq(sections.section_key, sectionKey))).get();
    if (!sec) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Section not found', requestId: reqId } });

    const now = Date.now();
    const commentId = uuidv4();
    db.insert(comments).values({ comment_id: commentId, filing_id: filingId, section_id: sec.section_id, author_id: req.user!.userId, type, content, parent_comment_id: parentCommentId || null, created_at: now }).run();

    return reply.status(201).send({ success: true, data: { commentId, sectionKey, type, content, authorId: req.user!.userId, createdAt: new Date(now).toISOString(), parentCommentId: parentCommentId || null }, meta: { requestId: reqId } });
  });

  // ── GET /filings/:filingId/sections/:sectionKey/comments (Group F) ───────
  fastify.get('/filings/:filingId/sections/:sectionKey/comments', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId, sectionKey } = req.params as any;
    const sec = db.select().from(sections).where(and(eq(sections.filing_id, filingId), eq(sections.section_key, sectionKey))).get();
    if (!sec) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Section not found', requestId: reqId } });

    const allComments = db.select().from(comments).where(eq(comments.section_id, sec.section_id)).all();
    return reply.send({ success: true, data: allComments.map(c => ({ commentId: c.comment_id, type: c.type, content: c.content, authorId: c.author_id, createdAt: new Date(c.created_at).toISOString(), parentCommentId: c.parent_comment_id ?? null })), meta: { requestId: reqId } });
  });

  // ── POST /filings/:filingId/documents (Group H) ───────────────────────────
  fastify.post('/filings/:filingId/documents', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;

    // Ensure uploads dir exists
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

    // Parse multipart — iterate parts to collect file + fields per blueprint spec
    // Blueprint: documentType and sectionKey come as multipart form-data fields, not query params
    let fileData: any = null;
    let documentType = 'OTHER';
    let sectionKey: string | null = null;

    const parts = req.parts();
    for await (const part of parts) {
      if (part.type === 'file') {
        fileData = part;
        // Drain/buffer the file
        const chunks: Buffer[] = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }
        fileData.buffer = Buffer.concat(chunks);
        fileData.filename = part.filename;
      } else {
        // Form field
        if (part.fieldname === 'documentType') documentType = (part as any).value || 'OTHER';
        if (part.fieldname === 'sectionKey') sectionKey = (part as any).value || null;
      }
    }

    if (!fileData || !fileData.buffer) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No file uploaded', requestId: reqId } });
    }

    const docId = uuidv4();
    const filename = `${docId}-${fileData.filename}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Write buffered file to disk
    fs.writeFileSync(filePath, fileData.buffer);

    // Resolve section_id from sectionKey if provided
    let resolvedSectionId: string | null = null;
    if (sectionKey) {
      const sec = db.select().from(sections).where(and(eq(sections.filing_id, filingId), eq(sections.section_key, sectionKey))).get();
      resolvedSectionId = sec?.section_id ?? null;
    }

    const stats = fs.statSync(filePath);
    const now = Date.now();
    db.insert(documents).values({
      document_id:   docId,
      filing_id:     filingId,
      document_type: documentType as any,
      section_id:    resolvedSectionId,
      filename:      fileData.filename,
      file_path:     filePath,
      file_size:     stats.size,
      uploaded_by:   req.user!.userId,
      uploaded_at:   now,
    }).run();

    writeAuditEvent({ filingId, eventType: 'DOCUMENT_UPLOADED', actorId: req.user!.userId, actorType: 'USER', payload: { documentId: docId, documentType, sectionKey } });

    return reply.status(202).send({ success: true, data: { documentId: docId, status: 'PROCESSING', jobId: reqId }, meta: { requestId: reqId } });
  });

  // ── POST /filings/:filingId/documents/scan-mock (Demo OCR) ───────────────
  fastify.post('/filings/:filingId/documents/scan-mock', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { sectionKey } = (req.query as any);

    // Simulate 2.5s processing (non-blocking wait)
    await new Promise(resolve => setTimeout(resolve, 500));

    const extractedVariables: Record<string, unknown> = {
      variable_revenue_FY26:           85_00_00_000,
      variable_revenue_FY25:           72_00_00_000,
      variable_revenue_FY24:           61_00_00_000,
      variable_pat_FY26:               9_50_00_000,
      variable_ebitda_FY26:            14_20_00_000,
      variable_customer_concentration_top5_pct: 38,
      variable_employee_count:         342,
      company_name:                    'Acme Manufacturing Pvt. Ltd.',
      restated_years:                  3,
      sector:                          'Manufacturing',
    };

    return reply.send({
      success: true,
      data: {
        extractedVariables,
        confidence: 0.91,
        processingSteps: ['Image Ingestion', 'OCR Parsing', 'NER Tagging', 'Rules Validation'],
        sectionKey: sectionKey || 'CH_11',
      },
      meta: { requestId: reqId },
    });
  });

  // ── GET /filings/:filingId/audit-log (Group I) ──────────────────────────
  fastify.get('/filings/:filingId/audit-log', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;
    const query = req.query as any;

    let events = db.select().from(auditEvents).where(eq(auditEvents.filing_id, filingId)).all();
    if (query.eventType) events = events.filter(e => e.event_type === query.eventType);

    const page = parseInt(query.page || '1');
    const pageSize = Math.min(parseInt(query.pageSize || '20'), 100);
    const paginated = events.sort((a, b) => b.timestamp - a.timestamp).slice((page - 1) * pageSize, page * pageSize);

    return reply.send({
      success: true,
      data: paginated.map(e => ({
        eventId:   e.event_id,
        eventType: e.event_type,
        actorId:   e.actor_id ?? null,
        actorType: e.actor_type,
        actorName: e.actor_name ?? null,
        payload:   JSON.parse(e.payload),
        hash:      e.hash,
        timestamp: new Date(e.timestamp).toISOString(),
      })),
      meta: { requestId: reqId, page, pageSize, total: events.length },
    });
  });

  // ── POST /filings/:filingId/phases/:phaseId/e-sign-lock (Group E) ────────
  fastify.post('/filings/:filingId/phases/:phaseId/e-sign-lock', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'INTERMEDIARY') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only INTERMEDIARY can e-sign lock', requestId: reqId } });
    }

    const { filingId, phaseId } = req.params as any;
    const { signatoryName, sebiRegistrationNo, eSignToken, declarationAccepted } = req.body as any;

    if (!signatoryName || !sebiRegistrationNo || !eSignToken || declarationAccepted !== true) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid eSign payload or declaration not accepted', requestId: reqId } });
    }

    // Demo: Hash the token to simulate DSC verification
    const now = Date.now();
    const hash = createHash('sha256').update(`${phaseId}:${eSignToken}:${now}`).digest('hex');

    writeAuditEvent({ filingId, eventType: 'PHASE_ESIGN_LOCKED', actorId: req.user!.userId, actorType: 'USER', payload: { phaseId, signatoryName, sebiRegistrationNo, hash } });

    return reply.send({
      success: true,
      data: {
        status: 'CERTIFIED_LOCKED',
        lockedAt: new Date(now).toISOString(),
        bronzeSealApplied: true,
        digitalSignatureHash: hash,
      },
      meta: { requestId: reqId },
    });
  });

  // ── POST /filings/:filingId/phases/:phaseId/request-unlock (Group E) ─────
  fastify.post('/filings/:filingId/phases/:phaseId/request-unlock', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'PROMOTER' && req.user!.role !== 'INTERMEDIARY') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Unauthorized to request unlock', requestId: reqId } });
    }

    const { filingId, phaseId } = req.params as any;
    const { amendmentRationale } = req.body as any;

    if (!amendmentRationale) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'amendmentRationale required', requestId: reqId } });
    }

    const reqUnlockId = uuidv4();
    writeAuditEvent({ filingId, eventType: 'PHASE_UNLOCK_REQUESTED', actorId: req.user!.userId, actorType: 'USER', payload: { phaseId, requestId: reqUnlockId, rationale: amendmentRationale } });

    return reply.status(200).send({
      success: true,
      data: {
        requestId: reqUnlockId,
        status: 'UNLOCK_REQUESTED',
        notifiedRoles: ['ADMIN', 'INTERMEDIARY'],
      },
      meta: { requestId: reqId },
    });
  });
}
