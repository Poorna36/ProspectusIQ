> **Master Product & UX Spec:** See [lueprint docs/PRODUCT_WORKFLOW_SPEC.md](./PRODUCT_WORKFLOW_SPEC.md) for the complete 18-chapter DRHP wizard hierarchy, realistic 21-day timeline engine, engagement-code handshake, dual messaging drawers, real-time alerts, multi-tier flags, bronze seal lock protocol, interactive OCR document scanner, PDF export engine, Digital e-Sign Modal, SEBI Observation Readiness Index, Cross-Chapter Variable Reconciler, and SEBI ICDR 2018 Schedule VI Compliance Checklist.
---

## 0. Project One-Liner

**ProspectusIQ** is a dual-interface, AI-assisted platform for SME IPO DRHP (Draft Red Herring Prospectus) filing.
- **Interface A (Portal):** Company/Promoter fills DRHP in guided phases with an AI copilot
- **Interface B (Workbench):** Certified intermediaries (merchant banker, legal, auditor) review, redline, and approve each phase
- Phases are **locked one-by-one** once approved — cannot be re-edited
- Full vision: document/chat/image input, content generation, compliance verification, feedback loops between both interfaces

---

## 1. Repository Structure (Key Paths)

`
prospectusiq/
├── frontend/portal/          # Interface A — Promoter portal (NOT YET BUILT)
├── frontend/workbench/       # Interface B — Intermediary workbench (NOT YET BUILT)
├── backend/src/              # Node.js monolith (NOT YET BUILT)
├── ml/
│   ├── ai-engine/src/        # THE MAIN ML DELIVERABLE — ALL EMPTY (.gitkeep only)
│   │   ├── generator/        # EMPTY
│   │   ├── verifier/         # EMPTY
│   │   ├── rag/              # EMPTY
│   │   ├── pipelines/        # EMPTY
│   │   └── api/              # EMPTY
│   ├── data/
│   │   ├── sebi_cleaned/sebi_parsed_chunks.json  # 5 DRHPs, 60 chunks
│   │   ├── vector_db/sebi_faiss.index            # FAISS (384-dim, 60 vectors)
│   │   ├── vector_db/vector_db_metadata.json     # Chunk metadata
│   │   ├── security_cleaned/train.csv            # 2664 SQLi training rows
│   │   ├── security_cleaned/val.csv              # 571 rows
│   │   └── security_cleaned/test.csv             # 572 rows
│   ├── models/sqli_detector_sebi.pkl             # Trained SQLi classifier
│   ├── scripts/
│   │   ├── 01_prepare_sebi_security_dataset.py   # ETL: SEBI PDF + SQLi dataset
│   │   ├── 02_train_sqli_model.py                # Trains SQLi classifier
│   │   └── 03_evaluate_and_export_ml_artifacts.py # Evaluates + builds FAISS index
│   └── docs/ML_HANDOFF_GUIDE.md                  # Integration snippets (partial)
├── data/                     # Root-level mirrors of ml/data/ (duplicated by scripts)
├── models/                   # Root-level mirror of ml/models/
├── blueprint docs/           # YOU ARE HERE
│   ├── ml/pipeline.md        # Exact folder structure + inference loop spec
│   ├── ml/data.md            # Dataset strategy + 5-chapter scope
│   ├── backend/api.md        # Full REST API contract (757 lines)
│   ├── backend/data.md       # DB schema
│   ├── backend/structure.md  # Backend file structure
│   ├── master_structure.md   # Overall project layout + boot sequence
│   └── ML_SESSION_CONTEXT.md # THIS FILE
└── source docs/
    ├── Platform_Architecture_Pipeline.md  # Full 3-stage architecture
    ├── Model_Training_Methodology.md      # Generator + Verifier methodology
    ├── Standout_Features.md               # Judge-facing feature summary
    ├── UIUX_Detailed_Frontend_Spec.md     # UI/UX spec
    └── Security_and_Authentication.md     # Auth + RBAC spec
`

---

## 2. What Was Actually Built (ML Branch — git pull origin ml)

