# ProspectusIQ — Complete Product Workflow & User Experience Specification
### Enterprise-Grade SME IPO Offer Document Platform

---

## 1. Executive Product Philosophy & Realistic Timeline Engine

### 1.1 The Real-World Regulatory Context
In traditional capital markets, drafting a Draft Red Herring Prospectus (DRHP) for an SME IPO takes **3 to 6 weeks** of grueling manual coordination across founders, merchant bankers, legal counsel, and statutory auditors. The delay is primarily caused by:
- Fragmented email threads and unstructured file attachments.
- Repeated manual cross-verification of financial restatements across multiple chapters.
- Back-and-forth clarification queries regarding vague or unquantified risk disclosures.

### 1.2 The ProspectusIQ Accelerated Timeline (2–3 Weeks)
ProspectusIQ does **not** claim to generate a legal DRHP instantly in 5 seconds. Instead, it compresses the 3–6 week manual drafting cycle into a highly structured, audit-ready **14-to-21 day (2–3 week) collaborative workflow**:

`
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROSPECTUSIQ 21-DAY TIMELINE ENGINE                  │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│ DAYS 1 – 5        │ DAYS 6 – 14       │ DAYS 15 – 21                    │
│ Phase 1 & 2       │ Phase 3 & 4       │ Final Multi-Signatory           │
│ Promoter Guided   │ Intermediary      │ Verification, Escalation        │
│ Onboarding & Data │ Redline & Flag    │ Resolution & Immutable          │
│ Ingestion         │ Resolution        │ Certification Seal Lock         │
└───────────────────┴───────────────────┴─────────────────────────────────┘
`

### 1.3 Target Buffer & Time Estimation Engine
- **Section SLA Tracking:** Each chapter calculates an **Estimated Completion Pace** based on promoter input completeness and active intermediary redlines (e.g., *"Risk Factors: ~3.5 Hours of Drafting Remaining"*).
- **Buffer Management:** Automatically flags sections approaching target milestone deadlines (e.g., *"Warning: Objects of the Issue is 2 days behind target schedule"*).

---

## 2. First-Time Engagement Setup & Pair-Lock Protocol

To prevent unauthorized access and mirror authentic capital markets workflows, Interface A (Promoter Portal) and Interface B (Intermediary Workbench) connect via a secure **First-Time Setup Handshake**:

`
┌─────────────────────────┐                   ┌─────────────────────────┐
│  INTERMEDIARY WORKBENCH │                   │     PROMOTER PORTAL     │
│       (Interface B)     │                   │      (Interface A)      │
│                         │                   │                         │
│ 1. Merchant Banker      │                   │ 3. Promoter registers   │
│    generates unique     │ 2. Out-of-band     │    using CIN, Email,    │
│    Engagement Code      │─── (Email/PDF) ──▶│    AND Engagement Code  │
│    (e.g., MB-2026-X942) │                   │    (MB-2026-X942)       │
└─────────────────────────┘                   └─────────────────────────┘
                                                           │
                                                           ▼
                                              ┌─────────────────────────┐
                                              │ Cryptographic Link      │
                                              │ Established (RBAC)      │
                                              └─────────────────────────┘
`

1. **Engagement Token Issuance:** The Lead Merchant Banker initiates a filing on Interface B and generates a unique, single-use **Engagement Code** (MB-SEBI-2026-X942).
2. **Promoter Registration:** The SME Promoter signs up on Interface A, providing their Corporate Identity Number (CIN), Director Identification Number (DIN), and the Engagement Code.
3. **Workspace Pairing:** Upon validation, the backend creates an authenticated workspace link binding the promoter's filing state directly to the assigned Merchant Banker, Legal Counsel, and Auditor team.

---

## 3. Complete 18-Chapter DRHP Survey Wizard Hierarchy

While the advanced AI Generator and Verifier ML models specialize in the **Core 5 High-Scrutiny Chapters**, ProspectusIQ presents a **complete 18-chapter DRHP structure** grouped into **4 Master Phases**:

