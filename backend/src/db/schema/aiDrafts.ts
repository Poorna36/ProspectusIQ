import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sections } from './sections';

export const aiDrafts = sqliteTable('ai_section_drafts', {
  draft_id:              text('draft_id').primaryKey(),
  section_id:            text('section_id').notNull().references(() => sections.section_id),
  draft_version:         integer('draft_version').notNull().default(1),
  drafted_text:          text('drafted_text').notNull(),
  source_variables_used: text('source_variables_used').notNull(),  // JSON array
  rules_engine_status:   text('rules_engine_status', { enum: ['PASS', 'FAIL'] }).notNull(),
  verifier_status:       text('verifier_status', {
    enum: ['COMPLIANT', 'NON_COMPLIANT', 'NEEDS_HUMAN_REVIEW'],
  }).notNull(),
  verifier_confidence:   real('verifier_confidence').notNull(),
  verifier_flags:        text('verifier_flags').notNull().default('[]'),  // JSON array
  model_version:         text('model_version').notNull().default('mock-v1'),
  retry_count:           integer('retry_count').notNull().default(0),
  human_edited_text:     text('human_edited_text'),
  human_edited_by:       text('human_edited_by'),
  human_edited_at:       integer('human_edited_at'),
  created_at:            integer('created_at').notNull(),
});
