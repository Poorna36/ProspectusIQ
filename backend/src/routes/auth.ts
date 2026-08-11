/**
 * Group A — Authentication Routes
 * POST /auth/register
 * POST /auth/login
 * POST /auth/logout
 * POST /auth/token/refresh
 * POST /auth/mfa/send-otp
 * POST /auth/pair
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { users } from '../db/schema/users';
import { filings, filingAssignments } from '../db/schema/filings';
import { signAccessToken } from '../middleware/auth';
import { writeAuditEvent } from '../services/auditService';
import { notifications } from '../db/schema/audit';
import { encrypt } from '../services/cryptoService';

// Hardcoded OTP for demo — any user entering this code passes MFA
const DEMO_OTP = '123456';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {

  // ── POST /auth/register ─────────────────────────────────────────────────
  fastify.post('/auth/register', async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { email, password, fullName, role, companyName, kycToken, panNumber, aadhaarNumber } = req.body as any;

    if (!email || !password || !fullName || !role) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'email, password, fullName, role are required', requestId: reqId } });
    }
    if (password.length < 8) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters', requestId: reqId } });
    }
    if (!['PROMOTER', 'INTERMEDIARY', 'ADMIN'].includes(role)) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid role', requestId: reqId } });
    }

    // Check duplicate email
    const existing = db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
      return reply.status(409).send({ success: false, error: { code: 'CONFLICT', message: 'Email already registered', requestId: reqId } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = Date.now();
    const userId = uuidv4();
    // KYC: accept any non-empty token, auto-verify (hackathon mode)
    const kycStatus = kycToken ? 'VERIFIED' : 'PENDING';

    // Encrypt sensitive fields
    const panEncrypted = panNumber ? encrypt(panNumber) : null;
    const aadhaarEncrypted = aadhaarNumber ? encrypt(aadhaarNumber) : null;

    db.insert(users).values({
      user_id:       userId,
      email,
      password_hash: passwordHash,
      role,
      full_name:     fullName,
      company_name:  companyName || null,
      kyc_status:    kycStatus,
      pan_number_encrypted: panEncrypted,
      aadhaar_number_encrypted: aadhaarEncrypted,
      created_at:    now,
      updated_at:    now,
    }).run();

    writeAuditEvent({ eventType: 'USER_REGISTERED', actorId: userId, actorType: 'USER', actorName: fullName, payload: { email, role } });

    return reply.status(201).send({
      success: true,
      data: { userId, email, role, kycStatus, createdAt: new Date(now).toISOString() },
      meta: { requestId: reqId },
    });
  });

  // ── POST /auth/login ────────────────────────────────────────────────────
  fastify.post('/auth/login', async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { email, password, otpCode } = req.body as any;

    if (!email || !password) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'email and password are required', requestId: reqId } });
    }

    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user) {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password', requestId: reqId } });
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid email or password', requestId: reqId } });
    }

    // MFA check — hardcoded OTP 123456 always passes (or skip if not provided)
    if (otpCode && otpCode !== DEMO_OTP) {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid OTP code', requestId: reqId } });
    }

    // Get assigned filing IDs for this user (relevant for intermediaries)
    const assignments = user.role === 'INTERMEDIARY'
      ? db.select().from(filingAssignments).where(eq(filingAssignments.user_id, user.user_id)).all()
      : [];
    const assignedFilingIds = assignments.map(a => a.filing_id);

    const refreshToken = uuidv4();
    const now = Date.now();

    db.update(users).set({ refresh_token: refreshToken, updated_at: now }).where(eq(users.user_id, user.user_id)).run();

    const accessToken = await signAccessToken({
      userId: user.user_id,
      email: user.email,
      role: user.role as any,
      intermediaryRole: user.intermediary_role as any ?? null,
      assignedFilingIds,
    });

    writeAuditEvent({ eventType: 'USER_LOGIN', actorId: user.user_id, actorType: 'USER', actorName: user.full_name });

    return reply.status(200).send({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn: 604800,
        user: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
          intermediaryRole: user.intermediary_role ?? null,
          fullName: user.full_name,
        },
      },
      meta: { requestId: reqId },
    });
  });

  // ── POST /auth/logout ───────────────────────────────────────────────────
  fastify.post('/auth/logout', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    db.update(users).set({ refresh_token: null, updated_at: Date.now() }).where(eq(users.user_id, req.user!.userId)).run();
    writeAuditEvent({ eventType: 'USER_LOGOUT', actorId: req.user!.userId, actorType: 'USER' });
    return reply.status(204).send();
  });

  // ── POST /auth/token/refresh ────────────────────────────────────────────
  fastify.post('/auth/token/refresh', async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    const { refreshToken } = req.body as any;

    if (!refreshToken) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'refreshToken required', requestId: reqId } });
    }

    const user = db.select().from(users).all().find(u => u.refresh_token === refreshToken);
    if (!user) {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired refresh token', requestId: reqId } });
    }

    // Token rotation
    const newRefreshToken = uuidv4();
    db.update(users).set({ refresh_token: newRefreshToken, updated_at: Date.now() }).where(eq(users.user_id, user.user_id)).run();

    const assignments = user.role === 'INTERMEDIARY'
      ? db.select().from(filingAssignments).where(eq(filingAssignments.user_id, user.user_id)).all()
      : [];

    const accessToken = await signAccessToken({
      userId: user.user_id,
      email: user.email,
      role: user.role as any,
      intermediaryRole: user.intermediary_role as any ?? null,
      assignedFilingIds: assignments.map(a => a.filing_id),
    });

    return reply.status(200).send({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken, expiresIn: 604800 },
      meta: { requestId: reqId },
    });
  });

  // ── POST /auth/mfa/send-otp ─────────────────────────────────────────────
  fastify.post('/auth/mfa/send-otp', async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;
    // Demo mode: always returns success, OTP is always 123456
    console.log(`[MFA Demo] OTP for ${(req.body as any).email}: ${DEMO_OTP}`);
    return reply.status(200).send({
      success: true,
      data: { otpSent: true, expiresInSeconds: 300, demoNote: 'Use OTP: 123456' },
      meta: { requestId: reqId },
    });
  });

  // ── POST /auth/pair ─────────────────────────────────────────────────────
  // Pairs a Promoter's account with an Intermediary team via Engagement Code
  fastify.post('/auth/pair', { preHandler: [fastify.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reqId = (req as any).requestId;

    if (req.user!.role !== 'PROMOTER') {
      return reply.status(403).send({ success: false, error: { code: 'FORBIDDEN', message: 'Only PROMOTER can pair via engagement code', requestId: reqId } });
    }

    const { engagementCode, cin, companyName } = req.body as any;
    if (!engagementCode || !cin || !companyName) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'engagementCode, cin, companyName are required', requestId: reqId } });
    }

    // Find or create filing for this promoter
    let filing = db.select().from(filings).where(eq(filings.promoter_id, req.user!.userId)).get();

    const now = Date.now();
    if (!filing) {
      const filingId = uuidv4();
      db.insert(filings).values({
        filing_id: filingId,
        promoter_id: req.user!.userId,
        company_name: companyName,
        cin,
        sector: 'General',
        engagement_code: engagementCode,
        created_at: now,
        updated_at: now,
      }).run();
      filing = db.select().from(filings).where(eq(filings.filing_id, filingId)).get()!;
    } else {
      db.update(filings).set({ engagement_code: engagementCode, updated_at: now }).where(eq(filings.filing_id, filing.filing_id)).run();
    }

    // Find intermediaries whose KYC is verified (demo: return all intermediaries as assigned)
    const intermediaries = db.select().from(users).where(eq(users.role, 'INTERMEDIARY')).all();

    for (const intermediary of intermediaries) {
      // Check if already assigned
      const existing = db.select().from(filingAssignments)
        .where(eq(filingAssignments.filing_id, filing.filing_id)).all()
        .find(a => a.user_id === intermediary.user_id);
      if (!existing && intermediary.intermediary_role) {
        db.insert(filingAssignments).values({
          assignment_id: uuidv4(),
          filing_id: filing.filing_id,
          user_id: intermediary.user_id,
          assigned_role: intermediary.intermediary_role as any,
          assigned_at: now,
        }).run();
      }
    }

    writeAuditEvent({
      filingId: filing.filing_id,
      eventType: 'ENGAGEMENT_CODE_PAIRED',
      actorId: req.user!.userId,
      actorType: 'USER',
      payload: { engagementCode, cin },
    });

    const assignedIntermediaries = intermediaries
      .filter(i => i.intermediary_role)
      .map(i => ({ name: i.full_name, role: i.intermediary_role }));

    return reply.status(201).send({
      success: true,
      data: {
        paired: true,
        filingId: filing.filing_id,
        assignedIntermediaries,
      },
      meta: { requestId: reqId },
    });
  });
}
