# Backend Section — Project Structure & Tech Stack
### ProspectusIQ SME IPO Platform · Service Layer

---

## Overview

In a production environment, this backend would be split into microservices (Gateway, API, Rules Engine) with message queues. **For this hackathon, we are prioritizing extreme development velocity.**

The entire backend layer is organized as a **Single Monolithic Node.js Service** running in the `prospectusiq/backend/` directory. All rules processing, database mutations, and asynchronous AI dispatching happen within this single process.

---

## 1. Backend Folder Structure

```
prospectusiq/
└── backend/
    ├── src/
    │   ├── routes/                    # API route definitions
    │   ├── middleware/                # JWT validation & RBAC (imports from security/)
    │   ├── rules/                     # Stage 1 deterministic validation (Local functions)
    │   ├── db/
    │   │   ├── connection.ts          # SQLite connection
    │   │   ├── schema/                # Drizzle ORM schemas
    │   │   └── sqlite.db              # Local SQLite database file
    │   ├── services/
    │   │   └── ai_dispatcher.ts       # Native Javascript Promises calling the ML API
    │   └── server.ts                  # Fastify app initialization
    └── package.json
```

---

## 2. Tech Stack (Hackathon Optimized)

All complexity (Docker, Redis, BullMQ, Socket.io) has been stripped out.

| Layer | Technology | Role |
|---|---|---|
| **Runtime** | Node.js 20 LTS + TypeScript | Fast execution, strict typing |
| **HTTP Framework** | Fastify 4 | Routes, schema validation, middleware |
| **ORM** | Drizzle ORM | Type-safe SQLite queries and migrations |
| **Primary Database** | SQLite (libsql) | Local, zero-config relational persistence |
| **Background Jobs** | Native JS Async/Await | Replaces Redis/BullMQ. Non-blocking HTTP calls to ML |
| **Client Updates** | HTTP Short Polling | Replaces WebSockets. Frontend polls for status updates |
| **Schema Validation** | Zod + Fastify JSON Schema | Request/response validation |

---

## 3. Service Communication Contract

```
Client (Browser)
    │  HTTP (localhost)  [Uses Short Polling for async updates]
    ▼
Node.js Monolith (backend/)
    │
    ├──► Local SQLite DB (Synchronous read/write)
    │
    ├──► Local Rules Engine (Synchronous function calls in same process)
    │
    └──► Python ML Engine (ml/)
         HTTP POST /api/generate 
         (Called asynchronously without blocking the Client HTTP response)
```

---

## 4. Filing State Machine

All filing state transitions are managed exclusively by the Node backend.

```
DRAFT_IN_PROGRESS
    │  Section inputs submitted + Stage 1 rules validation passes
    ▼
AI_DRAFTING
    │  Node backend fires off async Promise to Python ML Engine
    ▼
AI_DRAFT_READY
    │  Python ML Engine returns draft; Node backend saves to SQLite
    ▼
PENDING_REVIEW
    │  Promoter submits to intermediary
    ▼
UNDER_REVIEW
    │  Intermediary team reviews, resolves flags, redlines text
    ▼
CERTIFIED_LOCKED  ──(immutable hash applied)──►  SUBMISSION_READY
```

---

## 5. Background Job Strategy (No Redis Required)

When a user submits data, we cannot make them stare at a loading spinner for 30 seconds while the AI generates text. Instead of a complex message queue, use simple asynchronous Node promises.

1. **Client Request:** Frontend calls `PUT /filings/123/sections/RISK_FACTORS`.
2. **State Update:** Backend updates DB status to `AI_DRAFTING`.
3. **Fire and Forget:** Backend invokes a function `generateDraftAsync(filingId, sectionId)` without `await`ing it. 
4. **Immediate Response:** Backend immediately returns HTTP 202 Accepted to the frontend.
5. **Background Process:** `generateDraftAsync` makes the HTTP call to the Python `ai-engine`. When Python replies 20 seconds later, the promise resolves, and Node updates the SQLite DB status to `AI_DRAFT_READY`.
6. **Frontend Polling:** Meanwhile, the Frontend is hitting `GET /api/status` every 3 seconds, eventually seeing `AI_DRAFT_READY` and fetching the new text.
