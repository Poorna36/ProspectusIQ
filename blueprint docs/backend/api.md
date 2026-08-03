# Backend Section — API Specification
### ProspectusIQ SME IPO Platform · Route Contracts & Response Schemas

---

## Configuration & Customization Notes

> When adding or modifying API endpoints, the following invariants must be maintained:
>
> 1. All endpoints must return the **Standard API Response Wrapper** defined in Section 1.
> 2. Schema changes in `data.md` must be reflected here simultaneously — request/response bodies derive directly from DB entities.
> 3. HTTP method and path changes to existing endpoints constitute breaking changes and require a version increment (e.g., `/v2/...`).
> 4. Role/scope changes must be reflected in `../security/auth.md` RBAC matrix simultaneously.
> 5. All new endpoints must be added to the appropriate logical group. Do not create ad-hoc route trees.

---

## 1. Standard API Response Wrapper

All endpoints return this envelope. No endpoint may return a raw object outside this wrapper.

```typescript
// Success
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    requestId: string;      // UUID v4 — injected by API Gateway, propagated through
  };
}

// Error
interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;        // Machine-readable (see §2)
    message: string;        // Human-readable — safe to display to the user
    details?: unknown;      // Field-level validation errors or additional context
    requestId: string;
  };
}
```

---

## 2. Global Error Code Registry

| HTTP Status | Error Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Request body or params failed schema validation |
| 401 | `UNAUTHORIZED` | Missing, expired, or invalid JWT token |
| 403 | `FORBIDDEN` | Authenticated but insufficient role or filing-scope |
| 403 | `STEP_UP_REQUIRED` | Action requires re-verification; includes `otpChannel` in details |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | State conflict (e.g., filing already in `CERTIFIED_LOCKED`) |
| 422 | `UNPROCESSABLE` | Business rule violation (e.g., unresolved CRITICAL flags on certification attempt) |
| 429 | `RATE_LIMITED` | Request frequency limit exceeded |
| 500 | `INTERNAL_ERROR` | Unhandled server error (stack trace logged, never returned to client) |
| 502 | `EXTERNAL_API_ERROR` | Upstream third-party API (MCA21, GSTIN) failed |
| 503 | `SERVICE_UNAVAILABLE` | Dependent internal service (AI engine, rules engine) unreachable |

---

## 3. Group A — Authentication

### `POST /auth/register`
Register a new user account.

**Authorization:** Public

**Request Body:**
```typescript
{
  email:       string;                        // Valid email format
  password:    string;                        // Minimum 12 characters
  fullName:    string;
  role:        'PROMOTER' | 'INTERMEDIARY';
  companyName: string | null;
  kycToken:    string;                        // Opaque token from DigiLocker / KYC provider
}
```

**Response `201`:**
```typescript
{
  userId:    string;   // UUID
  email:     string;
  role:      string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;   // ISO 8601
}
```

---

### `POST /auth/login`
Authenticate and issue access + refresh tokens.

**Authorization:** Public

**Request Body:**
```typescript
{
  email:             string;
  password:          string;
  otpCode:           string | null;   // Required when MFA is enforced
  deviceFingerprint: string | null;
}
```

**Response `200`:**
```typescript
{
  accessToken:  string;   // JWT, RS256, 15-minute expiry
  refreshToken: string;   // Opaque, 7-day expiry, stored in Redis
  expiresIn:    900;      // Seconds
  user: {
    userId:           string;
    email:            string;
    role:             'PROMOTER' | 'INTERMEDIARY' | 'ADMIN';
    intermediaryRole: 'MERCHANT_BANKER' | 'LEGAL' | 'AUDITOR' | null;
  };
}
```

---

### `POST /auth/token/refresh`
Exchange a refresh token for a new access token (with token rotation).

**Authorization:** Public (refresh token in body)

**Request Body:**
```typescript
{ refreshToken: string; }
```

**Response `200`:**
```typescript
{ accessToken: string; expiresIn: 900; }
```

---

### `POST /auth/logout`
Invalidate refresh token.

**Authorization:** `Bearer <accessToken>`

**Request Body:**
```typescript
{ refreshToken: string; }
```

**Response `204`:** Empty body.

---

### `POST /auth/mfa/send-otp`
Dispatch a one-time password for MFA or step-up authentication.

**Authorization:** Public (pre-login) or `Bearer <accessToken>` (step-up)

**Request Body:**
```typescript
{ email: string; channel: 'EMAIL' | 'SMS'; }
```

**Response `200`:**
```typescript
{ otpSent: true; expiresInSeconds: 300; }
```

---

## 4. Group B — Filings

### `GET /filings`
List all filings visible to the authenticated user.

**Authorization:** `Bearer <accessToken>` · Roles: All