`
PROSPECTUSIQ FULL DRHP STRUCTURE
├── MASTER PHASE 1: FOUNDATIONAL & PROMOTER DISCLOSURES (Days 1–5)
│   ├── Ch 1: Cover Page & Table of Contents
│   ├── Ch 2: Definitions & Abbreviations
│   ├── Ch 3: Capital Structure & Shareholding Pattern
│   ├── Ch 4: Promoter Group & Family Tree Network [CORE ML]
│   └── Ch 5: History & Corporate Structure
│
├── MASTER PHASE 2: BUSINESS & FINANCIAL PERFORMANCE (Days 6–10)
│   ├── Ch 6: Business Overview & Industry Position [CORE ML]
│   ├── Ch 7: Restated Financial Statements & Financial Indicators
│   ├── Ch 8: Management's Discussion & Analysis (MD&A)
│   ├── Ch 9: Peer Group Valuation Comparison [CORE ML]
│   └── Ch 10: Objects of the Issue & Fund Allocation [CORE ML]
│
├── MASTER PHASE 3: LEGAL, RISK & REGULATORY COMPLIANCE (Days 11–15)
│   ├── Ch 11: Risk Factors & Material Disclosures [CORE ML]
│   ├── Ch 12: Outstanding Litigations & Material Developments
│   ├── Ch 13: Government & Statutory Approvals
│   ├── Ch 14: Other Regulatory & Statutory Disclosures
│   └── Ch 15: Corporate Governance & Board Structure
│
└── MASTER PHASE 4: OFFER STRUCTURE & CERTIFICATION (Days 16–21)
    ├── Ch 16: Offer Structure & Bid/Offer Terms
    ├── Ch 17: Description of Equity Shares & Main Provisions of Articles
    └── Ch 18: Intermediary Certifications & Immutable Lock
`

---

## 4. Dual Communication Channels

ProspectusIQ eliminates messy external messaging by embedding **two distinct, purpose-built communication layers**:

### 4.1 Contextual Inline Annotation Threads
- **Location:** Attached directly to specific text paragraphs, tables, or numeric variables in both Interface A and B.
- **Usage:** Pointed feedback on specific clauses (e.g., *"Legal Counsel: Please clarify if the tax notice of ₹45 Lakhs includes penalty interest"*).
- **Status:** Resolved / Open / Escalated.

### 4.2 Persistent Workspace Messaging Drawer
- **Location:** Slide-out communication drawer accessible from the top navigation bar on both portals.
- **Usage:** General coordination, meeting scheduling, document requests, and broad Q&A between the SME Founder and the Merchant Banking team.
- **Features:** Role badges (PROMOTER, MERCHANT_BANKER, LEGAL_COUNSEL), file attachment support, and unread message indicators.

---

## 5. Unified Notification & Alert Engine

A centralized notification drawer delivers real-time updates across both interfaces:

| Event Type | Target Interface | Severity | Notification Toast Example |
|---|---|---|---|
| FLAG_RAISED | Interface A (Promoter) | 🟡 Amber | *"AI Verifier flagged Risk Factor #3: Materiality percentage missing."* |
| CLARIFICATION_REQUESTED | Interface A (Promoter) | 🔴 Red | *"Merchant Banker requested clarification on Objects of the Issue fund allocation."* |
| PHASE_SUBMITTED | Interface B (Intermediary) | 🔵 Blue | *"TechNova Solutions submitted Phase 2 (Financials & Business) for review."* |
| SECTION_LOCKED | Both Interfaces | 🟢 Green | *"Risk Factors certified and locked by Lead Legal Counsel."* |
| SLA_WARNING | Both Interfaces | 🟡 Amber | *"Warning: Objects of the Issue review is 24 hours from target SLA deadline."* |

---

## 6. Multi-Tier Flagging System & Actionable AI Suggestions

### 6.1 Multi-Tier Flagging System
Issues detected by the Rules Engine or AI Verifier fall into three clear severity tiers:

1. 🔴 **CRITICAL_BLOCKING (Red):** Severe regulatory or numeric violations (e.g., Fund allocation total does not equal Net Proceeds; Struck-off company found in Promoter Group). **Blocks phase submission.**
2. 🟡 **COMPLIANCE_WARNING (Amber):** Subjective or specificity deficiencies (e.g., Risk factor lacks quantified percentage; Buzzword used without source). **Requires human review or written justification.**
3. 🔵 **SUGGESTION_TIP (Blue):** Non-blocking structural or clarity enhancements.

### 6.2 Actionable AI Suggestion Chips
Inline suggestion cards offer quick actions for promoters:
- *"Tip: Add 3-year historical CAGR to support the revenue growth claim in paragraph 2."* [Apply Suggestion]
- *"Tip: Format debt-to-equity ratio as a comparative table against industry peers."* [Auto-Format Table]

