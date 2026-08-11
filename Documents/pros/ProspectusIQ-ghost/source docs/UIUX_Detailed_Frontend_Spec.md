# File: UIUX_Detailed_Frontend_Spec.md

# Frontend Design Spec — Detailed Layout & Style Guide

### 0. Design Direction & Rationale
**Theme:** A cross between a well-run law office and a modern fintech dashboard: precise, calm, authoritative. Avoid generic "AI startup" visual cliches. It must evoke a digital ledger or certified-document aesthetic.

**Signature Element:** A **"Certification Seal"** motif — a circular stamp/lock icon that visually appears when a section is locked by an intermediary. This anchors the core trust mechanic of the product.

---

### 1. Design Tokens

#### 1.1 Color Palette
| Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Ink Navy** | `#101B33` | Primary text, headers, nav bar. |
| **Paper White** | `#F7F7F5` | Main background (cool crispness, not warm cream). |
| **Ledger Blue** | `#1F3A63` | Primary brand/action color (buttons, links, active states). |
| **Seal Bronze** | `#A9762F` | Signature accent (certification moments, locked badges). |
| **Cleared Green** | `#2E7D5B` | Status: Compliant / Cleared. |
| **Flag Amber** | `#C98A1D` | Status: Needs Review. |
| **Blocked Red** | `#B3402C` | Status: Blocked / Non-Compliant. |
| **Neutral Grey** | `#6B7280` | Secondary text, borders, disabled states. |

#### 1.2 Typography
* **Display Face (Headers):** Authoritative Serif (e.g., *Source Serif 4*, *Newsreader*). Used sparingly for titles and the certification moment.
* **Body/UI Face:** Clean Sans-Serif (e.g., *IBM Plex Sans*, *Inter*).
* **Data/Figures Face:** Monospace/Tabular (e.g., *IBM Plex Mono*). Ensures precise alignment in financial tables.

**Type Scale:**
* H1/Display: 32–40px, Serif, Semi-bold
* H2: 24px, Serif, Medium
* H3: 18px, Sans, Semi-bold
* Body: 15–16px, Sans, Regular
* Caption/Meta: 13px, Sans, Regular, Neutral Grey
* Data/Figures: 14–16px, Mono, Tabular-nums

#### 1.3 Spacing & Shape
* **Spacing Unit:** 8px base (8/16/24/32/48 scale).
* **Border Radius:** 4–6px (sharp, official feel).
* **Borders:** Hairline (1px, Neutral Grey at low opacity) separating document sections.

#### 1.4 Motion
* **Minimalist Approach:** Progress bars fill smoothly, flag markers pulse once.
* **Certification Seal Animation:** Deliberate "stamp" animation (scale + slight rotation, ~300ms) upon lock. No decorative hover animations elsewhere.

---

### 2. Interface A — Company / Promoter Portal
*See also: `Platform_Architecture_Pipeline.md > Section 2`*

#### 2.1 Global Layout
```text
┌─────────────────────────────────────────────────────────┐
│ TOP BAR: Logo | Filing name | Completion % | Profile    │
├───────────────┬─────────────────────────────────────────┤
│ LEFT NAV      │  MAIN CONTENT AREA                      │
│ (chapters +   │  (active section state)                 │
│  status dots) │                                         │
│               │                                         │
│ - Business ●  │                                         │
│ - Risk     ●  │                                         │
├───────────────┴─────────────────────────────────────────┤
│ BOTTOM BAR: progress bar | predicted time | Submit CTA  │
└─────────────────────────────────────────────────────────┘
```

#### 2.2 Left Navigation & Progress
* **Chapter List:** Status dots (Red/Amber/Green) and % completion badges per chapter.
* **Bottom Bar:** Segmented progress bar by chapter, predicted time to completion, and a disabled-by-default "Send to Intermediary" CTA (enabled when Stage 1 clears).

#### 2.3 Main Content Area States
* **Guided Input State:** Plain-language forms (e.g., "How much revenue did you earn last year?").
* **Upload/Scan State:** Drag-and-drop zone with OCR preview/confirmation workflows.
* **AI Draft Preview State:** Read-only drafting interface featuring:
  * Inline flags (amber underline = review, red underline = blocked).
  * Side panels with plain-language recommendations.
  * Subtle confidence indicators.
* **Cleared State:** Section locked with a green seal icon ("Ready for intermediary review").

#### 2.4 Additional Modules
* **Financial Visualization Panel:** Simple charts highlighting anomalies, kept adjacent to the Financials chapter.
* **Organize/Cleanup Assist:** A prominent feature allowing promoters to dump unstructured notes for AI classification.

---

### 3. Interface B — Intermediary Workbench
*See also: `Platform_Architecture_Pipeline.md > Section 3`*

#### 3.1 Global Layout
```text
┌─────────────────────────────────────────────────────────┐
│ TOP BAR: Logo | Role (Legal/Auditor) | Profile          │
├───────────────┬─────────────────────────────────────────┤
│ COMPANY LIST  │  ACTIVE FILING VIEW                     │
│ (Dashboard)   │  Tabs: Draft | Flags | Comparisons |    │
│               │        Due Diligence | Audit Trail      │
│ Company A ●85%│                                         │
├───────────────┴─────────────────────────────────────────┤
│ FOOTER: Accuracy Rate | Correction Rate | Certify & Lock│
└─────────────────────────────────────────────────────────┘
```

#### 3.2 Key Views & Workflows
* **Multi-Company Dashboard:** Left panel summarizing assigned filings with completion % and status dots.
* **Filing Tabs:**
  * **Draft:** Inline compliance flags, redline/track-changes, threaded comments.
  * **Flags:** Consolidated list of open issues sortable by severity/type.
  * **Comparisons:** Editable peer group valuation tables.
  * **Due Diligence:** API-pulled MCA21 data, E-Courts litigation, network graphs.
  * **Audit Trail:** Immutable, timestamped event log.
* **Action Types:** Send Change Request (blocks), Request Clarification (non-blocking), Resolve/Accept, Escalate (critical red banner).

#### 3.3 Certification Metrics & Locking
* **Accuracy/Correction Rates:** Footer displays AI performance metrics over time, building system credibility.
* **Certify & Lock:** Initiates the Seal Bronze stamp animation. Hides once multi-signatory checklists are fulfilled.

---

### 4. Shared Components & Accessibility
* **Consistent Components:** Status Dots, Flag Cards, Confidence Indicators, Certification Seals, and Progress Bars maintain unified semantics across Interface A and B.
* **Responsive Design:** Interface A must be mobile-friendly (collapsible left nav). Interface B scales down to tablet at minimum.
* **Accessibility:** Strict keyboard focus states and full support for reduced-motion OS settings (disables stamp animations and progress-bar easing).
