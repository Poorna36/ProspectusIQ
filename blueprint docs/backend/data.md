# Backend Section — Database Schemas & Data Models
### ProspectusIQ SME IPO Platform · Persistence Layer

---

## 1. Entity-Relationship Summary

To maximize hackathon velocity and minimize infrastructure setup, the database uses **SQLite**, managed via Drizzle ORM. The SQLite file (`sqlite.db`) will be stored locally in the backend directory.

```
users ──────────────────────────────────────────────────────────┐
  │ (promoter creates)                                          │
  ▼                                                             │
filings ──────────────────┐                                     │
  │                       │                                     │
  │ (has many)            │ (has many)                          │
  ▼                       ▼                                     │
sections              filing_assignments ◄────── users (intermediary)
  │                                                             │
  │ (has many)                                                  │
  ├──► section_inputs                                           │
  ├──► ai_section_drafts                                        │
  ├──► flags ──── (resolved_by) ──────────────────────────── users
  ├──► comments ─ (author_id) ───────────────────────────── users
  └──► certifications ─ (certified_by) ──────────────────── users

filings ──► audit_events
filings ──► due_diligence_results
filings ──► documents (uploaded files)
```

---

## 2. Core Entity Schemas (TypeScript / Drizzle ORM shapes)

*Note: Since SQLite does not have native Enum or strict JSONB types, Drizzle will map Enums to text fields and JSON objects to text strings behind the scenes. The TypeScript layer ensures type safety.*

### 2.1 `users`
Represents all authenticatable accounts on the platform.

```typescript
interface User {
  user_id:              string;     // PK, UUID v4
  email:                string;     // UNIQUE, NOT NULL
  password_hash:        string;     // NOT NULL, bcrypt
  role:                 'PROMOTER' | 'INTERMEDIARY' | 'ADMIN';  // Stored as TEXT
  intermediary_role:    'MERCHANT_BANKER' | 'LEGAL' | 'AUDITOR' | null;
  full_name:            string;     // NOT NULL
  company_name:         string | null;
  kyc_status:           'PENDING' | 'VERIFIED' | 'REJECTED';
  created_at:           number;     // SQLite timestamp (Unix epoch)
  updated_at:           number;
}
```

### 2.2 `filings`
The core aggregate root for a single company's DRHP process.

```typescript
interface Filing {
  filing_id:            string;     // PK, UUID v4
  promoter_id:          string;     // FK → users.user_id, NOT NULL
  company_name:         string;     // NOT NULL
  cin:                  string;     // NOT NULL, Company Identification Number
  sector:               string;     // NOT NULL
  business_model_summary: string | null;
  status:               FilingStatus;  // Stored as TEXT
  completion_percent:   number;     // DEFAULT 0 (0–100)
  locked_at:            number | null;
  locked_hash:          string | null; // SHA-256 of final document at lock time
  created_at:           number;
  updated_at:           number;
}

type FilingStatus =
  | 'DRAFT_IN_PROGRESS'
  | 'STAGE1_VALIDATED'
  | 'AI_DRAFTING'
  | 'AI_DRAFT_READY'
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'CERTIFIED_LOCKED'
  | 'SUBMISSION_READY';
```

### 2.3 `sections`
A specific chapter within a filing (e.g., "Risk Factors").

```typescript
interface Section {
  section_id:           string;     // PK, UUID v4
  filing_id:            string;     // FK → filings.filing_id, NOT NULL
  section_key:          SectionKey; // Stored as TEXT
  status:               SectionStatus;
  completion_percent:   number;
  flag_count_critical:  number;     // DEFAULT 0
  flag_count_review:    number;     // DEFAULT 0
  flag_count_resolved:  number;     // DEFAULT 0
  created_at:           number;
  updated_at:           number;
}
```

### 2.4 `section_inputs`
The raw structured data submitted by the frontend.

```typescript
interface SectionInput {
  input_id:             string;     // PK, UUID v4
  section_id:           string;     // FK → sections.section_id, NOT NULL
  input_version:        number;     // DEFAULT 1 (incremented on each PUT)
  variables:            Record<string, unknown>;  // Stored as TEXT (JSON stringified)
  submitted_by:         string;     // FK → users.user_id
  submitted_at:         number;
}
```

### 2.5 `ai_section_drafts`
The output from the Python ML layer.

```typescript
interface AiSectionDraft {
  draft_id:                string;  // PK, UUID v4
  section_id:              string;  // FK → sections.section_id, NOT NULL
  draft_version:           number;
  drafted_text:            string;  // NOT NULL
  source_variables_used:   string[];  // Stored as TEXT (JSON stringified array)
  rules_engine_status:     'PASS' | 'FAIL';
  verifier_status:         'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_HUMAN_REVIEW';
  verifier_confidence:     number;  // REAL / Float
  verifier_flags:          VerifierFlag[];  // Stored as TEXT (JSON stringified)
  human_edited_text:       string | null;
  human_edited_by:         string | null;
  created_at:              number;
}
```

### 2.6 `flags`
Compliance or completeness issues detected by Rules Engine, Verifier, or Human.

```typescript
interface Flag {
  flag_id:              string;     // PK, UUID v4
  filing_id:            string;     // FK → filings.filing_id, NOT NULL
  section_id:           string | null;
  source:               'RULES_ENGINE' | 'VERIFIER' | 'HUMAN';
  severity:             'CRITICAL' | 'REVIEW' | 'INFO';
  status:               'OPEN' | 'RESOLVED' | 'ESCALATED';
  type:                 string;
  description:          string;
  clause_reference:     string | null;
  resolution_note:      string | null;
  created_at:           number;
  resolved_at:          number | null;
  resolved_by:          string | null;
}
```

### 2.7 `certifications`
Role-based sign-offs from intermediaries.

```typescript
interface Certification {
  certification_id:     string;     // PK, UUID v4
  filing_id:            string;     // FK → filings.filing_id, NOT NULL
  certified_by:         string;     // FK → users.user_id, NOT NULL
  certifier_role:       'MERCHANT_BANKER' | 'LEGAL' | 'AUDITOR';
  declaration_text:     string;
  signature_hash:       string;
  certified_at:         number;
}
```

### 2.8 `audit_events`
Immutable, append-only log of all system transitions.

```typescript
interface AuditEvent {
  event_id:             string;     // PK, UUID v4
  filing_id:            string | null;
  event_type:           string;
  actor_id:             string | null;
  actor_type:           'USER' | 'SYSTEM' | 'AI_ENGINE' | 'RULES_ENGINE';
  payload:              Record<string, unknown>;  // Stored as TEXT (JSON stringified)
  timestamp:            number;
}
```

---

## 3. Database Indexes (SQLite Optimizations)

| Table | Index | Type | Rationale |
|---|---|---|---|
| `filings` | `(promoter_id)` | B-tree | Promoter dashboard lookups |
| `sections` | `(filing_id, section_key)` | B-tree, UNIQUE | Fast exact section lookup |
| `flags` | `(filing_id, status)` | B-tree | Render open flags per filing |

---

## 4. Variable Naming Convention

All extracted data points submitted by the frontend and parsed by the rules engine follow a strict tagging schema (stored in `section_inputs.variables`):

`variable_{metric}_{period}_{unit?}`

**Examples:**
- `variable_revenue_FY26` (number, INR)
- `variable_pat_FY26` (number, INR)
- `variable_customer_concentration_top5_pct` (number, 0-100)