### DONE — Do NOT touch or retrain

#### 2.1 SQLi Security Classifier (models/sqli_detector_sebi.pkl)
- **What:** Guards the API from SQL injection attacks on every user search/query
- **How:** Character-level TF-IDF (2-4 n-grams, 5000 features) + Logistic Regression (C=10)
- **Performance verified live (2026-08-06):** 100% accuracy on 572-sample test set
  - True Negatives: 272/272 | True Positives: 300/300 | Zero false positives or negatives
- **7/7 live inference checks all MATCH:**
  - URL-encoded %27 OR 1=1 -- → BLOCKED 97.7% | SEBI query "What are risk factors in Cult.fit DRHP?" → SAFE 99.2%
  - DROP TABLE, UNION SELECT, exec xp_cmdshell → all BLOCKED
- **Verdict: SUFFICIENT. No retraining needed. Do not delete.**

#### 2.2 SEBI FAISS Vector Index
- **What:** Semantic search over real SEBI prospectus documents (the RAG knowledge base)
- **Model:** all-MiniLM-L6-v2 (~80MB local, no internet at inference)
- **Index:** 60 chunks from 5 real SEBI DRHPs, 384 dimensions, cosine similarity
- **DRHPs indexed:** GNI Infrastructure Limited (x2), Indian Gas Exchange Limited (x2), Master Chains N Jewels Limited
- **Verdict: PARTIAL — functional, enough for demo. Do NOT delete. Add more DRHPs for production.**

#### 2.3 SEBI PDF Parsing (data/sebi_cleaned/sebi_parsed_chunks.json)
- 5 DRHPs parsed into 60 text chunks + 66 tables + 1060 sentences
- Structured by: chunk_id, pdf_source, page, section, text
- **Verdict: Good. Keep as-is.**

### Known Limitations of What Was Built

1. **Financial metrics are hardcoded fallbacks:** sebi_extracted_metrics.json shows same D/E ratio (0.42) and revenue (INR 450.50 Cr) for ALL 5 companies — regex extractor failed to find real values in PDFs, fell back to defaults. Do not use these as real data.

2. **100% SQLi accuracy is expected:** SQL syntax character patterns are very different from SEBI legal prose. This is correct, not suspicious.

3. **FAISS has only 60 chunks:** Demo-sufficient. Not production-sufficient.

---

## 3. The Critical Gap — What Was NOT Built

Every folder in ml/ai-engine/src/ contains only a .gitkeep placeholder — all are EMPTY:

`
ml/ai-engine/src/
  generator/    EMPTY
  verifier/     EMPTY
  rag/          EMPTY
  pipelines/    EMPTY
  api/          EMPTY
`

### Root Cause of the Gap

The teammate read source docs (which describe training methodology concepts) and built **offline training scripts** in ml/scripts/. He missed blueprint docs/ml/pipeline.md which specifies that the actual deliverable is a **live HTTP inference service** (FastAPI server) that the backend calls at runtime. These are two completely different things:

- ml/scripts/ = one-time training/evaluation tools (DONE, correct)
- ml/ai-engine/ = the running server the backend calls for every user request (MISSING, not built)

The backend calls ML via HTTP through backend/src/services/ai_dispatcher.ts. There is currently no server to call.

---

## 4. Architecture — The 3-Stage Design

`
INTERFACE A (Promoter)                     INTERFACE B (Workbench)
  User inputs text/chat/docs/images          Intermediary reviews draft
  AI copilot helps generate section    <->   Suggests changes, flags issues
  Submits each DRHP phase              -->   Approves or sends back feedback
  Phase locked after approval                Each phase locked one-by-one
           |
           v
  STAGE 1: Rules Engine (Deterministic — in Node.js backend)
    - Schema validation (missing sections block progress)
    - Cross-section numeric consistency check
    - GSTIN/MCA21 API verification (mock for hackathon)
    - Buzzword/unquantified claim filter
           |
           v
  STAGE 2: AI Engine (Python FastAPI port 8001 — THE GAP)
    - RAG retrieval (SEBI regulatory chunks via FAISS)
    - Generator (LLM drafts SEBI-standard prose from user inputs)
    - Verifier (scores compliance, flags deficiency types)
    - Retry loop if confidence low
           |
           v
  STAGE 3: Human certification → Immutable lock
`

