# File: Model_Training_Methodology.md

# Model Training Methodology
## Generator + Verifier Architecture for SME IPO Offer Document AI

### 0. Why Two Models, Not One?
A single model that both drafts and checks its own work inherits its own blind spots — it cannot reliably catch errors it was confident enough to generate. The AI layer (Stage 2) is split into two internally distinct models with different objectives, training data, and failure modes.

* **Model 1: Generator ("The Drafter")**
  * **Task:** Turn structured promoter inputs into SEBI-standard disclosure prose and structured tables.
* **Model 2: Verifier / Inspector ("The Auditor")**
  * **Task:** Independently judge whether a drafted section and source data are compliant, consistent, and traceable by scoring and flagging it (not re-generating it).

*See also: `Platform_Architecture_Pipeline.md > Section 5 (Stage 2 AI Engine)`*

---

### 1. Data Sources
Data sources are split into CORE (training/fine-tuning data) and SUPPORTING (retrieval grounding, cross-validation, synthetic generation).

#### Core Datasets
| Model | Dataset Focus | Sources | Rationale |
| :--- | :--- | :--- | :--- |
| **Generator** | Real RHP / DRHP Filings | SEBI database, NSE Emerge, BSE SME. | Teaches the exact target output distribution. SME-platform filings perfectly match the target scale and complexity. Chapter-aligned extraction provides clean input→output pairs. |
| **Verifier** | SEBI Observation Letters | Issued against DRHPs before final approval. | Regulator-labeled negative-example data. Closest ground-truth to "what counts as a compliance gap". Yields (flawed draft, deficiency, clause) triples. |

#### Supporting Datasets
* **1.3 Regulatory Text Corpus (for RAG):** SEBI ICDR Regulations and SME frameworks. Kept as a retrieval knowledge base (not baked into model weights) for real-time updates.
* **1.4 Structured/Financial Data:** Restated financial statements (extracted from the Generator's core RHP corpus) and public financial data APIs (for peer-comparison training/validation).
* **1.5 Synthetic Negative Examples:** Generates volume for the Verifier model by deliberately corrupting approved RHP text (swapping numbers, removing clauses) mapped to categories defined by real SEBI observation letters.

---

### 2. Data Cleaning & Preprocessing Pipeline
1. **Document Ingestion:** OCR + native PDF/text extraction. Stripping headers, footers, watermarks.
2. **Structural Segmentation:** Splitting DRHPs into canonical chapters (Business Overview, Risk Factors, etc.) via heading detection.
3. **Entity Tagging:** Named Entity Recognition (NER) tags financial figures, dates, entity names, matching the `variable_x` tagging format used by the Stage 1 Rules Engine.
4. **Deduplication & Noise Removal:** Removing boilerplate legal disclaimers and duplicate filings across amendments.
5. **Alignment / Pairing:**
   * **Generator:** Pairs structured input fields with approved narrative output.
   * **Verifier:** Pairs document sections with compliance labels, linked observation-letter deficiencies, and synthetic negative variants.
6. **Anonymization Layer:** Masks real company names to prevent the model from overfitting on specific company facts.

---

### 3. Model 1 — Generator ("The Drafter")
* **3.1 Base Model:** Open-weight pretrained LLM (e.g., Llama/Mistral-class) or API-based foundation model.
* **3.2 Supervised Fine-Tuning (SFT) + RAG:** 
  * SFT on input→output pairs teaches tone, structure, and phrasing.
  * RAG grounds generations in SEBI ICDR texts and promoter data.
  * Employs Parameter-Efficient Fine-Tuning (LoRA / QLoRA) for hackathon feasibility.
* **3.3 Constrained / Grounded Generation:** Generator is restricted to facts present in tagged input variables (e.g., `variable_revenue_FY26`) via prompt-level grounding and post-generation fact-consistency checks. Prevents hallucinations.
* **3.4 Task Decomposition:** Generator is invoked per-section with section-specific adapters/prompts rather than attempting one monolithic "write the whole DRHP" pass.

---

### 4. Model 2 — Verifier / Inspector ("The Auditor")
* **4.1 Task Framing:** Framed as classification + extraction, not generation. Outputs structured judgments.
* **4.2 Multi-Label Classification + Cross-Encoder:** Cross-encoder model jointly reads [drafted text, source data, regulation clause] to output: compliant / non-compliant / needs-human-review. Multi-label head categorizes deficiency types (missing disclosure, numeric mismatch, etc.).
* **4.3 Differentiation from Rules Engine:** Stage 1 Rules Engine (deterministic) catches 100% hard structural/numeric issues. The Verifier handles fuzzier judgment calls (tone, SEBI-standard severity, specificity) using pattern-based ML.
* **4.4 Confidence & Explainability:** Outputs a confidence score, specific regulation clause reference, and extracted justification (e.g., "revenue concentration risk lacks quantified percentage").
*See also: `UIUX_Detailed_Frontend_Spec.md > Section 3 (Interface B)`*

---

### 5. Inference-Time Interaction Loop
1. Structured input (tagged variables) → **Generator drafts section**.
2. Draft → **Rules Engine** (deterministic structural/numeric pass).
3. Passing draft → **Verifier Model** (fuzzier compliance/quality pass).
4. If Verifier flags issue (low confidence) → Routed back to **Generator** for re-draft (capped retries).
5. If Verifier flags issue (high confidence) or retry cap reached → Escalated to **Intermediary Workbench (Stage 3)**.

---

### 6. Output Format
Every pipeline run outputs a structured JSON object per section.

```json
{
  "section": "Risk Factors",
  "drafted_text": "...",
  "source_variables_used": ["variable_revenue_FY26", "variable_customer_concentration"],
  "rules_engine_status": "pass",
  "verifier_status": "needs_human_review",
  "verifier_confidence": 0.62,
  "verifier_flags": [
    {
      "type": "materiality_specificity",
      "clause_reference": "SEBI ICDR Schedule VI, Risk Factors",
      "justification": "Concentration risk stated without quantified percentage"
    }
  ],
  "retry_count": 1,
  "last_modified_by": "generator_model_v1",
  "audit_trail": [ ]
}
```

---

### 7. Evaluation / Demo Metrics
* **Generator:** % of drafted facts traceable to source input variables (fact-consistency rate).
* **Verifier:** Precision/recall against a held-out labeled set of SEBI observation-letter deficiencies + synthetic errors.
* **End-to-End:** Time-to-first-complete-draft on a concrete demo scenario, vs. average issues caught pre-submission.

---

### 8. Hackathon-Scale Feasibility
* **Generator:** RAG + prompting + LoRA fine-tuning on a curated set of real RHP sections (dozens to low hundreds).
* **Verifier:** Smaller classifier trained on a subset of SEBI observation letters + synthetic corruption data for 1-2 chapters (e.g., Risk Factors, Objects of the Issue).
* Full-corpus training and complete coverage are designated as the production roadmap beyond the MVP.
