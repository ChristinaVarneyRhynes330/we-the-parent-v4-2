# 📘 We The Parent™ – Master GEMINI.md (v2.0 - Iterative)

## 1. 🎯 Mission
Build a zero-cost, AI-powered legal assistant for a pro se parent in a Florida juvenile dependency case.
**Top priority:** Repair the foundational issues, get all existing tests to pass, then complete the remaining features in the strict, sequential order outlined in the Project Task Checklist.

## 2. 📜 AI Agent Constitution (Unbreakable Rules)
- **Analyze First, Code Second:** Always cite the files you are reviewing before generating any code.
- **Strict Adherence to Blueprint:** Every feature must follow the `API -> Hook -> UI -> Test` pipeline.
- **Sequential Execution:** You must complete the tasks in the checklist (Section 6) in their exact numerical order.
- **Approval Required:** Propose any major architectural changes not listed here and wait for my approval before implementing.
- **Safety & Verification:** Always show a diff before writing to a file. Ensure all code passes TypeScript checks and that its corresponding test is green before considering a task complete.

## 3. 🏛️ Architectural Blueprint
1.  **Pipeline Rule:** `API -> Hook -> UI -> Test`. This is the required pattern for all feature development.
2.  **Iterative Loop:** The workflow for every task is **`Develop -> Verify -> Debug`**. A task is only complete when its test passes.
3.  **Proactive Intelligence:** New information (document uploads, user chat input) must automatically trigger AI analysis to update the Timeline, Narrative, and other relevant features.

## 4. ✅ Project Task Checklist
*(To be executed in strict sequential order)*

### **Phase 1: Foundation Repair (Highest Priority)**
* [ ] **Task 1.1: Database Migrations**
    * **Description:** Create and apply a single SQL migration to ensure all required tables exist in the Supabase database.
* [ ] **Task 1.2: Environment Configuration**
    * **Description:** Generate a `.env.local.example` file for the user to configure.
* [ ] **Task 1.3: Remove Hardcoded `CASE_ID`**
    * **Description:** Refactor all files to remove the hardcoded `CASE_ID` constant and replace it with the dynamic `useCase()` context.
* [ ] **Task 1.4: Fix API and Pass All Tests**
    * **Description:** Repair the `/api/events` route, which is the root cause of all 6 failing Playwright tests, and ensure all existing tests pass.

### **Phase 2: In-Progress Feature Completion**
* [ ] **Task 2.1: Finalize Narrative Builder**
    * **Description:** Complete the `useNarrative.ts` hook and fully integrate it into the `app/narrative/page.tsx` UI.
* [ ] **Task 2.2: Finalize Document Drafting**
    * **Description:** Complete the `useDrafts.ts` hook and wire it into the `app/draft/page.tsx` UI.
* [ ] **Task 2.3: Finalize Compliance Tracking**
    * **Description:** Implement the `useCompliance.ts` hook and integrate it with the backend.

### **Phase 3: Strategic Feature Implementation**
* [ ] **Task 3.1: Implement Proactive Intelligence Layer**
    * **Description:** Create the Supabase Edge Function and AI task that automatically analyzes new documents and populates the Timeline.
* [ ] **Task 3.2: Enhance Calendar View**
    * **Description:** Upgrade the calendar with `react-big-calendar` and color-coded events.
* [ ] **Task 3.3: Build the Pre-Hearing "Prep Room"**
    * **Description:** Create the `app/prep-room/[hearingId]/page.tsx` UI for mock hearings and objection practice.

### **Phase 4: Courtroom Readiness & Launch**
* [ ] **Task 4.1: Implement Live Courtroom Helper (De-risked Milestones)**
    * **Description:** Build the real-time hearing assistant in three distinct, verifiable stages.
    * [ ] **Milestone 4.1.1 (Audio Upload & Transcription):** Build a non-real-time feature. Create a page where a user can upload a pre-recorded audio file and have it transcribed by an AI task (`transcribeAudioFile`). This validates the core transcription pipeline first.
    * [ ] **Milestone 4.1.2 (Live Client-Side Transcription):** Build the real-time UI. Create the `app/courtroom-helper/page.tsx` and `components/RealTimeTranscriber.tsx`. Implement live audio capture and display the text on screen using the browser's `SpeechRecognition` API. At this stage, there is NO AI analysis. This validates the audio stream.
    * [ ] **Milestone 4.1.3 (Real-Time AI Analysis Integration):** Connect the live transcript to the AI. Implement the `liveCourtroomAnalysis` function with the multi-task prompt. Modify the transcriber to send text chunks on a debounce to the AI and display the structured JSON results in the UI panels.
* [ ] **Task 4.2: Final Testing & UAT**
    * **Description:** Conduct a final accessibility and performance audit, and then generate the User Acceptance Testing (UAT) plan.

## 5. 📝 Prompt Quick Reference
* **Foundation Fixes:**
    * `@workspace Analyze all .sql files. Generate a single SQL migration that creates all required tables if they do not exist. Show the full SQL.`
    * `@workspace List all required environment variables for this project and generate a .env.local.example file with comments.`
    * `@workspace The Playwright tests are failing. Diagnose the root cause of the failure in /api/events and fix the route. Rerun the tests until all 6 pass.`