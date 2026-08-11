import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

/**
 * Injects a unique X-Request-ID into every request/response.
 * This ID is propagated to the ML engine and appears in all error envelopes.
 */
export async function requestIdHook(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  (req as any).requestId = requestId;
  reply.header('X-Request-ID', requestId);
  // Security headers
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'DENY');
}
