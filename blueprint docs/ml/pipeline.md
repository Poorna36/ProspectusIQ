# Machine Learning Section — Engine Pipeline & Strategy
### ProspectusIQ SME IPO Platform · AI/ML Architecture

---

## 1. AI Architecture Overview

The platform mandates a **Dual-Model Strategy** to prevent self-validation bias (where an LLM cannot reliably catch errors it was confident enough to generate). 

This entire stack operates in isolation under the `prospectusiq/ml/` directory and exposes a stateless HTTP inference API to the Core Orchestration layer.

| Component | Goal | Core Task |
|---|---|---|
| **Generator System** | Draft accurate, SEBI-compliant prose | Constrained, context-grounded language generation |
| **Verifier System** | Catch omissions, specificity failures, and numeric mismatches | Multi-label classification & Cross-Encoding |
| **RAG Layer** | Provide deterministic regulatory context | Vector embedding retrieval based on section keys |

---

## 2. Implementation Contracts & Component Logic

### 2.1 The Generator Contract (`src/generator/`)
The Generator synthesizes narrative text based strictly on provided variables and regulatory context.
- **Input Context:** Must accept the `sectionKey`, the extracted `inputVariables` dictionary, and the RAG-retrieved regulatory guidelines.
- **Grounding Rule:** A post-generation deterministic check (`grounding_check.py`) must parse the output text. Any numeric value emitted by the model *must* explicitly exist in the `inputVariables` dictionary to prevent hallucinated financials. If a hallucinated number is found, the draft is immediately rejected.

### 2.2 The Verifier Contract (`src/verifier/`)
The Verifier acts as a secondary, independent evaluation layer.
- **Input Context:** Must accept the `[Drafted Text + Source Variables]` and the relevant `[Regulation Clause]`.
- **Classification Logic:** Jointly encodes the draft against the regulation to predict a compliance probability (`0.0` to `1.0`).
- **Output Schema:** Must return a structured JSON evaluation containing:
  - `status`: `COMPLIANT | NON_COMPLIANT | NEEDS_HUMAN_REVIEW`
  - `confidence`: Float representing certainty.
  - `flags`: Array of explicit compliance deficiencies mapped to the backend taxonomy (e.g., `MATERIALITY_SPECIFICITY`).

### 2.3 The RAG Contract (`src/rag/`)
Provides deterministic regulatory context to the Generator and Verifier.
- **Knowledge Base:** SEBI ICDR 2018 Regulations and SME platform frameworks.
- **Retrieval Logic:** Chunks must be tagged by `sectionKey`. When a section is drafted, the retriever fetches the exact top-K regulatory clauses for that specific section to ground the prompt.

---

## 3. End-to-End Inference Loop (The AI Draft Job)

The `pipelines/draft_orchestrator.py` module executes the following logical sequence when dispatched a `DRAFT_SECTION` payload.

```
[START: Received payload from core-api]
        │
        ▼
[1. RAG Retrieval]
   Fetch top-k regulatory chunks associated with the sectionKey.
        │
        ▼
[2. Generator Inference]
   Synthesize Draft text string based on inputs and context.
        │
        ▼
[3. Stage 1 Post-Gen Deterministic Check]
   Fail fast if numeric hallucinations are detected.
        │
        ▼
[4. Verifier Inference]
   Evaluate the drafted text against regulations.
   Generate confidence score and flag array.
        │
        ▼
[5. Routing & Retry Logic]
   IF confidence >= 0.80:
        → Return success (AI_DRAFT_READY)
   ELIF confidence < 0.60 AND retries < maxRetries:
        → Append verifier flags to prompt as "Corrections needed"
        → Loop back to Step 2
   ELSE:
        → Return draft but attach NEEDS_HUMAN_REVIEW status.
        │
[END: Return structured JSON payload to core-api]
```

---

## 4. Machine Learning Directory Structure

The internal folder structure explicitly separates the logic and rules for each component of the dual-model system.

```
prospectusiq/
└── ml/
    │
    ├── ai-engine/                       # The live HTTP inference service
    │   ├── src/
    │   │   ├── generator/               # Model 1 Logic
    │   │   │   ├── inference_client.py  # Calls external local LLM (e.g., Ollama server)
    │   │   │   ├── grounding_check.py   # Deterministic hallucination prevention rules
    │   │   │   └── prompts.py           # Section-specific system instructions
    │   │   │
    │   │   ├── verifier/                # Model 2 Logic
    │   │   │   ├── cross_encoder.py     # Compliance classification runner
    │   │   │   └── taxonomy.py          # Definition of deficiency flag types
    │   │   │
    │   │   ├── rag/                     # Retrieval Logic
    │   │   │   ├── retriever.py         # Vector store search implementation
    │   │   │   └── embeddings.py        # Chunking and embedding utilities
    │   │   │
    │   │   ├── pipelines/               # Orchestration
    │   │   │   └── draft_orchestrator.py # Executes the 5-step Inference Loop (Section 4)
    │   │   │
    │   │   └── api/                     # Service Layer
    │   │       ├── server.py            # FastAPI entrypoint
    │   │       └── schemas.py           # Pydantic input/output validation contracts
    │   │
    │   └── requirements.txt
    │
    ├── data/                            # Local ChromaDB persistence for RAG
    │
    └── scripts/                         # Offline Training & ETL utilities
        ├── ingest_mock_drhps.py         # Curated dataset for MVP demo
        └── generate_negative_examples.py
```
