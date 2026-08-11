import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { filings } from './filings';

export const certifications = sqliteTable('certifications', {
  certification_id: text('certification_id').primaryKey(),
  filing_id:        text('filing_id').notNull().references(() => filings.filing_id),
  certified_by:     text('certified_by').notNull(),
  certifier_role:   text('certifier_role', { enum: ['MERCHANT_BANKER', 'LEGAL_COUNSEL', 'AUDITOR'] }).notNull(),
  declaration_text: text('declaration_text').notNull(),
  signature_hash:   text('signature_hash').notNull(),
  certified_at:     integer('certified_at').notNull(),
});

export const comments = sqliteTable('comments', {
  comment_id:       text('comment_id').primaryKey(),
  filing_id:        text('filing_id').notNull().references(() => filings.filing_id),
  section_id:       text('section_id').notNull(),
  author_id:        text('author_id').notNull(),
  type:             text('type', { enum: ['COMMENT', 'CLARIFICATION_REQUEST', 'CHANGE_REQUEST'] }).notNull(),
  content:          text('content').notNull(),
  parent_comment_id: text('parent_comment_id'),
  created_at:       integer('created_at').notNull(),
});

export const documents = sqliteTable('documents', {
  document_id:    text('document_id').primaryKey(),
  filing_id:      text('filing_id').notNull().references(() => filings.filing_id),
  document_type:  text('document_type', {
    enum: ['FINANCIAL_STATEMENT', 'VENDOR_QUOTE', 'PROMOTER_ID', 'OTHER'],
  }).notNull(),
  section_id:     text('section_id'),
  filename:       text('filename').notNull(),
  file_path:      text('file_path').notNull(),
  file_size:      integer('file_size').notNull(),
  status:         text('status', { enum: ['PROCESSING', 'READY', 'ERROR'] }).notNull().default('PROCESSING'),
  uploaded_by:    text('uploaded_by').notNull(),
  uploaded_at:    integer('uploaded_at').notNull(),
});

export const dueDiligenceResults = sqliteTable('due_diligence_results', {
  result_id:    text('result_id').primaryKey(),
  filing_id:    text('filing_id').notNull().references(() => filings.filing_id),
  check_type:   text('check_type', { enum: ['MCA21', 'GSTIN', 'ECOURTS'] }).notNull(),
  entity_id:    text('entity_id').notNull(),
  entity_type:  text('entity_type', { enum: ['DIRECTOR', 'COMPANY', 'VENDOR'] }).notNull(),
  status:       text('status', { enum: ['CLEAR', 'FLAGGED', 'PENDING', 'ERROR'] }).notNull().default('PENDING'),
  details:      text('details').notNull().default('{}'),  // JSON
  flags:        text('flags').notNull().default('[]'),    // JSON array of strings
  checked_at:   integer('checked_at').notNull(),
  expires_at:   integer('expires_at').notNull(),
});
