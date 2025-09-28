# Project: We The Parent™ - AI-Augmented Legal Assistant (Definitive Plan)

## 1. High-Level Vision & AI Agent Directives

**Project Goal:** To urgently create a zero-cost, fully functional, and legally knowledgeable AI-powered legal assistant for a pro se parental defender in a Brevard County, Florida juvenile dependency case. The application must be ready for immediate, real-world use.

**AI Agent Core Directives:**
- **Analyze First, Code Second:** Before generating any code, you MUST analyze all relevant existing files in the repository to ensure consistency.
- **Strict Adherence to this Plan:** You must follow the phases and tasks in this plan sequentially.
- **Request Approval for Changes:** For any significant architectural changes not explicitly listed here, you must first describe your proposed change and ask for my approval before writing the code.
- **Zero-Cost Implementation:** All suggested libraries, tools, and services must have a free tier that is sufficient for this project's needs. The primary stack is Next.js, Supabase, and free AI model APIs.

---

## 2. 🛡️ AI Agent Safety Rules & Configuration

- **Approved Tools:** Only use `file read`, `file write`, and `fetch` tools.
- **Prohibited Commands:** Block destructive commands like `ShellTool(rm -rf)`, `ShellTool(sudo)`, and `ShellTool(del)`.
- **Diff Confirmation:** Always show a diff before writing to any file.
- **Multi-File Changes:** Stop and confirm if a change affects more than 5 files.
- **Slash Commands:**
    - `/tools` → Lists all available tools that the AI agent can utilize.
    - `/mcp` → Lists configured MCP servers.

---

## 3. Phase 1: Critical Architectural Refactoring & Foundation (Highest Priority)

**Objective:** To fix core architectural issues immediately. This will make all future development faster, more stable, and easier to test.

- [ ] **Task 1.1: Consolidate AI API Routes**
    - **Description:** Refactor the numerous specific AI API routes in `/app/api` into a single, scalable endpoint.
    - **Instructions:** Create a single API route at `app/api/ai/route.ts` that accepts a `task` name in its body. Create a service file at `lib/ai/analysis.ts` to hold the logic for each task. The API route will act as a controller, calling the correct function from the service file based on the `task`.

- [ ] **Task 1.2: Abstract Data Logic into Custom Hooks**
    - **Description:** Separate data-fetching logic from UI components.
    - **Instructions:** Create a `hooks` folder. For each primary data type (documents, events, drafts), create a corresponding custom hook (e.g., `useDocuments.ts`, `useTimeline.ts`). These hooks will manage all data fetching, state, and mutations. Refactor the page components to use these hooks.

- [ ] **Task 1.3: Integrate End-to-End Testing Framework**
    - **Description:** Establish a testing foundation to ensure reliability.
    - **Instructions:** Install and initialize the Playwright testing framework. Create an initial test file, `tests/timeline.spec.ts`, to cover the critical user flow of creating and deleting a timeline event.

- [ ] **Task 1.4: Build and Populate the Legal Knowledge Base**
    - **Description:** Infuse the AI with expert legal knowledge.
    - **Instructions:** Create a `legal_knowledge` table in Supabase with a vector column. Create a script at `scripts/populateKnowledgeBase.ts` that reads text files from a `knowledge_base` folder, chunks them, generates embeddings, and saves them to the new table. Populate this with the provided Bluebook-cited authorities and Florida Statutes.

---

## 4. Phase 2: Core Feature Implementation (MVP for Immediate Use)

**Objective:** To build the essential, user-facing features on top of the new, stable architecture.

- [ ] **Task 2.1: Finalize Document & Evidence Management**
    - **Description:** Complete the evidence ingestion and management system.
    - **Instructions:** Ensure the `useDocuments` hook is fully implemented. Enhance the UI with `react-dropzone` for drag-and-drop uploads. Implement the mobile scan-to-PDF functionality.

