import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const filings = sqliteTable('filings', {
  filing_id:             text('filing_id').primaryKey(),
  promoter_id:           text('promoter_id').notNull().references(() => users.user_id),
  company_name:          text('company_name').notNull(),
  cin:                   text('cin').notNull(),
  sector:                text('sector').notNull(),
  business_model_summary: text('business_model_summary'),
  status:                text('status', {
    enum: [
      'DRAFT_IN_PROGRESS', 'STAGE1_VALIDATED', 'AI_DRAFTING',
      'AI_DRAFT_READY', 'PENDING_REVIEW', 'UNDER_REVIEW',
      'CERTIFIED_LOCKED', 'SUBMISSION_READY',
    ],
  }).notNull().default('DRAFT_IN_PROGRESS'),
  completion_percent:    real('completion_percent').notNull().default(0),
  locked_at:             integer('locked_at'),
  locked_hash:           text('locked_hash'),
  engagement_code:       text('engagement_code'),  // Set when paired with intermediary
  created_at:            integer('created_at').notNull(),
  updated_at:            integer('updated_at').notNull(),
});

export const filingAssignments = sqliteTable('filing_assignments', {
  assignment_id:   text('assignment_id').primaryKey(),
  filing_id:       text('filing_id').notNull().references(() => filings.filing_id),
  user_id:         text('user_id').notNull().references(() => users.user_id),
  assigned_role:   text('assigned_role', { enum: ['MERCHANT_BANKER', 'LEGAL_COUNSEL', 'AUDITOR'] }).notNull(),
  assigned_at:     integer('assigned_at').notNull(),
});
