# File: Platform_Architecture_Pipeline.md

# AI-Assisted SME IPO Offer Document Platform
## Full System Architecture, Pipeline & Engine Specification

### 0. One-Line Pitch
A dual-interface, three-layer drafting platform where an AI engine accelerates offer-document creation, a hardcoded compliance-rules engine validates it against SEBI's ICDR/SME framework, and only certified intermediaries (merchant bankers, legal counsel, auditors) can review, edit and finally lock the document for regulatory submission — reducing DRHP preparation time and pre-empting the manual clarification queries SEBI currently has to issue.

---

### 1. High-Level System Architecture
**Core principle:** AI drafts, rules validate, humans certify. No document can move to submission-ready status without an explicit human sign-off action that cryptographically locks it.

| Layer | Component | Description | Output |
| :--- | :--- | :--- | :--- |
| **Input** | Interface A (Company / Promoter Portal) | Structured inputs, documents, financials, vendor quotes, family tree. | Raw Data |
| **Stage 1** | Hardcoded Rules Engine | Deterministic validation, API calls, schema checks. | Cleaned + Tagged Data |
| **Stage 2** | AI / ML Drafting Engine | LLM + NER + RAG + fine-tuned risk/narrative generation. | Draft offer document + flags + confidence scores |
| **Cross-Validation** | Cross-Validation Loop | Rules engine re-checks AI output before it reaches humans. | Validated Draft |
| **Stage 3** | Interface B (Intermediary Workbench) | Manual review, redline, comment, certify by Merchant Banker / Legal / Auditor. | Locked Draft |
| **Output** | Certified / Locked DRHP | Ready for SEBI submission. | Final Submission |

---

### 2. Interface A — Company / Promoter Portal
**Purpose:** Let a first-time SME promoter with no capital-markets expertise input everything needed, in plain language, without knowing SEBI terminology upfront.
*See also: `UIUX_Detailed_Frontend_Spec.md > Section 2`*

#### Modules
* **2.1 Guided Onboarding Wizard:** Sector selection, business model description, cap table. Plain-language Q&A that maps to legal disclosure fields.
* **2.2 Financial Data Upload:** Restated financial statements (XLSX/PDF ingestion). Auto-extraction of Revenue, PAT, EPS, RoNW, NAV via the Entity Extraction module (See: *Section 4.2*).
* **2.3 Promoter Group Family Tree Builder:** Interactive node-based tree. Feeds directly into the Promoter Group Network Mapper (See: *Section 4.5*) for hidden related-party detection.
* **2.4 Objects of the Issue / Fund Utilization Portal:** Line-item fund allocation table, vendor quote upload (OCR-parsed), real-time GSTIN validity check, and auto-reconciliation of vendor quotes vs. stated fund allocation (See: *Section 4.6*).
* **2.5 Live Completeness Tracker:** Dashboard showing "% disclosure-complete" per chapter. Red/amber/green status per section based on Stage 1 rule checks.
* **2.6 Draft Preview (read-only):** Company can see the AI-generated draft and completeness score, but CANNOT edit disclosure language directly. Edits are routed as "clarification requests".

---

### 3. Interface B — Intermediary Workbench
**Purpose:** Give merchant bankers, legal counsel, and auditors a professional-grade review environment — not a black box, but a transparent, auditable decision-support tool.
*See also: `UIUX_Detailed_Frontend_Spec.md > Section 3`*

#### Modules
* **3.1 Clause-by-Clause Compliance Dashboard:** Every paragraph tagged with the SEBI ICDR clause / SME disclosure requirement it satisfies. Flags shown inline.
* **3.2 Redline & Comment Layer:** Track-changes style editing directly on AI-drafted text. Threaded comments per flagged item, assignable by role.
* **3.3 Cross-Check Alert Panel:** Surfaces every mismatch caught by the Data Matching Engine (See: *Section 4.3*) with exact source locations.
* **3.4 Third-Party Due-Diligence Panel:** MCA21 director/company status results, E-Courts litigation matches, GSTIN status. Flags struck-off / insolvency / disqualification.
* **3.5 Risk Factor Review Panel:** AI-drafted, SEBI-standard-phrased risk factors shown alongside the underlying data trigger. Materiality threshold shown.
* **3.6 Peer Group Comparison Validator:** Auto-fetched competitor valuation tables (See: *Section 4.4*) with source attribution.
* **3.7 Certification & Lock Action:** Role-based sign-off. Once all certifications are collected, status changes to "Locked — Submission Ready". Exportable audit trail.

---

### 4. Stage 1 — Hardcoded Rules Engine (Deterministic Layer)
This is the non-negotiable, non-AI validation backbone. It runs BEFORE and AFTER the AI drafting stage.

