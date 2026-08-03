# Frontend Section — Project Structure & Contracts
### ProspectusIQ SME IPO Platform · Interface Layer

---

## Overview

The frontend layer is isolated entirely within the `prospectusiq/frontend/` directory. It comprises two distinct application contexts:

| Application Context | Users | Role |
|---|---|---|
| **Interface A — Company Portal** | SME Promoters | Data input, document upload, read-only AI draft review |
| **Interface B — Intermediary Workbench** | Merchant Bankers, Legal Counsel, Auditors | Flag resolution, redline editing, due diligence, certification |

---

## 1. Architectural Agnosticism

The frontend architecture is intentionally decoupled from specific UI frameworks, CSS toolkits, or state management libraries. The implementation team retains full autonomy over the frontend technology stack (e.g., React, Vue, Tailwind).

To ensure seamless integration with the Backend and Machine Learning layers, the frontend stack must strictly satisfy the following operational capabilities:
- Consume and parse JSON payloads strictly typed against the `openapi-schema.json`.
- Securely manage and attach JWT Authorization headers.
- Implement HTTP Short Polling for asynchronous state management.

---

## 2. Integration Contracts (Mandatory)

Regardless of the internal stack or folder structure chosen within `frontend/`, the team must implement the following architectural flows to ensure end-to-end system viability.

### 2.1 API Communication
- **Isolated State Mutations:** The frontend has zero direct access to the database. All reads and mutations must route exclusively through the monolithic Backend API (`backend/`).
- **Response Handling:** All backend responses are wrapped in a standard JSON envelope: `{ success: true, data: {...} }` or `{ success: false, error: {...} }`. The HTTP client must intercept and parse this envelope systemically.

### 2.2 Asynchronous State Tracking (HTTP Short Polling)
Due to the time required for AI drafting (10-30 seconds), the frontend cannot rely on synchronous HTTP responses. To optimize for the hackathon, we are avoiding complex WebSockets and using simple **HTTP Short Polling**.

1. **Trigger:** The user submits data. The backend responds immediately with `HTTP 202 Accepted` and a status of `AI_DRAFTING`.
2. **Polling Loop:** The frontend locks the UI section and initiates a polling loop (e.g., using `setInterval` or React Query's `refetchInterval`). It pings `GET /api/filings/{id}/sections/{key}/status` every **3 seconds**.
3. **Resolution:** Once the endpoint returns `status: "AI_DRAFT_READY"`, the frontend terminates the polling loop, invalidates its local cache, and re-fetches the section data to render the newly generated AI draft.

### 2.3 Authentication & Session Management
1. **Token Storage:** Login/Register flows yield an `accessToken` (short-lived) and a `refreshToken` (long-lived).
2. **Request Interception:** The frontend must attach `Authorization: Bearer <accessToken>` to all protected API calls.
3. **Token Rotation:** If an API call yields a `401 UNAUTHORIZED`, the frontend client must seamlessly request a new access token via `/auth/token/refresh` and replay the stalled request without interrupting the user experience.

### 2.4 State Machine Observance
The frontend must strictly reflect the server-side filing state machine.
- **Enforced UI Locking:** If a section enters `status: PENDING_AI` or `AI_DRAFTING`, the frontend must transition the input fields to a locked, read-only state and render a loading indicator. The user cannot edit the section until the backend confirms the AI is finished.
