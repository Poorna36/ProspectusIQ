# Integration Section — Parallel Implementation Matrix
### ProspectusIQ SME IPO Platform · Project Planning & Progress

---

## Overview

This implementation matrix coordinates parallel execution across 4 distinct tracks: **Frontend**, **Backend**, **Machine Learning**, and **Security/Integration**.

Optimized for a hackathon sprint. Teams can run everything locally without Docker or complex orchestration. The Backend is a single Node monolith, the Frontend uses polling, and ML runs via a local Python server.

**Status Legend:**
- `[ ]` Not Started
- `[/]` In Progress
- `[>]` Blocked By (Track ID listed)
- `[x]` Complete

---

## Track 1: Backend (Node.js Monolith API)
*Focus: API Routing, State Machine, SQLite DB, Hardcoded Rules*

- [ ] **BE.1** Initialize Node.js/Fastify backend scaffolding. Configure Drizzle ORM.
- [ ] **BE.2** Implement Drizzle schemas and initialize local SQLite DB (`backend/data.md`).
- [ ] **BE.3** Implement standard API response wrapper and global error handler middleware.
- [ ] **BE.4** Build `Rules Engine` functions (JSON schema validators, RegEx entity extractors).
- [ ] **BE.5** Develop `Filings` and `Sections` CRUD API endpoints.
- [ ] **BE.6** Implement State Machine transition logic within the DB controllers.
- [ ] **BE.7** `[> BE.4]` Build mock MCA21/GSTIN functions within the Rules folder to simulate due diligence.
- [ ] **BE.8** Build the `ai_dispatcher` service (Native JS async functions to ping the Python ML server in the background).
- [ ] **BE.9** Build the `GET /status` endpoint for frontend HTTP Short Polling.

---

## Track 2: Machine Learning (Python AI Engine)
*Focus: RAG, Generator, Verifier, Python Service*

- [ ] **ML.1** Scaffold Python FastAPI service (`ai-engine`); define Pydantic API schemas.
- [ ] **ML.2** Implement local RAG pipeline: chunk SEBI ICDR regulations, generate embeddings, load ChromaDB locally.
- [ ] **ML.3** Develop `Generator` inference module (Prompting + LLM interaction + Grounding check).
- [ ] **ML.4** Develop `Verifier` inference module (Cross-encoder compliance classification).
- [ ] **ML.5** `[> ML.3, ML.4]` Orchestrate the End-to-End retry loop in `draft_orchestrator.py`.
- [ ] **ML.6** Create minimal training/mock datasets for the 5 target chapters.

---

## Track 3: Frontend (Portal & Workbench)
*Focus: UI/UX, Component Library, State Management (Flexible Stack)*

- [ ] **FE.1** Initialize frontend apps (Portal & Workbench) using the team's preferred stack (e.g. React/Vue, Tailwind).
- [ ] **FE.2** Implement generic API Client wrapper capable of attaching JWTs and parsing the standard JSON response envelope.
- [ ] **FE.3** Implement Interface A (Portal) Navigation and Mock Dashboard.
- [ ] **FE.4** Implement Interface B (Workbench) Navigation and Mock Flag list.
- [ ] **FE.5** `[> FE.2]` Implement HTTP Short Polling logic to track background AI jobs.
- [ ] **FE.6** Develop Portal Guided Input Forms (triggering Stage 1 validation).
- [ ] **FE.7** Develop Portal AI Draft Preview (Read-only visualization of drafts and flags).
- [ ] **FE.8** Develop Workbench Redline Editor (Reviewing flags, editing text).
- [ ] **FE.9** `[> BE.5]` Replace all mock data states with live HTTP calls to the monolithic Backend API.

---

## Track 4: Security & Integration
*Focus: Auth, RBAC, Data Protection, Seed Scripts*

- [ ] **SEC.1** Implement JWT Issuer and Refresh Token rotation utilities in `security/auth-lib`.
- [ ] **SEC.2** Implement authentication and RBAC middleware in the Backend API.
- [ ] **SEC.3** `[> SEC.1]` Wire Portal and Workbench Login/Register forms to Auth APIs.
- [ ] **SEC.4** Implement environment-variable based AES-256 encryption utilities for DB persistence (for PAN/Aadhaar).
- [ ] **INT.1** Configure Pino/Structlog for structured JSON logging across all services.
- [ ] **INT.2** Create `seed-mock-data.ts` to instantly pre-populate SQLite and ChromaDB for the live judge pitch.

---

## End-to-End Integration Milestones

1. **Milestone 1: The Core Loop (Tracks 1 + 3)**
   - Frontend can authenticate, create a filing, and save inputs to the SQLite DB via the Backend API.
2. **Milestone 2: The Intelligence Loop (Tracks 1 + 2)**
   - Backend successfully fires background async Promise; Python AI Engine picks it up, runs inference, and Node saves the draft.
3. **Milestone 3: The Complete Thread (All Tracks)**
   - User saves inputs in UI → Backend triggers internal Rules validation → Fires async Promise to AI Engine → AI generates draft → Backend saves draft to SQLite → Frontend Polling loop catches the state change → UI auto-refreshes to show the new draft.