* **4.1 Mandatory Disclosure Structural Check:** Schema validation (JSON schema per SEBI ICDR/SME chapter requirement). Missing sections trigger a hard validation flag and block progression.
* **4.2 Entity Extraction & Tagging:** RegEx + structured parsing tags critical numeric facts as variables (e.g., `variable_revenue_FY26`) persisting across the document graph.
* **4.3 Cross-Sectional Data Matching Engine:** Entity-Relationship Graph maps variable instances. Mismatches trigger strict logic alerts and halt workflow progression until resolved.
* **4.4 Prohibited Buzzword / Unquantified Claim Filter:** Dictionary + pattern match against subjective claims ("market leader"). Auto-strips or flags unless backed by a verified third-party source link.
* **4.5 Promoter Group Network Mapper:** Cross-references promoter-declared family tree against MCA21 database results to detect undisclosed related-party transactions.
* **4.6 Expenditure Verification Module:** Matches vendor quote sum totals exactly against stated fund allocation. Confirms active vendor GSTIN. Blocks progression if reconciliation fails.
* **4.7 Third-Party Due-Diligence API Layer:** MCA21 / API Setu, E-Courts / legal-tech aggregators, GSTIN verification APIs. "Struck off" or active insolvency triggers an automatic critical red flag. *See also: `Security_and_Authentication.md > Section 4.4`*
* **4.8 Materiality Gating Logic:** Hardcoded thresholds determine if an asset concentration or litigation claim is material enough to require a highlighted Risk Factor.

---

### 5. Stage 2 — AI / ML Drafting Engine
Generates content ONLY within the guardrails set by Stage 1. Output must pass rule validation before reaching Interface B.
*See also: `Model_Training_Methodology.md` for detailed model architecture.*

* **5.1 Semantic & Compliance Parser:** LLM + NER models identify semantic requirements vs. legal requirements using a RAG vector database (SEBI ICDR/SME guidelines).
* **5.2 Narrative Drafting Model:** Converts plain-language inputs into SEBI-standard disclosure prose. Constrained generation prevents hallucinated figures.
* **5.3 Context-Aware Risk Factor Generator:** Multi-label text classification + domain-finetuned LLM trained on historic SEBI observation letters. Reads financial restatements to surface risk patterns.
* **5.4 Peer Group Comparison Engine:** Identifies competitor peers from business description embeddings and pulls live valuation multiples via financial APIs.
* **5.5 Confidence Scoring:** Every AI-generated clause carries a confidence/source-traceability score, visible to the intermediary in Interface B.

---

### 6. Stage 3 — Manual / Human-in-the-Loop Layer
* **6.1 Role-Based Review Queue:** Legal, Auditor, Merchant Banker each see sections relevant to their certification responsibility.
* **6.2 Escalation Protocol:** Critical red flags require explicit resolution before certification can be granted.
* **6.3 Final Certification & Immutable Lock:** Multi-signatory sign-off required. Document and audit trail (every AI draft, rule flag, human edit, approval) are exportable.

---

### 7. End-to-End Pipeline (Sequential Flow)
1. **Interface A:** Promoter completes guided onboarding.
2. **Stage 1 (Pre-AI):** Rules Engine performs structural + entity-tagging validation.
3. **Stage 1 (Async API):** MCA21, E-Courts, GSTIN checks run async.
4. **Stage 2 (AI):** AI Engine drafts narrative, risk factors, peer comparison table using validated data.
5. **Stage 1 (Post-AI):** Rules Engine re-runs on AI output (cross-sectional matching, buzzword filter, materiality gating).
6. **Routing:** Document (with flags + confidence scores) routed to Interface B.
7. **Interface B:** Intermediary team reviews, redlines, resolves flags. Clarifications routed back to Interface A (loop back to step 1 for that data point).
8. **Certification:** Role-based certification collected.
9. **Finalization:** Document locked, audit trail generated, submission-ready package exported.

---

### 8. Data / API Sources
* **Ministry of Corporate Affairs (MCA21):** via API Setu or KYB aggregators (Decentro, Sandbox, AuthBridge) — director & company status, DIN/CIN verification.
* **E-Courts National Portal / Legal-tech Aggregators:** (LegalKart, Precydent, vLex) — litigation cross-matching.
* **GSTIN Verification APIs:** Vendor & entity tax status.
* **Financial Data APIs:** (e.g., Moneycontrol, Bloomberg) — listed peer valuation multiples.
* **RAG Knowledge Base:** Built on SEBI ICDR Regulations, SME listing framework, and historic SEBI observation letters / past DRHP filings.

**Feasibility Statement:** "Our platform uses India's Open-API Digital Public Infrastructure and established commercial KYB/legal-tech aggregators — the same underlying government datasets SEBI itself references — so due diligence checks run pre-submission instead of post-submission as regulatory queries."

---

### 9. Key Differentiators for Submission
* **SEBI Alignment:** Accessible to non-expert promoters (Interface A), maintains accuracy checks (Rules Engine), preserves intermediary certification role (Interface B).
* **Liability Mitigation:** AI never has final authority; hardcoded rules gate the AI; humans certify.
* **Concrete Demo Artifacts:** Two distinct UIs, visible rule-flag dashboard, promoter-group network graph, auto-reconciled fund allocation table.
* **Scenario-Specific Validation:** Can be demoed end-to-end on one realistic SME IPO scenario (e.g., a textile manufacturer).
