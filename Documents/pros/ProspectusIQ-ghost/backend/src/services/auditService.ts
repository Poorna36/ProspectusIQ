import { createHash } from 'crypto';
import { db } from '../db/connection';
import { auditEvents } from '../db/schema/audit';
import { v4 as uuidv4 } from 'uuid';

interface AuditParams {
  filingId?: string | null;
  eventType: string;
  actorId?: string | null;
  actorType: 'USER' | 'SYSTEM' | 'AI_ENGINE' | 'RULES_ENGINE';
  actorName?: string | null;
  payload?: Record<string, unknown>;
}

export function writeAuditEvent(params: AuditParams): void {
  const now = Date.now();
  const payloadStr = JSON.stringify(params.payload || {});
  const hashInput = `${params.eventType}:${params.actorId || 'system'}:${payloadStr}:${now}`;
  const hash = createHash('sha256').update(hashInput).digest('hex');

  db.insert(auditEvents).values({
    event_id:   uuidv4(),
    filing_id:  params.filingId ?? null,
    event_type: params.eventType,
    actor_id:   params.actorId ?? null,
    actor_type: params.actorType,
    actor_name: params.actorName ?? null,
    payload:    payloadStr,
    hash,
    timestamp:  now,
  }).run();
}
