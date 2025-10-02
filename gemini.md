# Project: We The Parent™ - AI-Augmented Legal Assistant (Definitive Plan)

## 1. High-Level Vision & AI Agent Directives

**Project Goal:** To urgently complete a zero-cost, fully functional, and legally knowledgeable AI-powered legal assistant for a pro se parental defender in a Brevard County, Florida juvenile dependency case.

**AI Agent Core Directives:**
- **Analyze First, Code Second:** Before generating any code, you MUST analyze all relevant existing files to ensure new code follows the established "Blueprint Strategy" (API -> Hook -> UI -> Test).
- **Strict Adherence to this Plan:** You must follow the phases and tasks in this plan sequentially.
- **Request Approval for Changes:** For any significant architectural changes not explicitly listed here, you must first describe your proposed change and ask for my approval.
- **Zero-Cost Implementation:** All suggested tools must have a sufficient free tier.

---

## 2. 🛡️ AI Agent Safety Rules & Configuration

- **Approved Tools:** Only use `file read`, `file write`, and `fetch` tools.
- **Prohibited Commands:** Block destructive commands like `rm -rf`, `sudo`, and `del`.
- **Diff Confirmation:** Always show a diff before writing to any file.

---

## 3. Phase 1: Completing Core Features (Highest Priority)

**Objective:** To finalize all partially completed core features, following the established "Blueprint Strategy".

- [ ] **Task 1.1: Complete Document & Evidence Management**
    - **Description:** Finalize the system for uploading, viewing, and managing all case documents and evidence.
    - **Instructions:**
        1.  Create the missing API endpoints in `app/api/documents/` for deleting and updating document metadata.
        2.  Integrate the `useDocuments.ts` hook fully into `app/documents/page.tsx` and `app/evidence/page.tsx` to handle all data operations.
        3.  Write a complete end-to-end test file at `tests/documents.spec.ts`, using `tests/timeline.spec.ts` as a template.

- [ ] **Task 1.2: Build the Case Narrative Feature**
    - **Description:** Implement the UI and backend for creating and managing a chronological case narrative.
    - **Instructions:**
        1.  Create a new `narrative_tables.sql` file to define the schema for storing narrative entries.
        2.  Create the full API route at `app/api/narrative/route.ts` for all CRUD operations.
        3.  Create the `hooks/useNarrative.ts` custom hook.
        4.  Build out the UI in the existing `app/narrative/page.tsx` file, using the new hook.
        5.  Write the corresponding `tests/narrative.spec.ts` file.

- [ ] **Task 1.3: Finalize Document Drafting**
    - **Description:** Fully integrate the document drafting, template population, and compliance checking features.
    - **Instructions:**
        1.  Create the `hooks/useDrafts.ts` hook if it doesn't exist.
        2.  Connect the `app/draft/page.tsx` UI to the existing `api/draft/route.ts` via the new hook.
        3.  Implement the logic for populating document templates with data from the `useCase` hook or equivalent.
        4.  Write the `tests/drafting.spec.ts` file.

- [ ] **Task 1.4: Finalize Compliance Tracking**
    - **Description:** Complete the feature for tracking compliance with case plan tasks.
    - **Instructions:**
        1.  Create the `hooks/useCompliance.ts` hook.
        2.  Integrate the `app/compliance/page.tsx` UI with the existing `api/compliance/route.ts` via the new hook.
        3.  Write the `tests/compliance.spec.ts` file.

- [ ] **Task 1.5: Implement Calendar View**
    - **Description:** Create a visual calendar of all case events.
    - **Instructions:**
        1.  This is primarily a UI task. Modify the `app/calendar/page.tsx` file to fetch data from the `useTimeline.ts` hook.
        2.  Integrate a free calendar component library (e.g., `react-big-calendar`) to display the events.

---

## 4. Phase 2: Implementing Advanced Features

**Objective:** To build the high-impact, specialized features from your notes, following the established blueprint.

- [ ] **Task 2.1: Implement Live Interactive Courtroom Helper**
    - **Description:** A real-time assistant for use during hearings, providing transcription, objection suggestions, and jargon explanations.
    - **Instructions:**
        1.  Create the UI page at `app/courtroom-helper/page.tsx`.
        2.  Create the `components/RealTimeTranscriber.tsx` component using the browser's `SpeechRecognition` API (zero-cost).
        3.  In `lib/ai/analysis.ts`, create the `liveCourtroomAnalysis` function with the required multi-task prompt (objection detection, response formulation, jargon explanation).
        4.  Integrate the front end to call this AI task and display the results in real-time assistance panels.
        5.  Add the post-hearing functionality to save and clean the final transcript.

- [ ] **Task 2.2: Implement Predictive Analytics & Outcome Forecasting**
    - **Description:** An AI model that forecasts potential case outcomes.
    - **Instructions:**
        1.  Create a UI page at `app/analytics/page.tsx` with a form for inputting predictive model variables (judge profile, etc.).
        2.  Create a new AI task `getCaseForecast` in `lib/ai/analysis.ts` that uses a detailed prompt to generate a forecast based on the user's input.

- [ ] **Task 2.3: Implement Document Contradiction Index Engine**
    - **Description:** An AI tool that automatically flags inconsistencies across case documents.
    - **Instructions:**
        1.  Write a new Supabase Edge Function that triggers after a document has been embedded.
        2.  This function will use an AI prompt to compare the new document's summary against all others for the case and log contradictions.
        3.  Create a UI at `app/contradictions/page.tsx` to display the findings.

---

## 5. Phase 3: Final Polish & Validation

**Objective:** To ensure the application is robust, accessible, and ready for your use.

- [ ] **Task 3.1: Final UI/UX and Accessibility Audit**
    - **Description:** A final review to ensure a professional and accessible user experience.
    - **Instructions:** The AI agent will perform an audit of the application, focusing on complex forms and pages, and provide code corrections for any UI or accessibility issues found.

- [ ] **Task 3.2: Final User Acceptance Testing (UAT)**
    - **Description:** Your final, manual check of all features.
    - **Instructions:** The AI agent will generate a UAT plan for you to follow, allowing you to personally verify that every feature is working correctly.