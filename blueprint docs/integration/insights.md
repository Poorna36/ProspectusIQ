# Integration Section — Analytics, Logging & Observability
### ProspectusIQ SME IPO Platform · Operations Insight

---

## 1. Observability Overview (Hackathon Setup)

To maintain high development velocity and minimal infrastructure overhead, heavy observability tools (Grafana, Loki, Prometheus, OpenTelemetry) are excluded. 

Instead, the platform relies on **Structured Console Logging** and **Direct Database Queries** for metrics. This provides enough visibility for debugging and demo purposes without bogging down local machines.

---

## 2. Structured Log Payload Contract

Unstructured `console.log("Something happened")` is prohibited in the services. All logging must use a JSON formatter (e.g., Pino in Node.js, standard `logging` with JSON formatter in Python) so terminal output is readable and easily greppable.

**Standard Payload:**
```json
{
  "timestamp":    "2026-08-03T07:15:00.000Z",
  "level":        "INFO",
  "service":      "core-api | api-gateway | rules-engine | ai-engine",
  "requestId":    "uuid | null",      // Crucial for terminal tracing
  "message":      "string",           // Human readable summary
  "userId":       "uuid | null",
  "filingId":     "uuid | null",
  "durationMs":   145,                // Appended if logging an operation completion
  "statusCode":   201,                // Appended on HTTP boundary logs
  "errorStack":   "string | null"     // Present only on ERROR/FATAL levels
}
```

*Note: PII (PAN, Aadhaar, Raw Document Text) must be masked or omitted before logging. Logs must only reference UUID entity identifiers.*

---

## 3. Tracing Across Services

Because the AI drafting pipeline bounces from `core-api` → Redis Queue → Worker → `ai-engine`, you must be able to trace a request in the terminal.

- Ensure `X-Request-ID` is passed from the Gateway, to the Core API, into the BullMQ job payload, and finally into the Python AI Engine.
- To debug a stalled job, simply search your terminal (or combined docker-compose logs) for the `requestId`.

---

## 4. Key Business & Product Metrics

Instead of setting up Prometheus, business metrics can be queried directly from the Postgres database or displayed in a simple internal admin dashboard.

### 4.1 Pipeline Efficiency (SQL Queries)
- **Time to Draft:** Average difference between `created_at` in `section_inputs` and `created_at` in `ai_section_drafts`.
- **Filing Completion Status:** Simple `COUNT(*)` grouping by `filing.status`.

### 4.2 ML Quality Monitoring (Model Drift)
During the hackathon, these can be calculated on-the-fly to demonstrate the system's awareness of its AI performance:
- **AI Human Edit Rate:** % of paragraphs where Intermediary submitted `human_edited_text` instead of accepting the AI draft.
- **Verifier Confidence Average:** Average of `verifier_confidence` scores in `ai_section_drafts`.
- **Escalation Rate:** Count of AI drafts that hit the max retry cap and were routed as `NEEDS_HUMAN_REVIEW`.

*Showcasing these metrics directly in the Workbench Footer demonstrates a robust, production-minded approach to AI without needing actual production infrastructure.*
