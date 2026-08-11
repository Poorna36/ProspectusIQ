# ProspectusIQ — Backend API Integration Specification

This document provides the exact REST API endpoint contracts required by the **ProspectusIQ Intermediary Workbench Frontend** (`frontend/portal/`).

Give this document to your backend developer to connect FastAPI/Express services to the frontend.

---

## 🌐 Base Configuration
- **Default Base URL**: `http://localhost:8000/api/v1` (Overridable via `.env` variable `VITE_API_BASE_URL`).
- **Content-Type**: `application/json`

---

## 📡 Required Endpoints & Payloads

### 1. Fetch Active Filing Data
- **Endpoint**: `GET /api/v1/filings/{filing_id}`
- **Description**: Returns filing metadata, list of DRHP sections, compliance flags, and draft texts.
- **Response Schema (`200 OK`)**:
```json
{
  "id": "FL-2026-ABC-01",
  "companyName": "ABC Industries Private Limited",
  "cin": "U72900MH2019PTC328401",
  "gstin": "27AAACA1234B1Z5",
  "sector": "Enterprise Software & Automation",
  "targetIssueSize": "₹28.50 Crore",
  "completionPercent": 93,
  "overallStatus": "INTERMEDIARY_REVIEW",
  "sections": [
    {
      "key": "RISK_FACTORS",
      "title": "Risk Factors & Disclosures",
      "chapter": "Section III",
      "status": "IN_PROGRESS",
      "completionPercent": 88,
      "aiDraftText": "Our top three enterprise customers contributed 41.2% of total restated revenue for FY 2025–26...",
      "humanRedlineText": null,
      "aiConfidence": 94,
      "certified": false,
      "flags": [
        {
          "id": "FLAG-RF-01",
          "sectionKey": "RISK_FACTORS",
          "severity": "CRITICAL",
          "title": "Customer Concentration Disclosure Required",
          "description": "Top 3 customers contribute 41.2% of total restated revenue.",
          "clauseReference": "SEBI (ICDR) Schedule VI",
          "status": "OPEN"
        }
      ]
    }
  ]
}
```

---

### 2. Evaluate Deterministic Rules
- **Endpoint**: `POST /api/v1/rules/evaluate`
- **Description**: Runs hardcoded SEBI ICDR & NSE Emerge rule evaluations for a specific DRHP section.
- **Request Body**:
```json
{
  "sectionKey": "RISK_FACTORS"
}
```
- **Response Schema (`200 OK`)**:
```json
[
  {
    "id": "FLAG-RF-01",
    "sectionKey": "RISK_FACTORS",
    "severity": "CRITICAL",
    "title": "Customer Concentration Disclosure Required",
    "description": "Top 3 customers contribute 41.2% of total restated revenue.",
    "clauseReference": "SEBI (ICDR) Schedule VI",
    "status": "OPEN"
  }
]
```

---

### 3. Regenerate AI Paragraph Clause
- **Endpoint**: `POST /api/v1/draft/regenerate`
- **Description**: Invokes Generator LLM with reviewer guidance to draft a revised disclosure clause.
- **Request Body**:
```json
{
  "sectionKey": "RISK_FACTORS",
  "prompt": "Quantify financial dependence and clarify customer contract termination terms.",
  "paragraphText": "Our top 3 enterprise customers contributed 41.2% of total restated revenue..."
}
```
- **Response Schema (`200 OK`)**:
```json
{
  "revisedText": "Our top 3 enterprise customers contributed 41.2% of total restated revenue... Furthermore, contract termination requires a 180-day prior written notice with full settlement of outstanding receivables, mitigating immediate liquidity shock."
}
```

---

### 4. Submit Intermediary Certification Sign-off
- **Endpoint**: `POST /api/v1/certify`
- **Description**: Records Merchant Banker & Legal Counsel digital sign-off and seals the filing version.
- **Request Body**:
```json
{
  "filingId": "FL-2026-ABC-01",
  "reviewerName": "Priya Shah (Lead Counsel)"
}
```
- **Response Schema (`200 OK`)**:
```json
{
  "success": true,
  "hash": "8b3c912a4e98210984712409852f312",
  "certifiedAt": "2026-08-06T19:35:00Z"
}
```

---

## 🛠 Integration Steps for Backend Developer
1. Implement the 4 endpoints above in your FastAPI / Express backend.
2. Enable CORS for `http://localhost:3000` and `http://localhost:3001`.
3. Set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in `frontend/portal/.env`.
