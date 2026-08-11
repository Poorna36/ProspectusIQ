/**
 * Group D — Flags Routes
 * GET  /filings/:filingId/flags
 * PATCH /filings/:filingId/flags/:flagId/resolve
 * POST  /filings/:filingId/flags/:flagId/escalate
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { filings } from '../db/schema/filings';
import { sections } from '../db/schema/sections';
import { flags as flagsTable } from '../db/schema/flags';
import { writeAuditEvent } from '../services/auditService';

export async function flagsRoutes(fastify: FastifyInstance): Promise<void> {

  // ── GET /filings/:filingId/flags ─────────────────────────────────────────
  fastify.get('/filings/:filingId/flags', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;
    const query = req.query as any;

    let allFlags = db.select().from(flagsTable).where(eq(flagsTable.filing_id, filingId)).all();

    if (query.severity) allFlags = allFlags.filter(f => f.severity === query.severity);
    if (query.status)   allFlags = allFlags.filter(f => f.status === query.status);
    if (query.source)   allFlags = allFlags.filter(f => f.source === query.source);
    if (query.sectionKey) {
      const sec = db.select().from(sections)
        .where(and(eq(sections.filing_id, filingId), eq(sections.section_key, query.sectionKey))).get();
      if (sec) allFlags = allFlags.filter(f => f.section_id === sec.section_id);
    }

    const result = allFlags.map(f => ({
      flagId:          f.flag_id,
      sectionId:       f.section_id ?? null,
      source:          f.source,
      severity:        f.severity,
      status:          f.status,
      type:            f.type,
      description:     f.description,
      clauseReference: f.clause_reference ?? null,
      createdAt:       new Date(f.created_at).toISOString(),
      resolvedAt:      f.resolved_at ? new Date(f.resolved_at).toISOString() : null,
      resolvedBy:      f.resolved_by ?? null,
    }));

    return reply.send({ success: true, data: result, meta: { requestId: reqId, total: result.length } });
  });

  // ── PATCH /filings/:filingId/flags/:flagId/resolve ───────────────────────
  fastify.patch('/filings/:filingId/flags/:flagId/resolve', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'INTERMEDIARY' && req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only INTERMEDIARY can resolve flags', requestId: reqId } });
    }

    const { filingId, flagId } = req.params as any;
    const { resolutionNote } = req.body as any;

    if (!resolutionNote) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'resolutionNote is required', requestId: reqId } });
    }

    const flag = db.select().from(flagsTable).where(eq(flagsTable.flag_id, flagId)).get();
    if (!flag || flag.filing_id !== filingId) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Flag not found', requestId: reqId } });
    }

    const now = Date.now();
    db.update(flagsTable).set({
      status: 'RESOLVED',
      resolution_note: resolutionNote,
      resolved_at: now,
      resolved_by: req.user!.userId,
    }).where(eq(flagsTable.flag_id, flagId)).run();

    // Update section flag counts
    if (flag.section_id) {
      const sec = db.select().from(sections).where(eq(sections.section_id, flag.section_id)).get();
      if (sec) {
        db.update(sections).set({
          flag_count_resolved: sec.flag_count_resolved + 1,
          flag_count_critical: flag.severity === 'CRITICAL' ? Math.max(0, sec.flag_count_critical - 1) : sec.flag_count_critical,
          flag_count_review:   flag.severity === 'REVIEW'   ? Math.max(0, sec.flag_count_review - 1)   : sec.flag_count_review,
          updated_at: now,
        }).where(eq(sections.section_id, flag.section_id)).run();
      }
    }

    writeAuditEvent({ filingId, eventType: 'FLAG_RESOLVED', actorId: req.user!.userId, actorType: 'USER', payload: { flagId, resolutionNote } });

    return reply.send({
      success: true,
      data: { flagId, status: 'RESOLVED', resolvedAt: new Date(now).toISOString(), resolvedBy: req.user!.userId },
      meta: { requestId: reqId },
    });
  });

  // ── POST /filings/:filingId/flags/:flagId/escalate ───────────────────────
  fastify.post('/filings/:filingId/flags/:flagId/escalate', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'INTERMEDIARY' && req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only INTERMEDIARY can escalate flags', requestId: reqId } });
    }

    const { filingId, flagId } = req.params as any;
    const { escalationNote } = req.body as any;

    const flag = db.select().from(flagsTable).where(eq(flagsTable.flag_id, flagId)).get();
    if (!flag || flag.filing_id !== filingId) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Flag not found', requestId: reqId } });
    }

    const now = Date.now();
    db.update(flagsTable).set({ status: 'ESCALATED', escalation_note: escalationNote || null } as any).where(eq(flagsTable.flag_id, flagId)).run();

    writeAuditEvent({ filingId, eventType: 'FLAG_ESCALATED', actorId: req.user!.userId, actorType: 'USER', payload: { flagId, escalationNote } });

    return reply.send({
      success: true,
      data: { flagId, status: 'ESCALATED', escalatedAt: new Date(now).toISOString() },
      meta: { requestId: reqId },
    });
  });
}