**Query Params:**
```typescript
status?:   FilingStatus;
page?:     number;          // Default: 1
pageSize?: number;          // Default: 20, max: 100
```

**Response `200`:**
```typescript
Array<{
  filingId:               string;
  companyName:            string;
  cin:                    string;
  status:                 FilingStatus;
  completionPercent:      number;          // 0–100
  createdAt:              string;
  updatedAt:              string;
  assignedIntermediaries: Array<{
    userId:           string;
    intermediaryRole: string;
  }>;
}>
```

---

### `POST /filings`
Create a new filing.

**Authorization:** `Bearer <accessToken>` · Role: `PROMOTER`

**Request Body:**
```typescript
{
  companyName:          string;
  cin:                  string;
  sector:               string;
  businessModelSummary: string;
}
```

**Response `201`:**
```typescript
{
  filingId:  string;
  status:    'DRAFT_IN_PROGRESS';
  createdAt: string;
}
```

---

### `GET /filings/:filingId`
Get full filing detail including section summary.

**Authorization:** `Bearer <accessToken>` · Filing-scoped

**Response `200`:**
```typescript
{
  filingId:          string;
  companyName:       string;
  cin:               string;
  sector:            string;
  status:            FilingStatus;
  completionPercent: number;
  lockedAt:          string | null;
  sections: Array<{
    sectionKey:        SectionKey;
    status:            SectionStatus;
    completionPercent: number;
    flagCount: {
      critical: number;
      review:   number;
      resolved: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}
```

---

### `PATCH /filings/:filingId/submit-to-intermediary`
Transition filing state to `PENDING_REVIEW`. Triggers final Stage 1 gate check.

**Authorization:** `Bearer <accessToken>` · Role: `PROMOTER`

**Request Body:** `{}` (empty — state transition only)

**Response `200`:**
```typescript
{ filingId: string; status: 'PENDING_REVIEW'; updatedAt: string; }
```

**Error `422`:** Returned when critical flags remain unresolved. `details` contains flag count by section.

---

## 5. Group C — Sections

### `GET /filings/:filingId/sections/:sectionKey`
Get a specific DRHP section with full AI draft detail.

**Authorization:** `Bearer <accessToken>` · Filing-scoped

**Path Params:**
```
filingId:   uuid
sectionKey: SectionKey  (see data.md §2.3 for full enum)
```

**Response `200`:**
```typescript
{
  sectionKey:        SectionKey;
  status:            SectionStatus;
  completionPercent: number;
  inputData:         Record<string, unknown> | null;   // Latest section_inputs.variables
  aiDraft: {
    draftedText:          string;
    sourceVariablesUsed:  string[];
    rulesEngineStatus:    'PASS' | 'FAIL';
    verifierStatus:       'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_HUMAN_REVIEW';
    verifierConfidence:   number;         // 0.0 – 1.0
    verifierFlags: Array<{
      type:            VerifierFlagType;
      clauseReference: string;
      justification:   string;
    }>;
    retryCount: number;
  } | null;
  humanEditedText: string | null;
  humanEditedBy:   string | null;         // userId
  humanEditedAt:   string | null;
  certifiedAt:     string | null;
  updatedAt:       string;
}
```

---

### `PUT /filings/:filingId/sections/:sectionKey/inputs`
Submit or update structured input data for a section. Dispatches Stage 1 pre-AI validation job.

**Authorization:** `Bearer <accessToken>` · Role: `PROMOTER`

**Request Body:**
```typescript
{
  inputs: Record<string, unknown>;  // variable_* tagged values (see data.md §2.4)
}
```

**Response `200`:**
```typescript
{
  sectionKey: SectionKey;
  status:     'DRAFT_IN_PROGRESS';
  jobId:      string;              // BullMQ job ID for status tracking
}
```

---

### `PATCH /filings/:filingId/sections/:sectionKey/human-edit`
Submit intermediary's redlined or edited text for a section.

**Authorization:** `Bearer <accessToken>` · Role: `INTERMEDIARY`

**Request Body:**
```typescript
{
  editedText: string;
  comment:    string | null;
}
```

**Response `200`:**
```typescript
{ sectionKey: SectionKey; editedAt: string; }
```

---

## 6. Group D — Flags

### `GET /filings/:filingId/flags`
List all flags for a filing.

**Authorization:** `Bearer <accessToken>` · Filing-scoped

**Query Params:**
```typescript
severity?:  'CRITICAL' | 'REVIEW' | 'INFO';
status?:    'OPEN' | 'RESOLVED' | 'ESCALATED';
sectionKey?: SectionKey;
source?:    'RULES_ENGINE' | 'VERIFIER' | 'HUMAN';
```