---

## 5. The 5 Target DRHP Chapters (Hackathon MVP Scope)

Per blueprint docs/ml/data.md:

| Chapter              | Primary ML Component      | Key Deficiency Type                                       |
|----------------------|---------------------------|-----------------------------------------------------------|
| Risk Factors         | Verifier (materiality)    | MATERIALITY_SPECIFICITY — risk without % quantification   |
| Objects of the Issue | Generator + Rules         | NUMERIC_MISMATCH — fund allocation vs. vendor quotes      |
| Business Overview    | Generator + Verifier      | UNQUANTIFIED_CLAIM — "market leader" without citation     |
| Promoter & Related   | Rules + MCA21 API         | Undisclosed related parties                               |
| Peer Group Comparison| RAG + external API        | Missing/wrong comparable valuation tables                 |

---

## 6. What Needs to Be Built — Priority Order

> **Note on source docs:** Keep `source docs/` — they contain the *design rationale* (why decisions were made). Blueprint docs contain the *implementation specs* (how to build it). Both are needed. Do not delete source docs.

### PRIORITY 1 — FastAPI Inference Server

Files:
- ml/ai-engine/src/api/server.py    (FastAPI app with 4 routes)
- ml/ai-engine/src/api/schemas.py   (Pydantic input/output models)
- ml/ai-engine/requirements.txt     (fastapi, uvicorn, sentence-transformers, faiss-cpu, joblib, google-generativeai)

Required HTTP routes:
`
POST /ml/draft          sectionKey + inputVariables -> drafted text + compliance flags
POST /ml/verify         draftedText + sectionKey -> compliance score + flag array
POST /ml/search         query string -> top-K SEBI chunks (RAG search)
POST /ml/security/check raw query string -> is_malicious (bool) + confidence (float)
`

Startup: cd ml/ai-engine && uvicorn src.api.server:app --reload --port 8001

### PRIORITY 2 — Generator (ml/ai-engine/src/generator/)

Files:
- inference_client.py  — Calls Gemini Flash API (or Ollama) with section-specific prompt
- prompts.py           — System prompts per section (Risk Factors, Objects, Business Overview)
- grounding_check.py   — Post-generation: reject if any number NOT in inputVariables dict

CRITICAL rule: Any number in generated text MUST appear in inputVariables. If hallucinated → reject and retry.

### PRIORITY 3 — Verifier (ml/ai-engine/src/verifier/)

Files:
- taxonomy.py      — 4 deficiency types as Python Enum
- cross_encoder.py — LLM-as-judge: sends [draft + regulation clause + inputVars] to LLM, returns structured JSON

Deficiency taxonomy (from blueprint docs/ml/data.md):
`python
class DeficiencyType(Enum):
    MATERIALITY_SPECIFICITY = "MATERIALITY_SPECIFICITY"  # Risk without % quantification
    UNQUANTIFIED_CLAIM      = "UNQUANTIFIED_CLAIM"       # Buzzword without cited data
    NUMERIC_MISMATCH        = "NUMERIC_MISMATCH"         # Number contradicts inputVariables
    OMISSION                = "OMISSION"                 # Mandatory SEBI clause missing
`

Verifier output schema (what backend expects):
`json
{
  "status": "COMPLIANT | NON_COMPLIANT | NEEDS_HUMAN_REVIEW",
  "confidence": 0.85,
  "flags": [
    {
      "type": "MATERIALITY_SPECIFICITY",
      "clause_reference": "SEBI ICDR Schedule VI, Risk Factors",
      "justification": "Revenue concentration risk stated without quantified percentage"
    }
  ]
}
`

### PRIORITY 4 — RAG Retriever (ml/ai-engine/src/rag/)

