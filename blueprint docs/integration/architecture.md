# Integration Section — Full System Architecture
### Sebii SME IPO Platform · System Boundaries & End-to-End Flow

---

## 1. High-Level Architecture Diagram (Hackathon Optimized)

To ensure maximum development speed and stability during the live pitch, the architecture has been condensed. Microservices and Docker dependencies (Redis, Gateway) have been stripped away, leaving a clean, two-service application communicating via HTTP.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER (sebii/frontend/)                    │
│                                                                              │
│   ┌─────────────────────────┐       ┌──────────────────────────────────┐     │
│   │  Interface A            │       │  Interface B                     │     │
│   │  Portal (Flexible Stack)│       │  Workbench (Flexible Stack)      │     │
│   └────────────┬────────────┘       └──────────────┬───────────────────┘     │
└────────────────┼────────────────────────────────────┼────────────────────────┘
                 │  HTTP (localhost)                  │  HTTP 
                 │  [Short Polling for async updates] │
                 ▼                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          MONOLITHIC BACKEND (sebii/backend/)                 │
│                                                                              │
│   ┌────────────────────────────────────────────────────────────────────┐     │
│   │  Node.js + Fastify API                                             │     │
│   │  • JWT Auth & RBAC Middleware                                      │     │
│   │  • Business Logic & Filing State Machine                           │     │
│   │  • Deterministic Rules Engine (Executed synchronously)             │     │
│   │  • Native JS Async functions for Background ML Jobs                │     │
│   └──────────────────────────────────┬─────────────────────────────────┘     │
└──────────────────────────────────────┼───────────────────────────────────────┘
                                       │
                 ┌─────────────────────┴────────────────────┐
                 │  HTTP POST /generate                     │
                 │  (Fired asynchronously)                  │
                 ▼                                          ▼
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│           DATA LAYER            │      │   INTELLIGENCE (sebii/ml/)      │
│                                 │      │                                 │
│  ┌─────────────────────┐        │      │   ai-engine (Python FastAPI)    │
│  │  SQLite (Local DB)  │        │      │   • Dual-Model Inference        │
│  │  (Synchronous I/O)  │        │      │   • RAG Retrieval               │
│  └─────────────────────┘        │      │                                 │
└─────────────────────────────────┘      └───────────────┬─────────────────┘
                                                         │
                                         ┌───────────────┴─────────────────┐
                                         │       Vector Store (Local)      │
                                         └─────────────────────────────────┘
```

---

## 2. Component Boundary Contracts

To allow independent, parallel development, the following boundary contracts are absolute:

1. **Frontend (`frontend/`) ↔ Backend (`backend/`):**
   - Frontend must send `Authorization: Bearer <token>` on protected routes.
   - Frontend relies exclusively on `integration/openapi-schema.json` to know API data shapes.
   - Frontend must use **HTTP Polling** (e.g. every 3 seconds) on the status endpoint to receive updates for long-running AI jobs.
2. **Backend Node API ↔ Rules Engine:**
   - The Rules Engine is *not* a separate microservice. It is imported and executed directly within the Node.js API process for zero-latency structural validation.
3. **Backend Node API ↔ AI Engine (`ml/`):**
   - Handled via native JS Promises. The Node.js backend makes an HTTP POST to the Python FastAPI server. It does not `await` this call in the main thread (which would block the UI), but allows the promise to resolve in the background and update the SQLite DB upon completion.

---

## 3. End-to-End Section Drafting Flow (Polling & Promises)

This demonstrates the highly optimized interaction flow for generating a section without requiring WebSockets or Redis Queues.

```
[1. UI Action]
Promoter clicks "Save & Continue" on the 'Risk Factors' input form in Interface A.

[2. HTTP Request]
PUT /filings/123/sections/RISK_FACTORS/inputs
Payload: { "variables": { "variable_revenue_FY26": 42000000 } }

[3. Backend Synchronous Validation]
- backend authenticates JWT.
- backend executes internal Rules Engine functions (validates GSTIN, numeric types).
- backend updates SQLite section status to AI_DRAFTING.
- backend fires generateDraftAsync() in the background.
- backend returns HTTP 202 Accepted.

[4. Interface A Polling Loop]
UI shows "Checking your data..." loading overlay.
UI begins calling GET /status every 3 seconds. Returns { status: "AI_DRAFTING" }.

[5. AI Engine Execution (Background)]
- generateDraftAsync calls Python ai-engine.
- ai-engine executes RAG + Generator + Verifier loop.
- ai-engine returns JSON draft output (e.g., 15 seconds later).

[6. Persistence Update]
- generateDraftAsync promise resolves in Node.js.
- Node.js saves draft to SQLite `ai_section_drafts` table.
- Node.js updates section status to AI_DRAFT_READY.

[7. UI Update]
- The next frontend 3-second poll hits the GET /status endpoint.
- Endpoint returns { status: "AI_DRAFT_READY" }.
- Frontend kills polling loop, auto-fetches updated section, and renders the AI Draft Preview.
```