---

## 7. The Phase Certification & Bronze Seal Locking Protocol

To uphold regulatory integrity and prevent uncoordinated edits:

`
Promoter Submits Phase  ──▶  Rules & AI Pass  ──▶  Intermediaries Review & Redline
                                                            │
                                                            ▼
                                                All Flags Resolved (100%)
                                                            │
                                                            ▼
                                               [CERTIFY & LOCK ACTION]
                                                            │
                                                            ▼
                                              ✨ BRONZE SEAL ANIMATED STAMP
                                              (#A9762F "CERTIFIED & LOCKED")
                                                            │
                                                            ▼
                                              Phase marked READ-ONLY;
                                              Next Phase Unlocks
`

- **Multi-Signatory Signoff:** Interface B requires explicit signoffs from assigned roles (Merchant Banker, Legal, Auditor).
- **The Bronze Seal Stamp:** Upon final certification, a custom **Bronze Seal Stamp animation (#A9762F)** visually stamps the chapter as **CERTIFIED & LOCKED**.
- **Immutable State:** Once locked, the section becomes strictly **Read-Only** for all users. Unlocking requires a formal multi-party override request logged in the immutable audit trail.

---

## 8. Full 20-Minute Hackathon Presentation Narrative

When demonstrating ProspectusIQ to judges, use this polished 20-minute structure:

* **00:00 – 03:00 | The Problem & Handshake Setup:** Show traditional 3-6 week DRHP friction. Demonstrate Interface A registration using the Merchant Banker's **Engagement Code (MB-SEBI-2026-X942)**.
* **03:00 – 08:00 | Interface A (Promoter Portal):** Walk through the 18-chapter Phase Wizard. Fill out structured inputs for *Risk Factors*. Ask **Copilot** a plain-language question. Generate text, see inline amber flags, and submit Phase 1.
* **08:00 – 14:00 | Interface B (Intermediary Workbench):** Show the Merchant Banker's view. Open the Clause-by-Clause compliance panel. Show MCA21/GSTIN due diligence checks. Use **Copilot (Intermediary Mode)** to verify SEBI ICDR clauses. Thread a clarification message to the promoter.
* **14:00 – 17:00 | Resolve & Certification Seal:** Promoter resolves the note. Intermediary clicks **Certify & Lock**. Show the **Bronze Seal Stamp animation** locking Phase 1.
* **17:00 – 20:00 | Security & Audit Package:** Execute a live SQL injection attack in the search bar (%27 OR 1=1 --) to show the **SQLi Classifier** blocking it. Export the complete **Submission Package & Immutable Audit Trail**.

---

## 9. Phase Stepper, Previous Phase Inspection & Unlock Request Workflow

### 9.1 Multi-Phase Document Stepper Header
At the top of both Interface A (Promoter) and Interface B (Intermediary), a sleek **Phase Stepper Bar** displays the active filing's progression:

`	ext
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: Foundational       PHASE 2: Financials & Business    PHASE 3: Legal & Risk   │
│  [🔒 CERTIFIED & LOCKED]     [✍️ ACTIVE DRAFTING]               [⏳ UPCOMING]          │
└────────────────────────────────────────────────────────────────────────────────────────┘
`

### 9.2 Previous Phase Inspection & Formal Unlock Request
- **Read-Only Inspection:** Clicking any previously certified phase (e.g., Phase 1) opens the **Certified Document View**, showing the exact text, tables, and the **Bronze Seal Stamp** (#A9762F).
- **Formal Unlock Request:** If a promoter needs to update a locked phase (e.g., Cap Table change):
  1. Promoter clicks **"Request Intermediary Unlock"**.
  2. Prompts a modal asking for a **Justification Reason** (e.g., *"Updated pre-IPO bonus share allotment"*).
  3. Sends an urgent 🔴 UNLOCK_REQUESTED notification to the Merchant Banker on Interface B.
  4. The Merchant Banker must explicitly approve the unlock request in the audit log before the section reverts from LOCKED to REVISION_ACTIVE.

---

## 10. Embedded Interactive Financial & Compliance Analytics (Graphs & Charts)

To make the platform visually impressive and realistic, data views render rich, embedded micro-visualizations rather than plain raw text:

`
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  EMBEDDED VISUAL ANALYTICS PANELS                                                       │
├───────────────────────────────────────┬────────────────────────────────────────────────┤
│  1. CAP TABLE PROMOTER SHAREHOLDING   │  2. OBJECTS OF THE ISSUE FUND ALLOCATION       │
│     Pre-IPO vs Post-IPO Donut Chart   │     Interactive Stacked Bar Chart              │
│     (Promoters: 74% ➔ 55%)            │     (Plant & Machinery | Debt | General)       │
├───────────────────────────────────────┼────────────────────────────────────────────────┤
│  3. PEER GROUP COMPARISON VALUATION   │  4. FINANCIAL PERFORMANCE TRENDLINES           │
│     Multi-Bar P/E & RoNW Metrics      │     3-Year Restated Revenue & PAT Growth Lines │
└───────────────────────────────────────┴────────────────────────────────────────────────┘
`

1. **Cap Table Pre/Post IPO Donut Chart (Ch 3 & 4):** Displays promoter vs public dilution breakdown pre- and post-issue.
2. **Fund Utilization Breakdown Stacked Bar (Ch 10):** Renders expenditure allocation reconciled against verified vendor quotes.
3. **Peer Valuation Comparison Multi-Bar (Ch 9):** Compares the issuer's P/E ratio, EPS, and RoNW against listed industry competitors.
4. **Restated Financial 3-Year Trend Lines (Ch 7 & 8):** Visualizes Revenue, EBITDA, and Profit After Tax (PAT) growth trajectories across historical financial years.

---

## 11. Judge "Wow Factors" & High-Impact Demo Enhancements

For an online hackathon presentation (20-minute live demo), these specific UI/UX elements create an unforgettable impression:

### 11.1 Real-Time "SEBI Disclosure Readiness" Meter
- Positioned prominently in the top header.
- Displays a dynamic radial gauge: 88% SEBI Compliance Readiness.
- Automatically recalculates and animates upwards whenever a flag is resolved or a phase is certified.

### 11.2 Intermediary "Diff & Cross-Check" Split View
- In Interface B, intermediaries can toggle a **Split View**:
  - **Left Pane:** Promoter's uploaded raw restated financial statement / vendor quote.
  - **Right Pane:** AI-drafted DRHP clause with highlighted numeric variables (ariable_revenue_FY26).
  - **Match Indicator:** [100% RECONCILED — NO MISMATCH] in bold green.

### 11.3 Instant "SEBI Submission Package & Compliance Audit Certificate" Export
- A single click on **"Export SEBI Package"** generates:
  1. The complete, formatted 18-chapter DRHP document package.
  2. A formal **Cryptographic Compliance Audit Certificate** summarizing all 100% resolved rule checks, intermediary sign-offs, and verified API due-diligence matches.


---

## 9. Multi-Phase Navigation, State Machine & Phase Unlock Protocol

To provide a sleek, authoritative user experience without UI clutter, ProspectusIQ implements a strict **Phase Navigation Bar & State Engine** across both Interface A and Interface B.

### 9.1 Phase State Machine & Visual Indicators

`
┌───────────┐      Submit      ┌───────────┐   Intermediary   ┌────────────────┐
│ DRAFTING  │─────────────────▶│ SUBMITTED │   Review/Redline │ UNDER_REDLINE  │
└───────────┘                  └───────────┘ ◄────────────────┴────────────────┘
      ▲                              │
      │                              │ All Flags Cleared
      │ Request Unlock               ▼
┌──────────────────┐       ┌──────────────────┐
│ UNLOCK_REQUESTED │ ◄──── │ CERTIFIED_LOCKED │ ✨ Sealed with Bronze Stamp (#A9762F)
└──────────────────┘       └──────────────────┘
`

| State | Promoter Permissions (Interface A) | Intermediary Permissions (Interface B) | Visual Badge / UI Style |
|---|---|---|---|
| DRAFTING | Full Edit & Input | Read-Only Preview | 🔵 **Blue Badge** — *"In Progress"* |
| SUBMITTED | Read-Only (Awaiting Review) | Full Review & Flagging | 🟡 **Amber Badge** — *"Under Review"* |
| UNDER_REDLINE | Edit Flagged Items Only | Active Redline / Commenting | 🔴 **Red Badge** — *"Clarifications Needed"* |
| CERTIFIED_LOCKED | Read-Only (Stamped) | Read-Only (Stamped) | 🏽 **Seal Bronze (#A9762F)** — *"Certified & Locked"* |
| UNLOCK_REQUESTED | Read-Only (Pending Approval) | Approve/Deny Unlock Request | 🟣 **Purple Badge** — *"Amendment Requested"* |

### 9.2 Previous Phase Inspection & Amendment Request Flow
- **Inspecting Past Phases:** Users can click any previously completed phase in the top phase tracker. The document renders in a crisp **"Certified Document View"** (paper white background, subtle hairline border, and the Bronze Certification Seal at the top right).
- **Requesting Amendments on Locked Phases:**
  1. If a promoter or banker discovers new financial data affecting a locked phase, they click **"Request Amendment Unlock"**.
  2. The user inputs an **Amendment Rationale** (e.g., *"FY25 Restated Tax Audit updated by Statutory Auditor"*).
  3. The Lead Merchant Banker receives a high-priority alert.
  4. If approved, the section temporarily transitions to UNLOCK_REQUESTED $\rightarrow$ DRAFTING, logging every change in the **Immutable Audit Trail** before requiring re-certification.

---

## 10. Purposeful Data Visualizations & Interactive Analytics

ProspectusIQ avoids generic "dashboard clutter". Every chart and graph directly solves a critical SEBI disclosure challenge:

`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROSPECTUSIQ VISUAL ANALYTICS ENGINE                     │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ 1. Promoter Group Network     │ Interactive Node Graph mapping Promoters,   │
│    Mapper (Graph View)        │ Relatives & Group Entities vs. MCA21 DB     │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 2. Financial KPI Trend        │ Grouped Bar/Line Chart showing 3-Year       │
│    Visualizer                 │ Restated Revenue, EBITDA, PAT & EPS Trend   │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 3. Objects of the Issue       │ Waterfall Flow matching Net Issue Proceeds  │
│    Reconciler                 │ vs. Line-Item Allocations & Vendor Quotes   │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 4. Peer Group Valuation       │ Comparative Bar Chart comparing P/E,        │
│    Multiples                  │ EV/EBITDA & RoNW against Listed Competitors │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ 5. Compliance & Risk          │ Donut Chart showing Open Flags by Category  │
│    Distribution Radar         │ (Materiality, Numeric Mismatch, Buzzwords)  │
└───────────────────────────────┴─────────────────────────────────────────────┘
`

### 10.1 Key Interactive Graphs Explained
1. **Promoter Group Network Graph (Ch 4):** Node-link diagram where green nodes represent declared family members, blue nodes represent corporate entities, and **pulsing red nodes** highlight undisclosed related-party connections detected via MCA21 API cross-checking.
2. **Objects of the Issue Waterfall Chart (Ch 10):** Shows exact monetary flow: Gross Issue Proceeds $\rightarrow$ Issue Expenses $\rightarrow$ Net Proceeds $\rightarrow$ Plant Expansion / Debt Repayment / Working Capital. Any unallocated gap is flagged in red.
3. **Peer Group Comparison Multiples (Ch 9):** Displays a side-by-side valuation chart comparing the issuer's P/E ratio (e.g., 18.4x) against benchmarked listed peers (e.g., Competitor A 24.2x, Competitor B 21.8x).

---

## 11. Hackathon Online Demo "Wow Factors" & Presentation Strategy

To deliver an unforgettable 20-minute live online presentation for hackathon judges:

### 🌟 Wow Factor 1: Side-by-Side Dual Browser Live Sync
- **Setup:** Arrange two browser windows side-by-side on screen:
  - **Left Window:** Interface A (Promoter Portal)
  - **Right Window:** Interface B (Intermediary Workbench)
- **The Wow Moment:** Promoter submits Phase 1 on the left window $\rightarrow$ within **< 1 second**, the Intermediary Workbench on the right window plays a subtle notification chime, updates the status dot to Amber, and displays the incoming submission toast.

### 🌟 Wow Factor 2: One-Click "Demo Scenario Seed" Button
- **Setup:** A discreet **"🚀 Seed TechNova IPO Scenario"** button in the header.
- **The Wow Moment:** Instantly populates the entire 18-chapter structure with authentic, realistic financial restatements, cap table data, and vendor quotes for an SME Textile Infrastructure manufacturer (TechNova Solutions Ltd). Judges see a full, rich document immediately without waiting for typing.

### 🌟 Wow Factor 3: Live Interactive Redline Differential Viewer
- **The Wow Moment:** Toggle between **"AI Draft"**, **"Intermediary Redline"**, and **"Diff View"**. Shows green highlights for added legal clauses and red strikethroughs for deleted buzzwords.

### 🌟 Wow Factor 4: Live Security Attack Interception
- **The Wow Moment:** Type a SQL injection string (%27 OR 1=1 --) directly into the global search bar. The **Character TF-IDF Security Classifier** blocks the query live on screen with a red security card: [BLOCKED] Malicious SQL Payload Intercepted (Confidence: 99.4%).

### 🌟 Wow Factor 5: One-Click Certified Submission Package Export
- **The Wow Moment:** Click **"Export Official SEBI Package"** $\rightarrow$ Instantly compiles:
  1. The complete 18-chapter DRHP PDF package.
  2. The SEBI ICDR Compliance Certificate.
  3. The Cryptographic Immutable Audit Trail JSON.


---

## 12. Interactive Document & Image OCR Scanner (Demo Mock Workflow)

To showcase multimodal document ingestion without requiring complex OCR server infrastructure during the hackathon, ProspectusIQ includes a realistic, pre-scripted **Document & Image Scanner Modal**:

`
┌─────────────────────────────────────────────────────────────────────────┐
│              DOCUMENT & IMAGE OCR INGESTION MODAL                       │
├─────────────────────────────────────────────────────────────────────────┤
│ Drag & drop GST Certificate, Vendor Quote, or Audited Financial PDF    │
│                                                                         │
│  [ 📄 Vendor_Quote_Weaving_Looms.png ]  --> [ SCAN & ANALYZE ]          │
├─────────────────────────────────────────────────────────────────────────┤
│ LIVE SCANNING ANIMATION:                                                │
│  [████████████████████████████████░░░░] 78%                              │
│  ✓ Ingesting High-Res Image Bounds...                                   │
│  ✓ Executing OCR Text Extraction...                                     │
│  ✓ Running Named Entity Recognition (NER)...                            │
│  ✓ Validating Vendor GSTIN against Rules Engine...                      │
├─────────────────────────────────────────────────────────────────────────┤
│ AUTO-POPULATED EXTRACTED VARIABLES:                                     │
│  • Vendor Name: Lakshmi Machine Works Ltd                               │
│  • Vendor GSTIN: 27AAACL1234F1Z9 (Status: ACTIVE ✅)                     │
│  • Quoted Equipment Total: ₹ 14,500,000 (₹ 1.45 Crore)                  │
│  • Quotation Date: June 14, 2026                                        │
│                                                                         │
│                       [ CONFIRM & INSERT INTO DRHP ]                    │
└─────────────────────────────────────────────────────────────────────────┘
`

### 12.1 Interactive Scanner Workflow Sequence
1. **Trigger:** Promoter clicks **"📷 Scan Document / Quote"** in Section 10 (*Objects of the Issue*) or Section 7 (*Financial Statements*).
2. **File Selection:** User selects any image (.png, .jpg) or PDF file.
3. **Animated Processing:** Shows a sleek 2.5-second processing sequence with step-by-step checkmarks:
   - Ingesting Document Image Bounds $\rightarrow$ OCR Text Extraction $\rightarrow$ NER Variable Tagging $\rightarrow$ Rules Engine Validation.
4. **Scripted Entity Insertion:** Auto-fills form fields and inserts structured financial variables directly into the active DRHP chapter, firing a real-time notification toast.

---

## 13. PDF Export, Print Engine & Document Watermarking

ProspectusIQ features an **Enterprise PDF Export & Print Engine** available on both Interface A and Interface B:

`
┌─────────────────────────────────────────────────────────────────────────┐
│                    EXPORT & PRINT ENGINE OPTIONS                        │
├─────────────────────────────────────────────────────────────────────────┤
│  [ 📄 Export Complete DRHP (PDF) ]   [ 🖨️ Print Section View ]          │
│  [ 📜 Download Compliance Certificate ] [ 🔍 Export Raw Audit (JSON) ]  │
└─────────────────────────────────────────────────────────────────────────┘
`

### 13.1 Watermark & Layout Rules
- **Draft Watermark:** Any unlocked or active phase renders with a subtle, diagonal grey background watermark:
  DRAFT — SUBJECT TO INTERMEDIARY CERTIFICATION.
- **Certified Watermark:** Once a section is locked by the Bronze Stamp (#A9762F), the watermark switches to:
  CONFIDENTIAL — CERTIFIED & LOCKED BY INTERMEDIARY.
- **Print Stylesheet (@media print):** Hides all UI buttons, sidebars, and chat drawers. Renders a clean, official SEBI-formatted 2-column header containing:
  - Company CIN & Registered Office Address.
  - Page numbers (Page X of Y).
  - Active Certification Seal Stamp at top-right.

---

## 14. Unified Shared Audit Trail & Activity Log (Cross-Portal View)

To ensure 100% transparency between Promoters and Intermediaries, both portals feature a **Unified Shared Activity Log Drawer**. Every event across Interface A and Interface B is recorded in a shared chronological stream:

`
┌─────────────────────────────────────────────────────────────────────────────┐
│                   UNIFIED CROSS-PORTAL ACTIVITY LOG                         │
├──────────┬──────────────┬───────────────────────────────────────────────────┤
│ TIME     │ ACTOR        │ ACTION / EVENT DESCRIPTION                        │
├──────────┼──────────────┼───────────────────────────────────────────────────┤
│ 10:00 AM │ Promoter     │ Uploaded vendor quote: Vendor_Quote_Looms.png     │
│ 10:02 AM │ AI Engine    │ Synthesized Objects of Issue text (v1)            │
│ 10:04 AM │ Rules Engine │ Validated Vendor GSTIN 27AAACL1234F1Z9 (Active)   │
│ 10:15 AM │ Lawyer       │ Added inline clarification on Clause 3.2          │
│ 10:22 AM │ Banker       │ Applied Bronze Seal Lock (#A9762F) on Phase 1     │
└──────────┴──────────────┴───────────────────────────────────────────────────┤
`

### 14.1 Key Audit Features
- **Filterable Stream:** Users can filter logs by AI Events, Rule Checks, Promoter Inputs, or Intermediary Actions.
- **Cryptographic Hash Verification:** Every event includes a truncated SHA-256 hash string (e.g., hash: e3b0c442...), demonstrating immutable auditability for regulatory submissions.


---

## 15. Intermediary Digital Certification & e-Sign Modal

Before the **Bronze Seal Stamp (#A9762F)** animation locks any chapter, Interface B invokes a formal **Digital Certification & e-Sign Modal**:

`
┌─────────────────────────────────────────────────────────────────────────┐
│            INTERMEDIARY DIGITAL CERTIFICATION & e-SIGN                  │
├─────────────────────────────────────────────────────────────────────────┤
│ Chapter: 11. Risk Factors & Material Disclosures                        │
│ Issuer:  TechNova Solutions Limited (CIN: U74999MH2019PLC357145)        │
├─────────────────────────────────────────────────────────────────────────┤
│ SIGNATORY DETAILS:                                                      │
│ • Signatory Name: Vikramaditya Sharma                                   │
│ • Role / Authority: Lead Merchant Banker (SMC Capitals Ltd)             │
│ • SEBI Registration No: INM000012345 (Verified ✅)                       │
│                                                                         │
│ CERTIFICATION DECLARATION:                                              │
│ "I hereby certify that Chapter 11 has been audited against SEBI ICDR    │
│ Regulations 2018. All material risk factors have been disclosed with     │
│ quantified percentage impact where applicable."                         │
├─────────────────────────────────────────────────────────────────────────┤
│ AUTHENTICATION METHOD:                                                  │
│ [🔒 Class 3 Digital Signature (DSC) / Aadhaar eSign Simulated Token]   │
│                                                                         │
│                       [ APPLY e-SIGN & LOCK PHASE ]                     │
└─────────────────────────────────────────────────────────────────────────┘
`

1. **Trigger:** Clicking **"Certify & Lock Section"** opens this modal.
2. **SEBI Reg Verification:** Autocompletes the registered intermediary's credentials (e.g., INM000012345 for Merchant Banker, FRN 101234W for Auditor).
3. **Execution:** Upon clicking Apply e-Sign & Lock Phase, the system triggers the **Bronze Seal Stamp animation**, writes an encrypted signature record into the immutable audit trail, and marks the chapter read-only.

---

## 16. Realistic SEBI Observation Readiness Index (Simulated)

To provide an instant compliance readout without looking fake or overly inflated, Interface B features a realistic **SEBI Pre-Submission Readiness Index**:

`
┌─────────────────────────────────────────────────────────────────────────┐
│               SEBI OBSERVATION READINESS RATING: GRADE A-               │
│                    [ LOW REGULATORY QUERY RISK ]                        │
├─────────────────────────────────────────────────────────────────────────┤
│ • Hard Rules & Schema Compliance:  100% (0 Critical Blocking Errors)   │
│ • Cross-Chapter Data Reconciliation: 100% (0 Discrepancies Found)      │
│ • Risk Factor Specificity Rating:  86%  (1 Minor Warning Pending)      │
│ • Unquantified Claim Filter:       94%  (0 Unsupported Buzzwords)      │
└─────────────────────────────────────────────────────────────────────────┘
`

- **Calculation:** Derived strictly from active flag states in frontend state (no extra backend required):
  - 0 Critical Errors = Base Score 90+.
  - Open Amber Warning = Minor grade reduction (Grade A $\rightarrow$ Grade A-).
- **Realism Guarantee:** Avoids simplistic "100% Perfect" scores, demonstrating realistic regulatory nuances.

---

## 17. Single-Source-of-Truth Cross-Chapter Variable Reconciler

ProspectusIQ enforces a **Unified Document Data Graph**. Clicking any financial variable (e.g., ariable_revenue_FY25 = ₹ 450.50 Crore) opens the **Variable Reconciler Drawer**, displaying every location where that number is referenced:

`
┌─────────────────────────────────────────────────────────────────────────┐
│          VARIABLE RECONCILER: variable_revenue_FY25 (₹ 450.50 Cr)       │
├─────────────────────────────────────────────────────────────────────────┤
│ FOOTPRINT ACROSS DRHP CHAPTERS:                                         │
│ • Ch 3 (Capital Structure):      Basis for NAV & Earnings Per Share    │
│ • Ch 6 (Business Overview):      Financial Performance Highlights Table│
│ • Ch 7 (Restated Financials):    Revenue from Operations Line Item     │
│ • Ch 8 (MD&A):                   Year-on-Year Growth Analysis Narrative│
├─────────────────────────────────────────────────────────────────────────┤
│ RECONCILIATION STATUS: RECONCILED (0 Contradictions Across 4 Chapters)  │
└─────────────────────────────────────────────────────────────────────────┘
`

- **Preventing Inconsistency:** If a promoter updates revenue in Chapter 7, the Reconciler automatically highlights all 3 dependent chapters, ensuring no numeric contradictions exist pre-submission.

---

## 18. Legally Accurate SEBI ICDR 2018 Schedule VI Compliance Checklist

To give legal counsel and merchant bankers complete confidence, ProspectusIQ includes a **Legally Accurate SEBI ICDR 2018 Schedule VI Checklist**:

| SEBI ICDR Clause Reference | Mandatory Legal Requirement | Document Location | Audit Status |
|---|---|---|---|
| **Schedule VI, Part A, Clause 6(1)** | Risk Factors listed in strict order of materiality | Ch 11 (Section 11.1) | **VERIFIED ✅** |
| **Schedule VI, Part A, Clause 7(2)** | Line-item fund allocation & Objects of Issue | Ch 10 (Section 10.3) | **VERIFIED ✅** |
| **Schedule VI, Part A, Clause 8(4)** | Full Promoter Group & Family Tree Disclosures | Ch 4 (Section 4.2) | **VERIFIED ✅** |
| **Schedule VI, Part A, Clause 9(1)** | 3-Year Audited Restated Financial Statements | Ch 7 (Section 7.1) | **VERIFIED ✅** |
| **Schedule VI, Part A, Clause 10(3)** | Peer Group Valuation Comparison Multiples (P/E, NAV) | Ch 9 (Section 9.2) | **VERIFIED ✅** |
| **Schedule VI, Part A, Clause 11(5)** | Outstanding Material Litigations & Tax Defaults | Ch 12 (Section 12.1) | **VERIFIED ✅** |
| **Schedule VI, Part A, Clause 12(1)** | Government Approvals & Environmental Consents | Ch 13 (Section 13.2) | **VERIFIED ✅** |

- **Export Action:** Exportable as a standalone PDF: SEBI_ICDR_Schedule_VI_Compliance_Checklist.pdf.
