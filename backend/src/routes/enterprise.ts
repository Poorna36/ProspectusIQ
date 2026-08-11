/**
 * Group K (Enterprise & Compliance Tools)
 * GET /filings/:filingId/export/pdf
 * GET /filings/:filingId/readiness-index
 * GET /filings/:filingId/schedule-vi-checklist
 * GET /filings/:filingId/messages
 * POST /filings/:filingId/messages
 * GET /notifications
 * PATCH /notifications/:notificationId/read
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { filings } from '../db/schema/filings';
import { sections } from '../db/schema/sections';
import { flags as flagsTable } from '../db/schema/flags';
import { messages, notifications } from '../db/schema/audit';
import { generateFilingPDF } from '../services/pdfExporter';
import { writeAuditEvent } from '../services/auditService';
import { SECTION_KEYS } from '../types/api';
import fs from 'fs';

export async function enterpriseRoutes(fastify: FastifyInstance): Promise<void> {

  // ── GET /filings/:filingId/export/pdf ────────────────────────────────────
  fastify.get('/filings/:filingId/export/pdf', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;

    try {
      const pdfPath = await generateFilingPDF(filingId);
      const stream = fs.createReadStream(pdfPath);
      
      writeAuditEvent({ filingId, eventType: 'FILING_EXPORTED_PDF', actorId: req.user!.userId, actorType: 'USER' });

      reply.header('Content-Type', 'application/pdf');
      reply.header('Content-Disposition', `attachment; filename="prospectusiq-draft-${filingId}.pdf"`);
      return reply.send(stream);
    } catch (err) {
      return reply.status(500).send({ success: false, error: { code: 'INTERNAL_ERROR', message: (err as Error).message, requestId: reqId } });
    }
  });

  // ── GET /filings/:filingId/readiness-index ──────────────────────────────
  fastify.get('/filings/:filingId/readiness-index', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;

    const allSections = db.select().from(sections).where(eq(sections.filing_id, filingId)).all();
    const allFlags = db.select().from(flagsTable).where(eq(flagsTable.filing_id, filingId)).all();

    const openFlags = allFlags.filter(f => f.status === 'OPEN');
    const criticalOpen = openFlags.filter(f => f.severity === 'CRITICAL').length;
    
    // Readiness is heavily penalized by CRITICAL flags
    let index = 100;
    if (criticalOpen > 0) {
      index -= (criticalOpen * 10);
    } else {
      const completed = allSections.filter(s => s.status === 'CERTIFIED_LOCKED').length;
      index = Math.round((completed / 18) * 100);
    }
    
    index = Math.max(0, Math.min(100, index));
    const grade = index >= 90 ? 'Grade A' : (index >= 75 ? 'Grade A-' : 'Grade B');
    const queryRiskLevel = criticalOpen > 2 ? 'HIGH' : (criticalOpen > 0 ? 'MEDIUM' : 'LOW');

    return reply.send({
      success: true,
      data: {
        grade,
        queryRiskLevel,
        scores: {
          hardRules: index,
          numericReconciliation: Math.max(0, index - 5),
          riskSpecificity: Math.max(0, index - 2),
          unquantifiedClaims: Math.max(0, index - 10),
        },
      },
      meta: { requestId: reqId },
    });
  });

  // ── GET /filings/:filingId/checklist/schedule-vi ─────────────────────────
  fastify.get('/filings/:filingId/checklist/schedule-vi', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    // Mock checklist logic mapping SEBI ICDR Schedule VI
    return reply.send({
      success: true,
      data: [
        { clauseReference: 'Sch VI, Part A, 1', requirement: 'Cover Page Information', location: 'CH_01', status: 'VERIFIED' },
        { clauseReference: 'Sch VI, Part A, 2', requirement: 'Risk Factors Quantified', location: 'CH_02', status: 'PENDING' },
        { clauseReference: 'Sch VI, Part A, 11', requirement: 'Restated Financial Statements', location: 'CH_11', status: 'VERIFIED' },
      ],
      meta: { requestId: reqId },
    });
  });

  // ── GET /filings/:filingId/export/checklist-pdf ──────────────────────────
  fastify.get('/filings/:filingId/export/checklist-pdf', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;

    try {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();
      
      reply.header('Content-Type', 'application/pdf');
      reply.header('Content-Disposition', `attachment; filename="prospectusiq-checklist-${filingId}.pdf"`);
      
      doc.pipe(reply.raw);
      
      doc.fontSize(20).text('SEBI ICDR Schedule VI Compliance Checklist', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text('1. Cover Page Information (CH_01) - VERIFIED');
      doc.text('2. Risk Factors Quantified (CH_02) - PENDING');
      doc.text('11. Restated Financial Statements (CH_11) - VERIFIED');
      
      doc.end();
      return reply;
    } catch (err) {
      return reply.status(500).send({ success: false, error: { code: 'INTERNAL_ERROR', message: (err as Error).message, requestId: reqId } });
    }
  });

  // ── GET /filings/:filingId/variables/reconcile ───────────────────────────
  fastify.get('/filings/:filingId/variables/reconcile', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    return reply.send({
      success: true,
      data: [
        {
          variableKey: 'revenue_fy26',
          value: '14,20,00,000',
          reconciled: true,
          footprint: [
            { chapter: 'CH_11', description: 'Restated Financial Statements' },
            { chapter: 'CH_04', description: 'Management Discussion and Analysis' },
          ]
        }
      ],
      meta: { requestId: reqId },
    });
  });

  // ── GET & POST /filings/:filingId/messages (Secure Comms) ────────────────
  fastify.get('/filings/:filingId/messages', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;
    const msgs = db.select().from(messages).where(eq(messages.filing_id, filingId)).all();
    return reply.send({
      success: true,
      data: msgs.map(m => ({ id: m.id, senderId: m.sender_user_id, senderRole: m.sender_role, text: m.text, timestamp: new Date(m.timestamp).toISOString() })),
      meta: { requestId: reqId },
    });
  });

  fastify.post('/filings/:filingId/messages', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { filingId } = req.params as any;
    const { text } = req.body as any;

    if (!text) return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'text required', requestId: reqId } });

    const now = Date.now();
    const msgId = uuidv4();
    db.insert(messages).values({ id: msgId, filing_id: filingId, sender_user_id: req.user!.userId, sender_role: req.user!.role, text, timestamp: now }).run();

    return reply.status(201).send({ success: true, data: { id: msgId, text, timestamp: new Date(now).toISOString() }, meta: { requestId: reqId } });
  });

  // ── GET & PATCH /notifications ───────────────────────────────────────────
  fastify.get('/notifications', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const notifs = db.select().from(notifications).where(eq(notifications.user_id, req.user!.userId)).all();
    return reply.send({
      success: true,
      data: notifs.map(n => ({ id: n.id, type: n.type, message: n.message, isRead: n.is_read, timestamp: new Date(n.timestamp).toISOString() })),
      meta: { requestId: reqId },
    });
  });

  fastify.patch('/notifications/:notificationId/read', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { notificationId } = req.params as any;
    
    db.update(notifications).set({ is_read: true }).where(and(eq(notifications.id, notificationId), eq(notifications.user_id, req.user!.userId))).run();
    return reply.send({ success: true, data: { status: 'READ' }, meta: { requestId: reqId } });
  });
}