**Response `200`:**
```typescript
Array<{
  flagId:          string;
  sectionKey:      SectionKey | null;
  source:          'RULES_ENGINE' | 'VERIFIER' | 'HUMAN';
  severity:        'CRITICAL' | 'REVIEW' | 'INFO';
  status:          'OPEN' | 'RESOLVED' | 'ESCALATED';
  type:            FlagType;
  description:     string;
  clauseReference: string | null;
  createdAt:       string;
  resolvedAt:      string | null;
  resolvedBy:      string | null;
}>
```

---

### `PATCH /filings/:filingId/flags/:flagId/resolve`
Mark a flag as resolved with a mandatory resolution note.

**Authorization:** `Bearer <accessToken>` · Role: `INTERMEDIARY`

**Request Body:**
```typescript
{ resolutionNote: string; }
```

**Response `200`:**
```typescript
{ flagId: string; status: 'RESOLVED'; resolvedAt: string; resolvedBy: string; }
```

---

### `POST /filings/:filingId/flags/:flagId/escalate`
Escalate a flag to critical, blocking certification.

**Authorization:** `Bearer <accessToken>` · Role: `INTERMEDIARY`

**Request Body:**
```typescript
{ escalationNote: string; }
```

**Response `200`:**
```typescript
{ flagId: string; status: 'ESCALATED'; escalatedAt: string; }
```

---

## 7. Group E — Certifications

### `POST /filings/:filingId/certifications`
Submit a role-based certification sign-off.

**Authorization:** `Bearer <accessToken>` · Role: `INTERMEDIARY` · **Step-Up Auth Required**

**Request Body:**
```typescript
{
  certifierRole:   'MERCHANT_BANKER' | 'LEGAL' | 'AUDITOR';
  declaration:     string;     // Attestation text (displayed in UI before submission)
  signatureHash:   string;     // SHA-256 of declaration text + UTC timestamp
}
```

**Response `201`:**
```typescript
{
  certificationId: string;
  filingId:        string;
  certifiedBy:     string;
  certifierRole:   string;
  certifiedAt:     string;
  filingStatus:    'CERTIFIED_LOCKED' | 'UNDER_REVIEW';
  // CERTIFIED_LOCKED only when all 3 roles have submitted
}
```

**Error `422`:** Returned if CRITICAL flags remain unresolved or role-scoped sections are not cleared.

---

### `GET /filings/:filingId/certifications`
List all certifications collected for a filing.

**Authorization:** `Bearer <accessToken>` · Filing-scoped

**Response `200`:**
```typescript
Array<{
  certificationId: string;
  certifiedBy:     string;
  certifierRole:   string;
  certifiedAt:     string;
}>
```

---

## 8. Group F — Comments

### `POST /filings/:filingId/sections/:sectionKey/comments`
Post a comment, clarification request, or change request on a section.

**Authorization:** `Bearer <accessToken>` · Filing-scoped

**Request Body:**
```typescript
{
  content:         string;
  type:            'COMMENT' | 'CLARIFICATION_REQUEST' | 'CHANGE_REQUEST';
  parentCommentId: string | null;   // For threaded replies
}
```

**Response `201`:**
```typescript
{
  commentId:       string;
  sectionKey:      SectionKey;
  type:            string;
  content:         string;
  authorId:        string;
  createdAt:       string;
  parentCommentId: string | null;
}
```

---

### `GET /filings/:filingId/sections/:sectionKey/comments`
Retrieve threaded comment list for a section.

**Authorization:** `Bearer <accessToken>` · Filing-scoped

**Response `200`:**
```typescript
Array<{
  commentId:       string;
  type:            string;
  content:         string;
  authorId:        string;
  authorName:      string;
  authorRole:      string;
  createdAt:       string;
  parentCommentId: string | null;
  replies:         Comment[];       // Nested thread (max 2 levels)
}>
```

---

## 9. Group G — Due Diligence

### `POST /filings/:filingId/due-diligence/run`
Dispatch all third-party due diligence checks asynchronously.

**Authorization:** `Bearer <accessToken>` · Role: `INTERMEDIARY | ADMIN`

**Request Body:**
```typescript
{
  checks:   Array<'MCA21' | 'GSTIN' | 'ECOURTS'>;
  entities: Array<{
    type: 'DIRECTOR' | 'COMPANY' | 'VENDOR';
    id:   string;   // DIN, CIN, or GSTIN
  }>;
}
```

**Response `202`:**
```typescript
{ jobId: string; status: 'QUEUED'; }
```

---

### `GET /filings/:filingId/due-diligence/results`
Retrieve completed due diligence results.

**Authorization:** `Bearer <accessToken>` · Filing-scoped

