import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { filings } from './filings';

export const flags = sqliteTable('flags', {
  flag_id:          text('flag_id').primaryKey(),
  filing_id:        text('filing_id').notNull().references(() => filings.filing_id),
  section_id:       text('section_id'),
  source:           text('source', { enum: ['RULES_ENGINE', 'VERIFIER', 'HUMAN'] }).notNull(),
  severity:         text('severity', { enum: ['CRITICAL', 'REVIEW', 'INFO'] }).notNull(),
  status:           text('status', { enum: ['OPEN', 'RESOLVED', 'ESCALATED'] }).notNull().default('OPEN'),
  type:             text('type').notNull(),
  description:      text('description').notNull(),
  clause_reference: text('clause_reference'),
  resolution_note:  text('resolution_note'),
  escalation_note:  text('escalation_note'),
  created_at:       integer('created_at').notNull(),
  resolved_at:      integer('resolved_at'),
  resolved_by:      text('resolved_by'),
});
