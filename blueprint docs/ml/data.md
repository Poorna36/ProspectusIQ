# Machine Learning Section — Data Sourcing & Preparation
### Sebii SME IPO Platform · Dataset Strategy

---

## 1. Overview & Data Sources

The accuracy of the Dual-Model AI Architecture relies entirely on the quality and structure of its training and context data. The platform sources data from public financial and regulatory repositories to form three distinct dataset pillars.

| Dataset Pillar | Target Source | Purpose |
|---|---|---|
| **Real DRHP Filings** | [NSE Emerge](https://www1.nseindia.com/emerge/), [BSE SME](https://www.bsesme.com/), SEBI Database | Fine-tunes the **Generator Model** to output the exact distribution, tone, and structure of real SME IPO narratives. |
| **Observation Letters** | SEBI Public Issues Database (Observation Letters) | Fine-tunes the **Verifier Model** to recognize non-compliant text, omissions, and regulatory violations. |
| **Regulatory Corpus** | SEBI ICDR 2018 Regulations (PDFs) | Actively retrieved by the **RAG Layer** during inference to ground the AI in absolute rules. |

---

## 2. Target Training Sections (The 5-Chapter Hackathon Scope)

To provide a comprehensive end-to-end demo without risking underfitting from trying to train on all 20+ DRHP chapters, the hackathon MVP targets exactly **five distinct sections**. Each section is chosen to showcase a specific system capability (Generator vs Verifier vs Rules Engine).

| DRHP Chapter | System Capability Highlighted | What Data is Extracted & Learned |
|---|---|---|
| **1. Risk Factors** | **AI Verifier** (Materiality) | **Data:** Top 10-15 risk clauses per DRHP.<br>**Learns:** The Generator learns strict cautionary legal tone. The Verifier learns to flag `MATERIALITY_SPECIFICITY` (risks lacking financial impact quantification). |
| **2. Objects of the Issue** | **Hard Rules + Generator** | **Data:** Fund allocation tables & percentage breakdowns.<br>**Learns:** Teaches the Generator strict constraint adherence (mapping input variables). The Rules Engine checks live vendor GSTINs and exact percentage allocations. |
| **3. Business Overview** | **AI Generator + Verifier** | **Data:** Industry narrative and market positioning paragraphs.<br>**Learns:** Translating raw promoter notes into formal prose. The Verifier is trained to catch `UNQUANTIFIED_CLAIM` (flagging subjective buzzwords like "market leader" without cited data). |
| **4. Promoter & Related Parties** | **Rules Engine + API** | **Data:** Family tree graphs and associated company names.<br>**Learns:** The AI drafts the relationship trees, but the deterministic Rules Engine cross-checks the entities against MCA21/External APIs to flag undisclosed transactions or struck-off companies. |
| **5. Peer Group Comparison** | **AI RAG + External API** | **Data:** Financial comparison tables (P/E, EPS, RoNW).<br>**Learns:** The AI learns to parse business descriptions to identify competitors, then dynamically drafts a comparative valuation analysis based on live financial API data (e.g., Moneycontrol/Bloomberg). |

*By restricting the hackathon demo to these 5 chapters, you demonstrate the full capability of the 3-stage architecture (AI Drafts → Rules Validate → Humans Certify) on a manageable, curated dataset.*

---

## 3. The Verifier Taxonomy (AI-Detected Issue Types)

The Verifier model is explicitly trained to classify drafted text into one of the following deficiency categories, directly sourced from historical SEBI observation letters:

1. **`MATERIALITY_SPECIFICITY`** *(Risk Factors)*: The text mentions a risk or business concentration, but fails to quantify it (e.g., "We rely heavily on a few customers" instead of "Our top 5 customers constitute 62% of revenue").
2. **`UNQUANTIFIED_CLAIM`** *(Business Overview)*: The text includes a subjective buzzword without a cited source (e.g., "We are the premier manufacturer").
3. **`NUMERIC_MISMATCH`** *(Objects of the Issue)*: The financial figure generated in the prose contradicts the structured `inputVariables` or financial restatements.
4. **`OMISSION`**: A mandatory clause required by the SEBI ICDR regulation chunk (provided via RAG) is missing from the draft.

---

## 4. Dataset Construction & Preprocessing Pipeline

Raw PDFs downloaded from NSE Emerge or SEBI cannot be fed directly into models. The `ml/scripts/` directory must implement the following ETL (Extract, Transform, Load) pipeline:

1. **Document Ingestion & OCR:** Extract raw text from native PDFs or scanned documents. Strip out non-semantic noise like page numbers, headers, and watermarks.
2. **Structural Segmentation:** Use Regex or Heading detection to isolate ONLY the 5 target chapters specified in Section 2. Discard the rest of the 400-page DRHP to keep the training data clean.
3. **Entity Tagging (NER):** Named Entity Recognition tags financial figures, dates, and entity names. These map to the `variable_x` format used by the Stage 1 Rules Engine (e.g., `variable_revenue_FY26`).
4. **Alignment / Pairing (For Generator):** Align the extracted tagged variables with their host narrative paragraph to create the exact input→output pairs needed for Generator fine-tuning.
5. **Synthetic Corruption (For Verifier):** Because approved DRHPs are compliant, you must take an approved paragraph and intentionally break it (e.g., delete a percentage to create a `MATERIALITY_SPECIFICITY` error). This creates the negative examples the Verifier needs to learn from.

---

## 5. Mitigating Overfitting & Underfitting (Hackathon Strategy)

Because hackathons involve limited data (e.g., 50-100 DRHPs instead of 10,000) and limited compute, the training strategy must explicitly guard against model degradation.

### 5.1 Preventing Overfitting (Memorization)
*If the model overfits, it will literally memorize the training DRHPs and hallucinate those specific company names and revenues into the user's new draft.*
- **Crucial Step - Anonymization Masking:** Before training, the ETL pipeline MUST mask all real company names, promoter names, and specific addresses (e.g., replacing "Reliance" with `[COMPANY_NAME]`). 
- **Few-Shot vs. Fine-Tuning:** For the Generator, prioritize **Few-Shot Prompting paired with RAG** over full weight fine-tuning. If you do use LoRA fine-tuning, use very low learning rates and early stopping (monitor a validation set of 5 DRHPs).
- **Synthetic Randomization:** When creating synthetic errors for the Verifier, randomize the corruption techniques heavily so the model learns the *concept* of an error, not the exact wording of a broken sentence. Use Dropout layers during the Cross-Encoder training.

### 5.2 Preventing Underfitting (Failing to learn legalese)
*If the model underfits, it will output generic ChatGPT-style text that lacks SEBI-standard legal rigor.*
- **Adequate Model Sizing:** Do not use tiny 1B or 2B parameter models for the Generator. Use at least an 8B class model (like Llama-3) which inherently possesses enough semantic depth to grasp complex legal contexts.
- **Taxonomy-Specific Training:** Do not train the Verifier on a generic binary `Good/Bad` label. You must train it explicitly on the 4 complex taxonomy labels listed in Section 3, forcing the loss function to differentiate between specific legal failures.