- [ ] **Task 2.2: Implement the AI Chat Vault**
    - **Description:** Create a centralized, context-aware chat interface.
    - **Instructions:** Create the `chat_threads` and `chat_messages` tables. In the `lib/ai/analysis.ts` service file, create the `getChatResponse` function. This function MUST use Retrieval-Augmented Generation (RAG) to search both the `legal_knowledge` and the user's `document_chunks` tables for context before answering. Build the `app/chat/page.tsx` UI.

- [ ] **Task 2.3: Build the Drafting & Export Feature**
    - **Description:** Create tools for drafting, validating, and exporting legal documents.
    - **Instructions:** Create the `drafts` and `compliance_reports` tables. Create a `useDrafts` hook. Build the `app/draft/[caseId]/page.tsx` UI. In `lib/ai/analysis.ts`, create a `generateDraftFromTemplate` function. Implement the 'Smart Filing Index & Auto-Service Certificate' feature using `jspdf` for export. Create a simple `lib/compliance/rules-fl.ts` engine for basic validation.

- [ ] **Task 2.4: Implement the Predicate Foundation**
    - **Description:** Build the tool for creating legal assertions and linking evidence.
    - **Instructions:** Create the `predicates` and `predicate_evidence_links` tables. Create a `usePredicates` hook. Build the UI at `app/predicate/[caseId]/page.tsx` to allow users to create predicates and link evidence via a drag-and-drop interface.

---

## 5. Phase 3: Advanced Legal Intelligence & Automation

**Objective:** To layer in the highly specialized AI features from your notes.

- [ ] **Task 3.1: Implement Constitutional Law Auto-Suggestion**
    - **Description:** Create an AI that suggests relevant legal citations during drafting.
    - **Instructions:** Create an AI task `suggestCitation` in `lib/ai/analysis.ts` that performs a semantic search against the `legal_knowledge` table based on the user's draft text.

- [ ] **Task 3.2: Implement Document Contradiction Engine**
    - **Description:** Build an AI tool to automatically flag inconsistencies across case documents.
    - **Instructions:** Create a Supabase Edge Function that triggers on new document analysis. This function should use an AI prompt to compare the new document's summary against all others for the case and log any found contradictions. Build a UI to display these findings.

- [ ] **Task 3.3: Implement GAL Conflict of Interest Checker**
    - **Description:** An AI tool to check for potential conflicts of interest.
    - **Instructions:** Create an AI task `checkGALConflict`. It should take the GAL's name and known affiliations and search the case documents and events for any potentially compromising connections or statements.

---

## 6. Phase 4: Final Polish, Validation, & Deployment

**Objective:** To finalize the application and ensure it's bug-free, accessible, and ready for use.

- [ ] **Task 4.1: Implement PWA and Finalize Mobile UI**
    - **Description:** Ensure the application is installable and works well on mobile.
    - **Instructions:** Generate the `manifest.json` file. Set up a Workbox service worker to cache critical assets and API calls for offline use. Perform a final review of the UI on a mobile device.

- [ ] **Task 4.2: Accessibility & Performance Audit**
    - **Description:** Ensure the app is accessible to all users and performs well.
    - **Instructions:** Conduct an accessibility audit on the most complex forms and pages. Identify and fix performance bottlenecks in data fetching and rendering.

- [ ] **Task 4.3: Final User Acceptance Testing (UAT)**
    - **Description:** A final, manual check of all features to ensure they meet the requirements for your case.
    - **Instructions:** The AI agent will generate a UAT plan for you to follow. You will manually perform these tests to give the final sign-off.

---

## 7. 🎯 Example Prompts for General Use

- **Understanding & Navigation:** “Trace the data flow from a user uploading a document in the UI to that document's content being available for a RAG search.”
- **Refactoring & Optimization:** “Refactor the `EventForm.tsx` component to run its date validation logic in a separate utility function.”
- **Debugging:** “I'm getting a 500 error when calling the `/api/ai` route with the 'generateDraft' task. Analyze the route and the `lib/ai/analysis.ts` file to find and fix the bug.”