/**
 * Group J (Admin & System)
 * GET  /admin/users
 * POST /admin/filings/:filingId/assign
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { users } from '../db/schema/users';
import { filings, filingAssignments } from '../db/schema/filings';
import { writeAuditEvent } from '../services/auditService';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {

  // ── GET /admin/users ──────────────────────────────────────────────────────
  fastify.get('/admin/users', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Requires ADMIN', requestId: reqId } });
    }

    const allUsers = db.select().from(users).all();
    return reply.send({
      success: true,
      data: allUsers.map(u => ({
        userId:           u.user_id,
        email:            u.email,
        role:             u.role,
        intermediaryRole: u.intermediary_role ?? null,
        fullName:         u.full_name,
        companyName:      u.company_name ?? null,
        kycStatus:        u.kyc_status,
        createdAt:        new Date(u.created_at).toISOString(),
      })),
      meta: { requestId: reqId, total: allUsers.length },
    });
  });

  // ── POST /admin/filings/:filingId/assign ────────────────────────────────
  fastify.post('/admin/filings/:filingId/assign', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    if (req.user!.role !== 'ADMIN') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Requires ADMIN', requestId: reqId } });
    }

    const { filingId } = req.params as any;
    const { intermediaryId, assignedRole } = req.body as any;

    const filing = db.select().from(filings).where(eq(filings.filing_id, filingId)).get();
    if (!filing) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Filing not found', requestId: reqId } });

    const existing = db.select().from(filingAssignments).where(and(eq(filingAssignments.filing_id, filingId), eq(filingAssignments.user_id, intermediaryId))).get();
    if (existing) {
      return reply.status(409).send({ success: false, error: { code: 'CONFLICT', message: 'User already assigned', requestId: reqId } });
    }

    const now = Date.now();
    db.insert(filingAssignments).values({
      assignment_id: uuidv4(),
      filing_id:     filingId,
      user_id:       intermediaryId,
      assigned_role: assignedRole,
      assigned_at:   now,
    }).run();

    writeAuditEvent({ filingId, eventType: 'INTERMEDIARY_ASSIGNED', actorId: req.user!.userId, actorType: 'USER', payload: { intermediaryId, assignedRole } });

    return reply.status(200).send({
      success: true,
      data: { filingId, intermediaryId, assignedRole, assignedAt: new Date(now).toISOString() },
      meta: { requestId: reqId },
    });
  });
}
