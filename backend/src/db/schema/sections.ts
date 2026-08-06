import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { filings } from './filings';

export const sections = sqliteTable('sections', {
  section_id:           text('section_id').primaryKey(),
  filing_id:            text('filing_id').notNull().references(() => filings.filing_id),
  section_key:          text('section_key').notNull(),
  section_label:        text('section_label').notNull(),
  status:               text('status', {
    enum: [
      'NOT_STARTED', 'INPUT_RECEIVED', 'STAGE1_VALIDATED',
      'AI_DRAFTING', 'AI_DRAFT_READY', 'HUMAN_EDITING', 'CERTIFIED_LOCKED',
    ],
  }).notNull().default('NOT_STARTED'),
  completion_percent:   real('completion_percent').notNull().default(0),
  flag_count_critical:  integer('flag_count_critical').notNull().default(0),
  flag_count_review:    integer('flag_count_review').notNull().default(0),
  flag_count_resolved:  integer('flag_count_resolved').notNull().default(0),
  created_at:           integer('created_at').notNull(),
  updated_at:           integer('updated_at').notNull(),
});

export const sectionInputs = sqliteTable('section_inputs', {
  input_id:       text('input_id').primaryKey(),
  section_id:     text('section_id').notNull().references(() => sections.section_id),
  input_version:  integer('input_version').notNull().default(1),
  variables:      text('variables').notNull(),  // JSON stringified
  submitted_by:   text('submitted_by').notNull(),
  submitted_at:   integer('submitted_at').notNull(),
});