**Response `200`:**
```typescript
Array<{
  checkType:   'MCA21' | 'GSTIN' | 'ECOURTS';
  entityId:    string;
  entityType:  'DIRECTOR' | 'COMPANY' | 'VENDOR';
  status:      'CLEAR' | 'FLAGGED' | 'PENDING' | 'ERROR';
  details:     Record<string, unknown>;   // Provider-specific payload
  flags:       string[];                  // e.g., ['STRUCK_OFF', 'INSOLVENCY']
  checkedAt:   string;
  expiresAt:   string;
}>
```

---

## 10. Group H — Documents

### `POST /filings/:filingId/documents`
Upload a document (financial statement, vendor quote, etc.).

**Authorization:** `Bearer <accessToken>` · Role: `PROMOTER`

**Request:** `multipart/form-data`
```typescript
{
  file:         File;              // PDF or XLSX, max 50MB
  documentType: 'FINANCIAL_STATEMENT' | 'VENDOR_QUOTE' | 'PROMOTER_ID' | 'OTHER';
  sectionKey:   SectionKey | null;
}
```

**Response `202`:**
```typescript
{ documentId: string; status: 'PROCESSING'; jobId: string; }
```

---

## 11. Group I — Audit Trail

### `GET /filings/:filingId/audit-trail`
Retrieve the immutable, append-only event log for a filing.

**Authorization:** `Bearer <accessToken>` · Filing-scoped

**Query Params:**
```typescript
page?:      number;
pageSize?:  number;      // Max 100
eventType?: AuditEventType;
```

**Response `200`:**
```typescript
Array<{
  eventId:    string;
  eventType:  AuditEventType;
  actorId:    string | null;
  actorType:  'USER' | 'SYSTEM' | 'AI_ENGINE' | 'RULES_ENGINE';
  actorName:  string | null;
  payload:    Record<string, unknown>;
  timestamp:  string;
}>
```

---

## 12. Group J — Admin

### `GET /admin/users`
List all users on the platform.

**Authorization:** `Bearer <accessToken>` · Role: `ADMIN`

**Query Params:**
```typescript
role?:       'PROMOTER' | 'INTERMEDIARY';
kycStatus?:  'PENDING' | 'VERIFIED' | 'REJECTED';
page?:       number;
pageSize?:   number;
```

**Response `200`:**
```typescript
Array<{
  userId:    string;
  email:     string;
  fullName:  string;
  role:      string;
  kycStatus: string;
  createdAt: string;
}>
```

---

### `POST /admin/filings/:filingId/assign`
Assign an intermediary to a filing.

**Authorization:** `Bearer <accessToken>` · Role: `ADMIN`

**Request Body:**
```typescript
{
  userId:       string;
  assignedRole: 'MERCHANT_BANKER' | 'LEGAL' | 'AUDITOR';
}
```

**Response `201`:**
```typescript
{ assignmentId: string; filingId: string; userId: string; assignedRole: string; }
```

---

## 13. Internal Service Endpoints (Not User-Facing)

These endpoints are called by `core-api` workers only. They are not routed through the API Gateway and are inaccessible from the internet.

### `POST /validate` (rules-engine service)
Execute Stage 1 validation checks on section input or AI draft.

**Caller:** `core-api` worker · **Auth:** Internal service token

**Request Body:**
```typescript
{
  filingId:       string;
  sectionKey:     SectionKey;
  inputVariables: Record<string, unknown>;
  draftedText?:   string | null;   // Present only for post-AI validation pass
  stage:          'PRE_AI' | 'POST_AI';
}
```

**Response `200`:**
```typescript
{
  status: 'PASS' | 'FAIL';
  flags:  Array<{
    type:            FlagType;
    severity:        'CRITICAL' | 'REVIEW' | 'INFO';
    description:     string;
    clauseReference: string | null;
  }>;
  taggedVariables: Record<string, unknown>;   // Annotated variable_* map
}
```

---

### `POST /pipeline/draft-section` (ai-engine service)
Trigger AI drafting for a section. Called by `ai-draft.worker.ts`.

**Caller:** `core-api` worker · **Auth:** Internal service token

**Request Body:**
```typescript
{
  filingId:        string;
  sectionKey:      SectionKey;
  inputVariables:  Record<string, unknown>;
  ragEnabled:      boolean;
  maxRetries:      number;
  requestId:       string;
}
```

**Response `200`:**
```typescript
{
  section:              SectionKey;
  draftedText:          string;
  sourceVariablesUsed:  string[];
  rulesEngineStatus:    'PASS' | 'FAIL';
  verifierStatus:       'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_HUMAN_REVIEW';
  verifierConfidence:   number;
  verifierFlags:        VerifierFlag[];
  retryCount:           number;
  modelVersion:         string;
}
```
