# File: Security_and_Authentication.md

# Security & Authentication Specification

**Context:** The platform handles unpublished, price-sensitive, pre-IPO company information. Security must be strong, low-friction, and cost-efficient for a hackathon-scale MVP.

**Guiding Principle:** Strong security is achieved through upfront infrastructure and design choices, minimizing repeated manual friction for the user.

---

### 1. Authentication (Interface A & Interface B)
*See also: `Platform_Architecture_Pipeline.md`*

* **1.1 Identity Verification at Onboarding (One-time cost):**
  * **Interface A (Company/Promoter):** PAN + Aadhaar-based e-KYC (via DigiLocker/UIDAI API) and company CIN verification against MCA21. Ties accounts to verifiable legal identities.
  * **Interface B (Intermediary):** Verification against SEBI registered databases (Bar Council, ICAI, Merchant Bankers register).
* **1.2 Everyday Login (Multi-Factor, Low Friction):**
  * Primary: Password/Passkey + OTP.
  * Support for Passkey/biometric (WebAuthn/FIDO2) on registered devices.
  * Risk-based step-up authentication triggers additional verification for unusual locations/devices or high-value actions (certification, fund-allocation edits).
* **1.3 Role-Based Access Control (RBAC):**
  * **Interface A:** Promoter access strictly isolated to their own filing.
  * **Interface B:** Intermediary access scoped by role (e.g., Auditor only sees financial sections) and assigned filings. Certifications are tied to individuals, not shared logins.
* **1.4 Cost-Efficient Implementation:**
  * Utilize pay-per-verification KYC/eSign providers instead of building custom KYC infrastructure.
  * Standard OAuth 2.0 / OpenID Connect for session management.

---

### 2. Encryption
* **2.1 In Transit:** TLS 1.3 for all client-server communication. HSTS enforced (no unencrypted fallbacks).
* **2.2 At Rest:**
  * AES-256 encryption for all documents and personal data.
  * Field-level encryption for hyper-sensitive fields (PAN, Aadhaar, bank/vendor details).
* **2.3 Key Management:** Dedicated Key Management Service (KMS). Keys are separated from the application database, rotated on a schedule, with strictly logged access.
* **2.4 Document-Level Protection:** Once certified and locked (Stage 3), the document becomes immutable and hashed to verify integrity.

---

### 3. Secure In-App Communication
* **3.1 Need for Protection:** Communication (clarifications, comment threads) references the same sensitive data as the document and requires equal security.
* **3.2 Design:**
  * Encrypted at rest and in transit.
  * Scoped exclusively to specific filings and threads (no open-ended, out-of-context chat).
  * Forms part of the immutable, timestamped, legally meaningful audit trail.
* **3.3 Access Control:**
  * Strict RBAC enforcement for reading and posting.
  * Sensitive message content stays inside the authenticated platform (notifications sent via email/SMS exclude actual content).

---

### 4. Legal Framework Compliance
* **4.1 SEBI Cybersecurity and Cyber Resilience Framework (CSCRF):**
  * Platform aligns with CSCRF’s Zero Trust access model, MFA, encryption, and audit-logging requirements from day one.
  * Exportable audit trails support mandatory CERT-In empanelled audits.
* **4.2 Information Technology Act, 2000:**
  * Meets Section 43A requirements for "reasonable security practices and procedures".
* **4.3 Digital Personal Data Protection Act, 2023 (DPDP Act):**
  * Implements consent-based processing, data retention limits, and robust security safeguards required by the forthcoming rules.
* **4.4 India's Digital Public Infrastructure (DPI) / API Setu:**
  * Due-diligence data flows leverage governed DPI access, adhering to established government gateway security standards.
  * *See also: `Platform_Architecture_Pipeline.md > Section 4.7`*
