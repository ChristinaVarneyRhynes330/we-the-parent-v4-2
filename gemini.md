# 📘 We The Parent™ – Master GEMINI.md (v2.0 - Iterative)

## 1. 🎯 Mission
Build a zero-cost, AI-powered legal assistant for a pro se parent in a Florida juvenile dependency case.
**Top priority:** Repair the foundational issues, get all existing tests to pass, then complete the remaining features in the strict, sequential order outlined in the Project Task Checklist.

## 2. 📜 AI Agent Constitution (Unbreakable Rules)
- **Analyze First, Code Second:** Always cite the files you are reviewing before generating any code.
- **Strict Adherence to Blueprint:** Every feature must follow the `API -> Hook -> UI -> Test` pipeline.
- **Sequential Execution:** You must complete the tasks in the checklist (Section 7) in their exact numerical order.
- **Approval Required:** Propose any major architectural changes not listed here and wait for my approval before implementing.
- **Safety & Verification:** Always show a diff before writing to a file. Ensure all code passes TypeScript checks and that its corresponding test is green before considering a task complete.

## 3. workflow Director's Playbook: Prompting Workflow
There are two methods for prompting the agent. You must use the correct one for the task at hand.

- **1. The Iterative Playbook (Primary Method):** For all feature development and bug fixing (any task in the checklist), you **must** use the three-step `Develop -> Verify -> Debug` loop detailed in the separate **Prompt Playbook** document. This is the required workflow to ensure quality and correctness.
- **2. The Prompt Quick Reference (Secondary Method):** The quick reference prompts in Section 9 are for simple, one-off queries or emergency fixes only. They are not a substitute for the full iterative workflow.

## 4. 🏛️ Architectural Blueprint
1.  **Pipeline Rule:** `API -> Hook -> UI -> Test`. This is the required pattern for all feature development.
2.  **Iterative Loop:** The workflow for every task is **`Develop -> Verify -> Debug`**. A task is only complete when its test passes.
3.  **Proactive Intelligence:** New information (document uploads, user chat input) must automatically trigger AI analysis to update the Timeline, Narrative, and other relevant features.

## 5. 🔐 Environment Variables
* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `OPENAI_API_KEY`
* `GROQ_API_KEY`
* `GOOGLE_API_KEY`
* `PLAYWRIGHT_TEST_BASE_URL` (optional)

## 6. 🏗️ Tech Stack
* **Framework:** Next.js (App Router) with React & TypeScript
* **Styling:** Tailwind CSS
* **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions, pgvector)
* **Testing:** Playwright for E2E testing.

## 7. ✅ Project Task Checklist
*(To be executed in strict sequential order using the Iterative Playbook)*

### **Phase 1: Foundation Repair (Highest Priority)**
* [ ] **Task 1.1: Database Migrations**
* [ ] **Task 1.2: Environment Configuration**
* [ ] **Task 1.3: Remove Hardcoded `CASE_ID`**
* [ ] **Task 1.4: Fix API and Pass All Tests**

### **Phase 2: In-Progress Feature Completion**
* [ ] **Task 2.1: Finalize Narrative Builder**
* [ ] **Task 2.2: Finalize Document Drafting**
* [ ] **Task 2.3: Finalize Compliance Tracking**

### **Phase 3: Strategic Feature Implementation**
* [ ] **Task 3.1: Implement Proactive Intelligence Layer**
* [ ] **Task 3.2: Enhance Calendar View**
* [ ] **Task 3.3: Build the Pre-Hearing "Prep Room"**

### **Phase 4: Courtroom Readiness & Launch**
* [ ] **Task 4.1: Implement Live Courtroom Helper (De-risked Milestones)**
    * [ ] **Milestone 4.1.1 (Audio Upload & Transcription):** Build a non-real-time feature to transcribe pre-recorded audio files.
    * [ ] **Milestone 4.1.2 (Live Client-Side Transcription):** Build the real-time UI to capture and display a live transcript without AI analysis.
    * [ ] **Milestone 4.1.3 (Real-Time AI Analysis Integration):** Connect the live transcript to the AI for in-the-moment suggestions.
* [ ] **Task 4.2: Final Testing & UAT**

## 8. 📝 Prompt Quick Reference (For Simple Queries Only)
* `@workspace Analyze all .sql files. Generate a single SQL migration that creates all required tables if they do not exist.`
* `@workspace List all required environment variables and generate a .env.local.example file.`
* `@workspace The Playwright tests are failing. Diagnose the root cause in /api/events and fix the route.`