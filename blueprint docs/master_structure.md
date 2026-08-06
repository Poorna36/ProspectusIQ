# ProspectusIQ SME IPO Platform
## Master Project Directory Structure (Hackathon Optimized)

---

This document provides the combined, highly-optimized directory structure for the entire ProspectusIQ Hackathon project. 

**Hackathon Optimizations Applied:**
1. **No Microservices:** The API Gateway, Core API, and Rules Engine have been merged into a single Node.js backend to eliminate network-hop debugging and CORS headaches.
2. **No Docker/Redis:** BullMQ and Redis were removed. Background tasks are handled by native Javascript Async Promises.
3. **No WebSockets:** Real-time push was replaced with simple HTTP Short Polling for the frontend, saving hours of connection state management.

```text
prospectusiq/
│
├── frontend/                          # TRACK 3: UI & Interface
│   ├── portal/                        # Interface A (Company/Promoters)
│   │   ├── src/                       
│   │   └── package.json               
│   │
│   └── workbench/                     # Interface B (Intermediaries)
│       ├── src/                       
│       └── package.json
│
├── backend/                           # TRACK 1: Monolithic Node.js API
│   ├── src/
│   │   ├── routes/                    # API endpoints
│   │   ├── middleware/                # JWT Auth & RBAC
│   │   ├── rules/                     # Deterministic validation & NER extractors
│   │   ├── db/
│   │   │   ├── connection.ts          # SQLite initialization
│   │   │   ├── schema/                # Drizzle ORM entity models
│   │   │   └── sqlite.db              # The local SQLite file
│   │   ├── services/                  
│   │   │   └── ai_dispatcher.ts       # Native JS Async functions calling Python
│   │   └── server.ts                  # Fastify entrypoint
│   └── package.json
│
├── ml/                                # TRACK 2: Intelligence (Python)
│   ├── ai-engine/                     # Live Inference API (FastAPI)
│   │   ├── src/
│   │   │   ├── generator/             
│   │   │   ├── verifier/              
│   │   │   ├── rag/                   
│   │   │   ├── pipelines/
│   │   │   └── api/
│   │   │       └── server.py          
│   │   └── requirements.txt
│   │
│   ├── data/                          # Vector Store (Local ChromaDB)
│   └── scripts/                       # Training & ETL (Offline)
│
├── integration/                       # TRACK 4: The Glue
│   ├── openapi-schema.json            # The central API contract for Frontend
│   ├── scripts/
│   │   ├── start-all.sh               # Single boot script (starts FE, BE, ML)
│   │   └── seed-mock-data.ts          # Instantly populates SQLite & ChromaDB for demo
│   └── types/                         # Shared Typescript definitions
│
└── security/                          # TRACK 5: Auth & Hardening
    ├── auth-lib/                      # Shared JWT Issuance & Verification utilities
    ├── crypto/                        # Local AES-256 field encryption utilities
    └── mock-kyc/                      # Hardcoded mock responses for MCA21 / GSTIN APIs
```

---

## 2. Boot Sequence (For the Demo)

With the removal of Redis and Docker, booting the project is now incredibly fast and entirely local.

1. **Seed Data:** `cd integration/scripts && ts-node seed-mock-data.ts`
2. **Start ML Engine:** `cd ml/ai-engine && uvicorn src.api.server:app --reload`
3. **Start Backend Monolith:** `cd backend && npm run dev`
4. **Start Frontend:** `cd frontend/portal && npm run dev`


---

## 3. Master Specifications Cross-Reference

- **Product & Workflow Master Spec:** [`PRODUCT_WORKFLOW_SPEC.md`](./PRODUCT_WORKFLOW_SPEC.md)
  - Complete 18-chapter DRHP wizard hierarchy (4 Master Phases).
  - Realistic 21-Day (3-Week) Timeline Engine & SLA buffer tracking.
  - First-Time Setup Handshake (`Engagement Code: MB-SEBI-2026-X942`).
  - Dual Communication Layer (Inline threads + Persistent Messaging Drawer).
  - Multi-tier Flagging (`CRITICAL_BLOCKING`, `COMPLIANCE_WARNING`, `SUGGESTION_TIP`).
  - Phase Certification & Seal Bronze (`#A9762F`) lock animation.
  - 5 Core Interactive Visualizations (Promoter Group Network, Objects Waterfall, Financial Trends, Peer Multiples, Risk Donut).
  - Demo Mock OCR Document Scanner.
  - PDF Export, Print Styles & Dynamic Watermarking.
  - Digital e-Sign Modal & SEBI ICDR 2018 Schedule VI Compliance Checklist.