Files:
- retriever.py   — Wraps existing FAISS index with a search function
- embeddings.py  — Embedding utilities (reuse logic from 03_evaluate script)

Already exists: data/vector_db/sebi_faiss.index + data/vector_db/vector_db_metadata.json
Just needs: Python function (query: str, section_key: str, top_k: int) -> list[dict]

### PRIORITY 5 — Draft Orchestrator (ml/ai-engine/src/pipelines/)

File: draft_orchestrator.py

5-step inference loop (from blueprint docs/ml/pipeline.md):
`
1. RAG Retrieval       fetch top-k SEBI regulation clauses for sectionKey
2. Generator Inference synthesize draft from inputVariables + RAG context
3. Grounding Check     deterministic: reject draft if hallucinated numbers found
4. Verifier Inference  score compliance, generate flag array
5. Routing:
   confidence >= 0.80  → return AI_DRAFT_READY
   confidence < 0.60 AND retries < 3 → append flags to prompt, loop to step 2
   else                → return NEEDS_HUMAN_REVIEW with draft attached
`

---

## 7. Complete Draft Output Schema (backend expects this)

`json
{
  "section": "Risk Factors",
  "drafted_text": "...",
  "source_variables_used": ["variable_revenue_FY26", "variable_customer_concentration"],
  "rules_engine_status": "pass",
  "verifier_status": "NEEDS_HUMAN_REVIEW",
  "verifier_confidence": 0.62,
  "verifier_flags": [
    {
      "type": "MATERIALITY_SPECIFICITY",
      "clause_reference": "SEBI ICDR Schedule VI, Risk Factors",
      "justification": "Concentration risk stated without quantified percentage"
    }
  ],
  "retry_count": 1,
  "last_modified_by": "generator_v1",
  "audit_trail": []
}
`

---

## 8. What ml/docs/ML_HANDOFF_GUIDE.md Actually Covers

Auto-generated by Script 03. Covers:
1. How to load/use SQLi classifier (Python code snippet)
2. How to load/use FAISS vector search (Python code snippet)
3. Location of extracted financial metrics JSON (WARNING: fallback placeholder values, NOT real data)
4. Location of ML performance summary JSON

