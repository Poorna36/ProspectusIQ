import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { SignJWT, jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload, UserRole } from '../types/api';
import fp from 'fastify-plugin';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'prospectusiq-super-secret-key-change-in-prod-2026'
);

export const ACCESS_TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days (relaxed for hackathon demo)
export const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

// ── Token creation ──────────────────────────────────────────────────────────

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL}s`)
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as JwtPayload;
}

// ── Fastify plugin that adds authentication decorator ───────────────────────

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest('user', undefined);

  // Prehandler that verifies JWT and sets req.user
  fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or malformed Authorization header',
          requestId: (req as any).requestId || uuidv4(),
        },
      });
    }

    const token = authHeader.slice(7);
    try {
      const payload = await verifyAccessToken(token);
      req.user = payload;
    } catch {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired access token',
          requestId: (req as any).requestId || uuidv4(),
        },
      });
    }
  });

  // Role-check factory
  fastify.decorate('requireRole', (...roles: UserRole[]) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      if (!req.user) {
        return reply.status(401).send({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Not authenticated', requestId: uuidv4() },
        });
      }
      if (!roles.includes(req.user.role)) {
        return reply.status(403).send({
          success: false,
          error: { code: 'FORBIDDEN', message: `Requires role: ${roles.join(' or ')}`, requestId: uuidv4() },
        });
      }
    };
  });

  // Step-Up MFA Check
  fastify.decorate('requireStepUpOTP', async (req: FastifyRequest, reply: FastifyReply) => {
    if (!req.user) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated', requestId: uuidv4() },
      });
    }

    const otp = req.headers['x-step-up-otp'] as string;
    
    if (!otp) {
      return reply.status(403).send({
        success: false,
        error: { 
          code: 'STEP_UP_REQUIRED', 
          message: 'This action requires Step-Up MFA verification. Please provide X-Step-Up-OTP header.', 
          requestId: (req as any).requestId || uuidv4() 
        },
      });
    }

    // MOCK OTP VALIDATION: Accept '123456' or '000000' for the hackathon demo.
    // In production, this would verify against a short-lived token in Redis or DB.
    if (otp !== '123456' && otp !== '000000') {
      return reply.status(403).send({
        success: false,
        error: { 
          code: 'INVALID_OTP', 
          message: 'The provided Step-Up OTP is invalid or expired.', 
          requestId: (req as any).requestId || uuidv4() 
        },
      });
    }
    
    // Valid OTP — proceed.
  });
}

// Extend FastifyInstance type for decorators
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (...roles: UserRole[]) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireStepUpOTP: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(authPlugin, { name: 'auth' });
