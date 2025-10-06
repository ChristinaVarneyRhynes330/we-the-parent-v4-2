# 📘 We The Parent™ – Master Specification (v5.0 - Final)

## 1. 🎯 Project Overview & Core Principles

### Mission
To build a zero-cost, AI-powered legal assistant for a pro se parent in a Florida juvenile dependency case. The application will empower the user to manage their case effectively, analyze evidence, and prepare for court proceedings.

### Core Principles
1.  **Data Centralization:** All case-related information—documents, events, contacts, and narrative points—must be stored and managed in a single, secure location.
2.  **Proactive Intelligence:** The system must not be passive. New information must automatically trigger analysis and intelligently update all relevant parts of the application. For example, a newly uploaded document must have its key dates automatically extracted and added to the Timeline.
3.  **Evidentiary Rigor:** The application must assist in identifying and preserving the evidentiary value of all data, particularly through metadata analysis (e.g., EXIF data).
4.  **User Empowerment:** The ultimate goal is to provide the user with the tools and insights needed to level the playing field and advocate effectively for themselves and their children.

---

## 2. 📜 AI Agent Constitution (Unbreakable Rules)

-   **Silent Comprehension:** At the start of each session, you will silently read and fully comprehend this entire document. Acknowledge when you are ready.
-   **Execute One Directive at a Time:** You must only perform the single, specific directive given in the prompt. Do not proceed, predict, or perform any other actions until commanded.
-   **Strict Adherence to Specifications:** All code must conform exactly to the technical specifications and architectural patterns laid out in this document. No creative deviation is permitted.
-   **Verification is Mandatory:** All code must be free of linting errors and pass its corresponding test before a directive can be considered complete.

---

## 3. 🏛️ Architectural Blueprint

1.  **Workflow:** The required workflow for every feature is a series of micro-tasks following the pattern: **`API -> Test -> Hook -> Test -> UI -> Test`**.
2.  **API Design:** All internal APIs must be RESTful and adhere to the resource-oriented structure (e.g., `app/api/documents/route.ts`, `app/api/events/[id]/route.ts`).
3.  **State Management:** Frontend state will be managed via React Query (`@tanstack/react-query`) for server state and React Context for global UI state.

---

## 4. ✅ Project Task Checklist & Specifications

*(To be executed in strict sequential order using the Action-Oriented Playbook)*

### **Phase 1: Foundation Repair (Highest Priority)**

* [ ] **Task 1.1: Fix Pre-Commit Hooks**
    * **Agent Directives:**
        1.  **Verify:** Read `package.json` and confirm `lint-staged` is configured to run `eslint --fix` on staged files.
        2.  **Execute:** Run `npx eslint . --fix` on the entire project to identify and fix remaining critical errors. Report the results.
        3.  **Confirm:** Instruct the user on the git commands (`git add .` and `git commit -m "test: pre-commit hook"`) to verify the hook runs successfully.

* [ ] **Task 1.2: Database Migrations**
    * **Agent Directives:**
        1.  **Analyze:** Read all `.sql` files in the project directory.
        2.  **Generate:** Create a single, consolidated SQL migration script that idempotently (using `IF NOT EXISTS`) creates all tables, functions, and triggers.
        3.  **Instruct:** Provide the `supabase` CLI command required to apply this migration to the local database.

* [ ] **Task 1.3: Pass All E2E Tests**
    * **Agent Directives:**
        1.  **Execute:** Run the full Playwright test suite with `npm run test`.
        2.  **Analyze & Fix:** For each failing test, identify the root cause in the application code (not the test code) and provide the complete, corrected code for the necessary files to make the test pass. Repeat until all tests are green.

### **Phase 2: Architectural Enhancements**

* [ ] **Task 2.1: Enhance Document Intelligence Pipeline**
    * **Agent Directives:**
        1.  **API:** Modify the `app/api/upload/route.ts` file. Enhance the `POST` handler to extract technical metadata (file size, mime type, page count for PDFs) and EXIF data for images. The data returned from the endpoint for each document must now include a `metadata` object (e.g., `{ fileSize: 12345, pageCount: 5, exif: { DateTimeOriginal: '...' } }`).
        2.  **API Test:** Create a new Jest integration test file for the upload route. The test will mock a file upload and assert that the API response contains the expected `metadata` object with the correct structure.
        3.  **Hook:** Modify the `hooks/useDocuments.ts` file. Update the hook's internal state and fetch functions to manage the new `metadata` object for each document.
        4.  **Hook Test:** Modify the Jest unit test for the `useDocuments` hook. Mock the API response to include the new `metadata` object and assert that the hook's state correctly reflects this data.
        5.  **UI:** Modify the `components/DocumentsList.tsx` component. For each document card, render a new section that displays key-value pairs from the `metadata` object (e.g., "File Size: 12 KB", "Pages: 5").
        6.  **UI Test:** Modify the `tests/documents.spec.ts` Playwright test. After uploading a document, the test must find and assert that the text containing the new metadata (e.g., "File Size:") is visible on the page.

---
*(This detailed, directive-based pattern continues for all subsequent tasks.)*