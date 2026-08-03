# Frontend Section — UI & Flow Specification
### Sebii SME IPO Platform · Interface Contracts & User Journey

---

## 1. Design Flexibility

For the hackathon, **the frontend team has full creative liberty over the UI/UX design, visual aesthetics, layout, and component structures.** 

You do not need to follow a strict CSS token system or predefined pixel-perfect layouts. Focus on speed, clarity, and demonstrating the core value proposition. 

The specification below outlines the **mandatory User Journeys and Page Flows** that must exist for the prototype to function properly across the Company Portal and Intermediary Workbench.

---

## 2. Interface A — Company / Promoter Portal (Mandatory Flows)

### 2.1 Dashboard Flow
- **Goal:** View active filings or create a new one.
- **Requirement:** Display a list of filings with their overall completion percentage. Clicking a filing navigates to the Filing Overview.

### 2.2 Filing Overview Flow
- **Goal:** Navigate between different chapters (e.g., Business Overview, Risk Factors).
- **Requirement:** Show a clear status for each section (Not Started, In Progress, AI Drafting, Cleared, Blocked).
- **Action:** A "Submit to Intermediary" button must exist, but it should be disabled until all sections are marked as `CLEARED`.

### 2.3 Guided Input Flow (The Core Interaction)
- **Goal:** The promoter inputs raw data, which triggers the AI pipeline.
- **Requirement:** A form representing the required variables for a section.
- **Action:** When the user clicks "Save & Continue", the frontend calls `PUT /filings/:id/sections/:key/inputs`.
- **UX State:** The UI *must* enter a locked "Loading/Checking" state while the backend runs Stage 1 validation. Once the WebSocket returns a success event, the UI unlocks or navigates to the AI Draft Preview.

### 2.4 AI Draft Preview Flow
- **Goal:** The promoter reviews what the AI wrote, but cannot edit it directly.
- **Requirement:** Display the generated text. 
- **Requirement:** Visually highlight any flags (e.g., a missing number, a non-compliant claim) returned by the AI Verifier. 
- **Action:** Allow the promoter to add a "Comment" or "Clarification Request" if they disagree with the AI, but they cannot freely type in the draft box.

---

## 3. Interface B — Intermediary Workbench (Mandatory Flows)

### 3.1 Multi-Filing Dashboard Flow
- **Goal:** Intermediaries (Bankers, Lawyers) select a company's filing to review.
- **Requirement:** List of filings assigned to the intermediary.

### 3.2 Draft Review & Redlining Flow (The Core Interaction)
- **Goal:** Review the AI draft, resolve system flags, and make final edits.
- **Requirement:** Display the AI draft alongside any system-generated flags (e.g., "AI Verifier: Confidence 60% - Missing materiality clause").
- **Action:** Intermediary must be able to click on a flag and mark it as `RESOLVED`.
- **Action:** Intermediary must be able to edit the text (redlining). When they save, it calls `PATCH /filings/:id/sections/:key/human-edit`.

### 3.3 Due Diligence Flow
- **Goal:** Visualize external API checks.
- **Requirement:** A simple view showing the status of Directors/Companies against MCA21 or GSTIN. For the hackathon, these can simply render the mock "Clear" or "Flagged" data returned by the backend.

### 3.4 Certification Flow
- **Goal:** Cryptographically lock the filing.
- **Requirement:** A button to "Certify". 
- **Action:** Submitting calls `POST /filings/:id/certifications`. The UI should show a success state (like a "Certified Lock" icon) once completed.

---

## 4. Shared Interaction Patterns (Required)

### 4.1 Flag Handling
Flags are the core communication mechanism between the Rules Engine, the AI Verifier, and the Humans. The UI must clearly differentiate between:
- **Critical Flags:** Must be resolved before submission/certification.
- **Review Flags:** Warnings that require a human to look at them.

### 4.2 Real-time UI Updates
Instead of forcing the user to hit "Refresh" while waiting for the AI to draft a section, the frontend must listen to the WebSocket and automatically fetch the latest text when the backend says the draft is ready.
