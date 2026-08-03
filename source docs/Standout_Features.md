# File: Standout_Features.md

# Standout Features / Key Differentiators
*(Judge-Facing Summary)*

### 1. Three-Stage Architecture
* **AI Drafts → Hardcoded Rules Validate → Human Intermediary Certifies**
* No single stage has unilateral authority. AI cannot auto-submit, rules cannot be silently overridden, and humans are not left to review unstructured AI output.
* **Value Prop:** Directly addresses the trust gap. Regulators can trust the output because AI is gated twice before human review.
* *See also: `Platform_Architecture_Pipeline.md`*

---

### 2. Dual Interface System
* **Interface A (Company/Promoter):** Guided, plain-language form accessible to first-time SME promoters.
* **Interface B (Intermediary):** Professional workbench featuring clause-level compliance views, redlining, flag resolution, and role-based certification.
* **Value Prop:** Mirrors real-world workflows, preserving the critical role of the intermediary as required by SEBI.
* *See also: `UIUX_Detailed_Frontend_Spec.md`*

---

### 3. Two-Step AI Model (Generator + Verifier)
* Features two distinct models to prevent the system from inheriting a single model's blind spots.
* **Generator:** Trained on real, regulator-accepted RHPs (SEBI, NSE Emerge, BSE SME).
* **Verifier:** Trained on real SEBI Observation Letters (ground-truth records of deficiencies).
* **Value Prop:** Highly defensible data strategy leveraging real regulatory outcomes instead of generic training data.
* *See also: `Model_Training_Methodology.md`*

---

### 4. Hardcoded Rules Engine
* Deterministic logic layer executing BEFORE and AFTER AI drafting.
* Critical structural, numeric, and consistency checks are strictly rule-bound, never left to AI probabilistic judgment.
* **Value Prop:** Ensures platform credibility by relying on hard rules for hard regulatory requirements.

---

### 5. UI/UX, Security & Authentication
* Purpose-built workflows instead of generic chat UIs.
* Robust security covering encrypted data handling, Role-Based Access Control (RBAC), and immutable audit trails for sensitive pre-IPO information.
* *See also: `Security_and_Authentication.md`*

---

### 6. AI-Detected Issue Types
1. **Format & Structural Gaps:** Detects missing mandatory SEBI schema sections.
2. **Entity Extraction & Cross-Check:** Tracks numeric variables across chapters, flagging cross-sectional mismatches automatically.
3. **Compliance Classification:** Validates if section content meets SEBI mandate thresholds.
4. **Buzzword / Claim Filter:** Detects and flags unquantified, subjective claims (e.g., "market leader").
5. **Government Source Verification:** Automated API-based MCA21/GSTIN checks to flag defunct, struck-off, or insolvency-linked entities pre-submission.
6. **Automated Financial Data Entry:** Transcribes and maps uploaded financial records to eliminate manual typing errors.
7. **Promoter Group Mapping:** Maps relatives and entities to catch undisclosed related-party connections.
8. **Document Cleanup:** Auto-organizes unstructured notes into sequenced DRHP structures.

---

### 7. Priority Focus: Objects of the Issue & Risk Factors
* These two chapters represent the highest-scrutiny sections based on real SEBI observation letter data.
* Mandatorily routed through all three stages without exception or shortcut.
* **Value Prop:** Demonstrates a targeted, evidence-based AI application addressing the specific friction points regulators care most about.
