import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { filings } from './filings';

export const auditEvents = sqliteTable('audit_events', {
  event_id:   text('event_id').primaryKey(),
  filing_id:  text('filing_id').references(() => filings.filing_id),
  event_type: text('event_type').notNull(),
  actor_id:   text('actor_id'),
  actor_type: text('actor_type', {
    enum: ['USER', 'SYSTEM', 'AI_ENGINE', 'RULES_ENGINE'],
  }).notNull(),
  actor_name: text('actor_name'),
  payload:    text('payload').notNull().default('{}'),  // JSON
  hash:       text('hash').notNull(),  // SHA-256 of (event_type + actor_id + payload + timestamp)
  timestamp:  integer('timestamp').notNull(),
});

export const messages = sqliteTable('messages', {
  id:             text('id').primaryKey(),
  filing_id:      text('filing_id').notNull().references(() => filings.filing_id),
  sender_user_id: text('sender_user_id').notNull(),
  sender_role:    text('sender_role').notNull(),
  text:           text('text').notNull(),
  attachment_url: text('attachment_url'),
  timestamp:      integer('timestamp').notNull(),
});

export const notifications = sqliteTable('notifications', {
  id:        text('id').primaryKey(),
  user_id:   text('user_id').notNull(),
  filing_id: text('filing_id'),
  type:      text('type').notNull(),  // 'FLAG_RAISED' | 'CLARIFICATION_REQUESTED' | etc.
  message:   text('message').notNull(),
  is_read:   integer('is_read', { mode: 'boolean' }).notNull().default(false),
  timestamp: integer('timestamp').notNull(),
});
