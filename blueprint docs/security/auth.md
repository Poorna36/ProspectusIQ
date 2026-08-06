# Security Section — Authentication, Authorization & Hardening
### ProspectusIQ SME IPO Platform · Security Boundary

---

## Overview

The platform handles unpublished, price-sensitive pre-IPO financial data. The architecture mandates a **Zero Trust** model. Security is verified at the API Gateway (authentication), verified again at the Core API (authorization/RBAC), and audited via an immutable append-only event log.

For the hackathon MVP, security implementation focuses on robust application-level controls (JWT, RBAC, Encryption) rather than complex cloud-provider infrastructure.

---

## 1. Authentication Lifecycle

### 1.1 Identity Verification (KYC)
Accounts are tied to legal identities.
- **Promoters:** PAN verification + Aadhaar eKYC via DigiLocker Oauth. Company CIN verified against Ministry of Corporate Affairs (MCA21).
- **Intermediaries:** Cross-referenced against SEBI Merchant Banker registry, Bar Council, or ICAI.
*Note: For the prototype, these 3rd party KYC endpoints can return mocked success responses to demonstrate the flow.*

### 1.2 Multi-Factor Authentication (MFA)
- Every login requires an Email/Password + OTP.
- **Step-Up Authentication:** Even with an active session, high-risk actions (e.g., Certifying a filing, modifying fund allocations) trigger an HTTP 403 `STEP_UP_REQUIRED`. The user must submit a fresh OTP via header `X-Step-Up-OTP` to complete the action.

### 1.3 Token Architecture
- **Access Token:** JWT (HS256 or RS256 using `.env` secrets). 15-minute expiry. Contains `userId`, `role`, and an array of `assignedFilingIds`.
- **Refresh Token:** Opaque, random, high-entropy string (UUID v4 + CSPRNG bytes). 7-day expiry. Stored in SQLite sessions table.
- **Token Rotation:** On every refresh request, the old refresh token is invalidated and a new one is issued. If a compromised, previously-used refresh token is presented, all active sessions for that user are immediately revoked.

---

## 2. Role-Based Access Control (RBAC) Matrix

Permissions are enforced via middleware in `core-api`, ensuring no user can manipulate filings outside their authorized scope.

| Action | Promoter | Intermediary | Admin |
|---|---|---|---|
| Create new filing | ✅ | ❌ | ✅ |
| Access filing | ✅ (own only) | ✅ (assigned only) | ✅ |
| Edit Section Inputs | ✅ (in draft state) | ❌ | ❌ |
| View AI Draft | ✅ (read-only) | ✅ | ✅ |
| Redline / Edit AI Draft | ❌ | ✅ | ❌ |
| Resolve/Escalate Flags | ❌ | ✅ | ❌ |
| Submit Certification | ❌ | ✅ (own sub-role only) | ❌ |
| View Audit Trail | ✅ | ✅ | ✅ |
| Run Due Diligence APIs | ❌ | ✅ | ✅ |

**Intermediary Sub-Roles (Separation of Duties):**
- `MERCHANT_BANKER` controls Business Overview, Objects of Issue.
- `LEGAL_COUNSEL` controls Risk Factors, Legal Proceedings.
- `AUDITOR` controls Financial Statements.
*An Auditor cannot certify the Legal sections.*

---

## 3. Cryptographic Security & Data Protection

### 3.1 Encryption Standards
- **In Transit:** Local HTTP is sufficient for localhost prototype development. For hosted demo deployments (e.g., Vercel / Render), HTTPS is enforced by the host.
- **At Rest (Field-Level):** Highly sensitive fields (PAN strings, Aadhaar strings, Bank Account numbers) are encrypted at the application level (AES-256-GCM) before being written to PostgreSQL.
- **Key Management:** Master encryption keys are stored securely in `.env` files for the MVP, rather than complex external KMS.

### 3.2 Document Integrity Lock
When all intermediaries certify a filing, the document enters `CERTIFIED_LOCKED` state.
- The `core-api` compiles the final text, computes a **SHA-256 hash**, and stores it in `filings.locked_hash`.
- Any subsequent attempt to mutate the document will fail the hash check during regulatory export.

### 3.3 Security Headers (API Gateway)
All HTTP responses must include:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'none';
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 4. Audit & Compliance

### 4.1 Immutable Audit Trail
- The `audit_events` table is append-only.
- The API explicitly lacks any `DELETE` or `UPDATE` routes targeting this table.
- Every state transition, login event, flag resolution, and certification is recorded here with timestamp, actor UUID, and IP Address.

### 4.2 Regulatory Alignment
Even as a prototype, the codebase demonstrates compliance with:
- **SEBI CSCRF:** Zero Trust, MFA, audit logs satisfy the Cybersecurity framework.
- **DPDP Act 2023:** KYC data retained strictly on consent; logs isolate PII via UUID references.


---

## 5. Engagement Code Pairing & Digital Signature Protocols

### 5.1 First-Time Setup Handshake (`Engagement Code`)
- **Issuance:** Lead Merchant Banker creates an engagement token (e.g. `MB-SEBI-2026-X942`) bound to the assigned Intermediary Team.
- **Verification:** When the SME Promoter registers on Interface A, providing the `Engagement Code` binds their account directly to the intermediary workspace via a secure RBAC link.

### 5.2 Digital Signature & Seal Bronze Lock
- **e-Sign Verification:** Interface B requires explicit digital signoff (SEBI Intermediary Registration No e.g. `INM000012345`) before a section is sealed.
- **Immutable Lock:** Applies the **Seal Bronze Stamp (`#A9762F`)** and writes a SHA-256 signed record to the `audit_events` table.
