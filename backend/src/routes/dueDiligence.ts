/**
 * Group G (Due Diligence)
 * POST /filings/:filingId/due-diligence/run
 * GET  /filings/:filingId/due-diligence/results
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { filings } from '../db/schema/filings';
import { dueDiligenceResults } from '../db/schema/misc';
import { writeAuditEvent } from '../services/auditService';

export async function dueDiligenceRoutes(fastify: FastifyInstance): Promise<void> {

  // ── POST /filings/:filingId/due-diligence/run ─────────────────────────────
  fastify.post('/filings/:filingId/due-diligence/run', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'INTERMEDIARY' && req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Requires INTERMEDIARY or ADMIN', requestId: reqId } });
    }

    const { filingId } = req.params as any;
    const { checks, entities } = req.body as any;

    if (!checks || !entities || !Array.isArray(checks) || !Array.isArray(entities)) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'checks and entities arrays required', requestId: reqId } });
    }

    // Demo: Instantly resolve with mock data
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    for (const check of checks) {
      for (const entity of entities) {
        db.insert(dueDiligenceResults).values({
          result_id:   uuidv4(),
          filing_id:   filingId,
          check_type:  check,
          entity_id:   entity.id,
          entity_type: entity.type,
          status:      'CLEAR', // Defaulting to CLEAR for demo purposes
          details:     JSON.stringify({ note: 'Mock data generated for hackathon' }),
          flags:       '[]',
          checked_at:  now,
          expires_at:  now + thirtyDays,
        }).run();
      }
    }

    writeAuditEvent({ filingId, eventType: 'DUE_DILIGENCE_RUN', actorId: req.user!.userId, actorType: 'USER', payload: { checks, entities } });

    return reply.status(202).send({
      success: true,
      data: { jobId: uuidv4(), status: 'QUEUED' },
      meta: { requestId: reqId },
    });
  });

  // ── GET /filings/:filingId/due-diligence/results ──────────────────────────
  fastify.get('/filings/:filingId/due-diligence/results', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;

    const results = db.select().from(dueDiligenceResults).where(eq(dueDiligenceResults.filing_id, filingId)).all();

    return reply.send({
      success: true,
      data: results.map(r => ({
        checkType:  r.check_type,
        entityId:   r.entity_id,
        entityType: r.entity_type,
        status:     r.status,
        details:    JSON.parse(r.details),
        flags:      JSON.parse(r.flags),
        checkedAt:  new Date(r.checked_at).toISOString(),
        expiresAt:  new Date(r.expires_at).toISOString(),
      })),
      meta: { requestId: reqId },
    });
  });
}