Does NOT cover:
- Generator, Verifier, or FastAPI server (don't exist yet)
- How backend calls AI engine at runtime
- 5-step orchestration pipeline
- Phase-locking workflow

Represents ~20% of full ML scope.

---

## 9. Should We Delete and Start Over?

NO. Keep everything. Build on top.

| Existing Component                          | Action                                                    |
|---------------------------------------------|-----------------------------------------------------------|
| models/sqli_detector_sebi.pkl               | KEEP — wire into FastAPI as /ml/security/check endpoint   |
| data/vector_db/sebi_faiss.index             | KEEP — wire into rag/retriever.py                         |
| data/sebi_cleaned/sebi_parsed_chunks.json   | KEEP — add more DRHPs if time allows                      |
| ml/scripts/                                 | KEEP — useful for reference and retraining                |
| ml/ai-engine/src/ (empty folders)           | FILL IN — all new code goes here                          |

SQLi classifier: No retraining needed. At ceiling performance for its task.
FAISS index: Demo-sufficient. For production, run Script 01 with more DRHPs.

---

## 10. LLM Strategy

**Recommended: Gemini Flash API**
- Set GEMINI_API_KEY in environment
- Model: gemini-2.0-flash (~500 token prompt, ~300 token output per section)
- Generator: one system prompt per section type
- Verifier: same model, structured JSON output system prompt
- No fine-tuning needed for hackathon — RAG + few-shot prompting is sufficient

**Alternative (fully offline): Ollama + llama3:8b**
- ollama serve, then call http://localhost:11434/api/generate
- Slower but zero API cost, no internet required

---

## 11. Boot Sequence (Once All Components Built)

`
1. cd integration/scripts && ts-node seed-mock-data.ts
2. cd ml/ai-engine && uvicorn src.api.server:app --reload      # port 8001
3. cd backend && npm run dev                                    # port 3000
4. cd frontend/portal && npm run dev
`

---

## 12. Key Files to Read Before Starting

| File                                              | Why                                               |
|---------------------------------------------------|---------------------------------------------------|
| blueprint docs/ml/pipeline.md                     | Exact folder structure + 5-step inference loop    |
| blueprint docs/ml/data.md                         | 5-chapter scope + deficiency taxonomy             |
| blueprint docs/backend/api.md                     | Full REST API — find the /ml/* routes             |
| source docs/Model_Training_Methodology.md         | Generator + Verifier design rationale             |
| source docs/Platform_Architecture_Pipeline.md     | Full 3-stage architecture                         |
| ml/docs/ML_HANDOFF_GUIDE.md                       | Integration code snippets for what IS built       |

---


### PRIORITY 6 — Copilot (ml/ai-engine/src/copilot/)

File: chat_handler.py

The Copilot is a conversational assistant active during filing sessions on BOTH Interface A (promoter) and Interface B (workbench). It answers user questions using the current filing context + SEBI regulatory knowledge. It does NOT draft the DRHP (that is the Generator's job).

What it knows per request:
- user_message: the question being asked
- section_key: which DRHP chapter is active (RISK_FACTORS, OBJECTS_OF_ISSUE, etc.)
- filing_context: current session state (inputVariables, current_draft, open_flags, role)

Behaviour:
- Runs RAG search on SEBI FAISS index for the section + user query
- Grounds answer in filing_context data and retrieved SEBI chunks — never hallucinate
- PROMOTER role: plain English, no jargon, explain what info is needed
- INTERMEDIARY role: technical, cite SEBI ICDR clause numbers, explain flags precisely
- Out-of-scope questions get: "I can only assist with SEBI DRHP compliance questions."

Output schema:
`json
{
  "reply": "string",
  "sources": [{"chunk_id": "...", "pdf_source": "...", "relevance_score": 0.92, "excerpt": "..."}],
  "suggested_actions": ["Show me what is missing", "Explain this flag in plain language"]
}
`

Implementation cost: VERY LOW — reuses existing rag/retriever.py and generator/inference_client.py. Only one new file needed.

HTTP route: POST /ml/copilot
## 13. 15-Step Build Plan for Next Session

`
Step  1: Create ml/ai-engine/requirements.txt
Step  2: Create ml/ai-engine/src/api/schemas.py          (Pydantic models for 4 endpoints)
Step  3: Create ml/ai-engine/src/rag/retriever.py        (wraps existing FAISS index)
Step  4: Create ml/ai-engine/src/rag/embeddings.py       (embedding utilities)
Step  5: Create ml/ai-engine/src/generator/prompts.py    (section-specific system prompts)
Step  6: Create ml/ai-engine/src/generator/inference_client.py  (calls Gemini/Ollama)
Step  7: Create ml/ai-engine/src/generator/grounding_check.py   (hallucination guard)
Step  8: Create ml/ai-engine/src/verifier/taxonomy.py    (4 deficiency types as Enum)
Step  9: Create ml/ai-engine/src/verifier/cross_encoder.py      (LLM-as-judge scorer)
Step 10: Create ml/ai-engine/src/pipelines/draft_orchestrator.py (5-step loop)
Step 11: Create ml/ai-engine/src/api/server.py           (FastAPI wiring everything)
Step 12: Test POST /ml/draft — Risk Factors + mock inputVariables
Step 13: Test POST /ml/verify — bad draft missing % quantification
Step 13: Test POST /ml/search and POST /ml/security/check
Step 14: Create ml/ai-engine/src/copilot/chat_handler.py    (context assembly + LLM Q&A)
         Add POST /ml/copilot route to server.py + schemas.py
Step 15: Test POST /ml/copilot with a PROMOTER query ("What info do I need for Risk Factors?")
         Test POST /ml/copilot with an INTERMEDIARY query ("Explain this MATERIALITY_SPECIFICITY flag")
`

---

*Generated: 2026-08-06 | Session: 360c4e9d-f37c-434c-ac1e-b2f49f2bdefa*





