import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  user_id:           text('user_id').primaryKey(),
  email:             text('email').notNull().unique(),
  password_hash:     text('password_hash').notNull(),
  role:              text('role', { enum: ['PROMOTER', 'INTERMEDIARY', 'ADMIN'] }).notNull(),
  intermediary_role: text('intermediary_role', { enum: ['MERCHANT_BANKER', 'LEGAL_COUNSEL', 'AUDITOR'] }),
  full_name:         text('full_name').notNull(),
  company_name:      text('company_name'),
  kyc_status:        text('kyc_status', { enum: ['PENDING', 'VERIFIED', 'REJECTED'] }).notNull().default('PENDING'),
  pan_number_encrypted:      text('pan_number_encrypted'),
  aadhaar_number_encrypted:  text('aadhaar_number_encrypted'),
  bank_account_encrypted:    text('bank_account_encrypted'),
  refresh_token:     text('refresh_token'),  // SQLite session storage (replaces Redis)
  created_at:        integer('created_at').notNull(),
  updated_at:        integer('updated_at').notNull(),
});
