# Sebii

Sebii is a platform designed to automate and audit the drafting of SME IPO offer documents (DRHPs). It relies on a three-part system: an AI that drafts the text, a hardcoded rules engine that checks it against SEBI regulations, and an interface for human intermediaries (merchant bankers, lawyers) to finally certify the document.

The goal is to stop relying purely on LLMs for legal docs and instead gate the AI behind deterministic rules and human sign-offs.

## Architecture

The system is split into three main layers:

1. **Rules Engine (Pre-AI)**
Before the AI generates anything, this layer extracts the numeric facts and runs external API checks (like MCA21 and GSTIN) to catch major issues early.

2. **Dual-Model AI Engine**
We use two models. The Generator takes the data and writes the disclosure. The Verifier (a cross-encoder) audits that text against SEBI rules to catch missing clauses or unquantified claims.

3. **Intermediary Workbench**
The AI is never allowed to submit the final doc. Intermediaries use this interface to resolve flags, edit the text, and cryptographically sign off on the DRHP.

## Project Structure

This monorepo is broken down by team track so we can work in parallel without merge conflicts.

- `frontend/` - React/Vue apps (contains the Portal and the Workbench).
- `backend/` - Node.js API. Handles the SQLite db, the rules engine, and async tasks.
- `ml/` - Python inference server for the LLM and the cross-encoder.
- `integration/` - Shared scripts, TS types, and mock data.
- `security/` - JWT auth and local AES encryption logic.
- `blueprint docs/` - Detailed API contracts and system specs.

## Local Setup

Everything is configured to run locally for development.

**1. Seed the db**
```bash
cd integration/scripts
ts-node seed-mock-data.ts
```

**2. Start the AI service**
Make sure you have Python 3.10+ installed.
```bash
cd ml/ai-engine
pip install -r requirements.txt
uvicorn src.api.server:app --reload
```

**3. Start the API**
Requires Node 20+.
```bash
cd backend
npm install
npm run dev
```

**4. Start the Frontend**
```bash
cd frontend/portal
npm install
npm run dev
```
