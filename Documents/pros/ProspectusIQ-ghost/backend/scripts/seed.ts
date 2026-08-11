/**
 * seed.ts — Seeds the database with a demo user and demo filing.
 * Run once: cd backend && npx tsx scripts/seed.ts
 *
 * Demo credentials:
 *   Email:    demo@prospectusiq.com
 *   Password: demo1234
 *   OTP:      123456
 */

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = path.resolve(__dirname, '..', 'sqlite.db');
const sqlite = new Database(DB_PATH);

const DEMO_USER_ID   = 'demo-user-001';
const DEMO_FILING_ID = 'FL-2026-ABC-01';
const DEMO_EMAIL     = 'demo@prospectusiq.com';
const DEMO_PASSWORD  = 'demo1234';

const SECTION_KEYS = [
  'CH_01', 'CH_02', 'CH_03', 'CH_04', 'CH_05',
  'CH_06', 'CH_07', 'CH_08', 'CH_09', 'CH_10', 'CH_11',
];

const SECTION_LABELS: Record<string, string> = {
  CH_01: 'Cover Page & General Information',
  CH_02: 'Risk Factors',
  CH_03: 'Introduction',
  CH_04: 'Objects of the Issue',
  CH_05: 'Basic Terms of the Issue',
  CH_06: 'Basis for Issue Price',
  CH_07: 'Financial Information',
  CH_08: 'Legal & Other Information',
  CH_09: 'Promoter & Management',
  CH_10: 'Issue Related Information',
  CH_11: 'Other Regulatory Disclosures',
};

async function seed() {
  const now = Date.now();

  // ── 1. Create demo user if not exists ───────────────────────────────────
  const existingUser = sqlite.prepare('SELECT user_id FROM users WHERE email = ?').get(DEMO_EMAIL);
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    sqlite.prepare(`
      INSERT INTO users (user_id, email, password_hash, role, intermediary_role, full_name, company_name, kyc_status, created_at, updated_at)
      VALUES (?, ?, ?, 'INTERMEDIARY', 'LEGAL_COUNSEL', 'Priya Shah (Lead Counsel)', 'ProspectusIQ Demo', 'VERIFIED', ?, ?)
    `).run(DEMO_USER_ID, DEMO_EMAIL, passwordHash, now, now);
    console.log(`✓ Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  } else {
    console.log('ℹ Demo user already exists, skipping.');
  }

  // ── 2. Create demo filing if not exists ─────────────────────────────────
  const existingFiling = sqlite.prepare('SELECT filing_id FROM filings WHERE filing_id = ?').get(DEMO_FILING_ID);
  if (!existingFiling) {
    sqlite.prepare(`
      INSERT INTO filings (filing_id, promoter_id, company_name, cin, sector, business_model_summary, status, completion_percent, engagement_code, created_at, updated_at)
      VALUES (?, ?, 'TechNova Solutions Ltd', 'U72900MH2024PTC123456', 'Technology', 'AI-powered fintech solutions for SME capital markets.', 'DRAFT_IN_PROGRESS', 0, 'MB-SEBI-2026-X942', ?, ?)
    `).run(DEMO_FILING_ID, DEMO_USER_ID, now, now);
    console.log(`✓ Created demo filing: ${DEMO_FILING_ID}`);
  } else {
    console.log('ℹ Demo filing already exists, skipping.');
  }

  // ── 3. Create filing assignment so INTERMEDIARY role passes scope check ─
  const existingAssign = sqlite.prepare('SELECT assignment_id FROM filing_assignments WHERE filing_id = ? AND user_id = ?').get(DEMO_FILING_ID, DEMO_USER_ID);
  if (!existingAssign) {
    sqlite.prepare(`
      INSERT INTO filing_assignments (assignment_id, filing_id, user_id, assigned_role, assigned_at)
      VALUES (?, ?, ?, 'LEGAL_COUNSEL', ?)
    `).run(uuidv4(), DEMO_FILING_ID, DEMO_USER_ID, now);
    console.log(`✓ Created filing assignment for demo user on ${DEMO_FILING_ID}`);
  } else {
    console.log('ℹ Filing assignment already exists, skipping.');
  }

  // ── 4. Create sections for the demo filing ──────────────────────────────
  const insertSection = sqlite.prepare(`
    INSERT OR IGNORE INTO sections (section_id, filing_id, section_key, section_label, status, completion_percent, flag_count_critical, flag_count_review, flag_count_resolved, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'NOT_STARTED', 0, 0, 0, 0, ?, ?)
  `);
  for (const key of SECTION_KEYS) {
    insertSection.run(uuidv4(), DEMO_FILING_ID, key, SECTION_LABELS[key] || key, now, now);
  }
  console.log(`✓ Created ${SECTION_KEYS.length} sections for demo filing.`);

  console.log('\n🚀 Seed complete!');
  console.log(`   Demo login → Email: ${DEMO_EMAIL}  Password: ${DEMO_PASSWORD}`);
  sqlite.close();
}

seed().catch(e => {
  console.error('Seed failed:', e);
  process.exit(1);
});
