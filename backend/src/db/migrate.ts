/**
 * Database migration — creates all tables if they don't exist.
 * Run once on startup via server.ts.
 */
import { sqlite } from './connection';

export function runMigrations(): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id           TEXT PRIMARY KEY,
      email             TEXT NOT NULL UNIQUE,
      password_hash     TEXT NOT NULL,
      role              TEXT NOT NULL CHECK(role IN ('PROMOTER','INTERMEDIARY','ADMIN')),
      intermediary_role TEXT CHECK(intermediary_role IN ('MERCHANT_BANKER','LEGAL_COUNSEL','AUDITOR')),
      full_name         TEXT NOT NULL,
      company_name      TEXT,
      kyc_status        TEXT NOT NULL DEFAULT 'PENDING' CHECK(kyc_status IN ('PENDING','VERIFIED','REJECTED')),
      refresh_token     TEXT,
      created_at        INTEGER NOT NULL,
      updated_at        INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS filings (
      filing_id              TEXT PRIMARY KEY,
      promoter_id            TEXT NOT NULL REFERENCES users(user_id),
      company_name           TEXT NOT NULL,
      cin                    TEXT NOT NULL,
      sector                 TEXT NOT NULL,
      business_model_summary TEXT,
      status                 TEXT NOT NULL DEFAULT 'DRAFT_IN_PROGRESS',
      completion_percent     REAL NOT NULL DEFAULT 0,
      locked_at              INTEGER,
      locked_hash            TEXT,
      engagement_code        TEXT,
      created_at             INTEGER NOT NULL,
      updated_at             INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS filing_assignments (
      assignment_id TEXT PRIMARY KEY,
      filing_id     TEXT NOT NULL REFERENCES filings(filing_id),
      user_id       TEXT NOT NULL REFERENCES users(user_id),
      assigned_role TEXT NOT NULL,
      assigned_at   INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sections (
      section_id          TEXT PRIMARY KEY,
      filing_id           TEXT NOT NULL REFERENCES filings(filing_id),
      section_key         TEXT NOT NULL,
      section_label       TEXT NOT NULL,
      status              TEXT NOT NULL DEFAULT 'NOT_STARTED',
      completion_percent  REAL NOT NULL DEFAULT 0,
      flag_count_critical INTEGER NOT NULL DEFAULT 0,
      flag_count_review   INTEGER NOT NULL DEFAULT 0,
      flag_count_resolved INTEGER NOT NULL DEFAULT 0,
      created_at          INTEGER NOT NULL,
      updated_at          INTEGER NOT NULL,
      UNIQUE(filing_id, section_key)
    );

    CREATE TABLE IF NOT EXISTS section_inputs (
      input_id      TEXT PRIMARY KEY,
      section_id    TEXT NOT NULL REFERENCES sections(section_id),
      input_version INTEGER NOT NULL DEFAULT 1,
      variables     TEXT NOT NULL,
      submitted_by  TEXT NOT NULL,
      submitted_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_section_drafts (
      draft_id              TEXT PRIMARY KEY,
      section_id            TEXT NOT NULL REFERENCES sections(section_id),
      draft_version         INTEGER NOT NULL DEFAULT 1,
      drafted_text          TEXT NOT NULL,
      source_variables_used TEXT NOT NULL,
      rules_engine_status   TEXT NOT NULL,
      verifier_status       TEXT NOT NULL,
      verifier_confidence   REAL NOT NULL,
      verifier_flags        TEXT NOT NULL DEFAULT '[]',
      model_version         TEXT NOT NULL DEFAULT 'mock-v1',
      retry_count           INTEGER NOT NULL DEFAULT 0,
      human_edited_text     TEXT,
      human_edited_by       TEXT,
      human_edited_at       INTEGER,
      created_at            INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS flags (
      flag_id          TEXT PRIMARY KEY,
      filing_id        TEXT NOT NULL REFERENCES filings(filing_id),
      section_id       TEXT,
      source           TEXT NOT NULL,
      severity         TEXT NOT NULL,
      status           TEXT NOT NULL DEFAULT 'OPEN',
      type             TEXT NOT NULL,
      description      TEXT NOT NULL,
      clause_reference TEXT,
      resolution_note  TEXT,
      created_at       INTEGER NOT NULL,
      resolved_at      INTEGER,
      resolved_by      TEXT
    );

    CREATE TABLE IF NOT EXISTS certifications (
      certification_id TEXT PRIMARY KEY,
      filing_id        TEXT NOT NULL REFERENCES filings(filing_id),
      certified_by     TEXT NOT NULL,
      certifier_role   TEXT NOT NULL,
      declaration_text TEXT NOT NULL,
      signature_hash   TEXT NOT NULL,
      certified_at     INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS comments (
      comment_id        TEXT PRIMARY KEY,
      filing_id         TEXT NOT NULL REFERENCES filings(filing_id),
      section_id        TEXT NOT NULL,
      author_id         TEXT NOT NULL,
      type              TEXT NOT NULL,
      content           TEXT NOT NULL,
      parent_comment_id TEXT,
      created_at        INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      document_id   TEXT PRIMARY KEY,
      filing_id     TEXT NOT NULL REFERENCES filings(filing_id),
      document_type TEXT NOT NULL,
      section_id    TEXT,
      filename      TEXT NOT NULL,
      file_path     TEXT NOT NULL,
      file_size     INTEGER NOT NULL,
      status        TEXT NOT NULL DEFAULT 'PROCESSING',
      uploaded_by   TEXT NOT NULL,
      uploaded_at   INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS due_diligence_results (
      result_id   TEXT PRIMARY KEY,
      filing_id   TEXT NOT NULL REFERENCES filings(filing_id),
      check_type  TEXT NOT NULL,
      entity_id   TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'PENDING',
      details     TEXT NOT NULL DEFAULT '{}',
      flags       TEXT NOT NULL DEFAULT '[]',
      checked_at  INTEGER NOT NULL,
      expires_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_events (
      event_id   TEXT PRIMARY KEY,
      filing_id  TEXT REFERENCES filings(filing_id),
      event_type TEXT NOT NULL,
      actor_id   TEXT,
      actor_type TEXT NOT NULL,
      actor_name TEXT,
      payload    TEXT NOT NULL DEFAULT '{}',
      hash       TEXT NOT NULL,
      timestamp  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id             TEXT PRIMARY KEY,
      filing_id      TEXT NOT NULL REFERENCES filings(filing_id),
      sender_user_id TEXT NOT NULL,
      sender_role    TEXT NOT NULL,
      text           TEXT NOT NULL,
      attachment_url TEXT,
      timestamp      INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id        TEXT PRIMARY KEY,
      user_id   TEXT NOT NULL,
      filing_id TEXT,
      type      TEXT NOT NULL,
      message   TEXT NOT NULL,
      is_read   INTEGER NOT NULL DEFAULT 0,
      timestamp INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_filings_promoter ON filings(promoter_id);
    CREATE INDEX IF NOT EXISTS idx_sections_filing_key ON sections(filing_id, section_key);
    CREATE INDEX IF NOT EXISTS idx_flags_filing_status ON flags(filing_id, status);
    CREATE INDEX IF NOT EXISTS idx_audit_events_filing ON audit_events(filing_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_messages_filing ON messages(filing_id);
  `);

  console.log('[DB] Migrations complete — all tables ready');
}
