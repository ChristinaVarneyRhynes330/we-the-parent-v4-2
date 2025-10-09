# 📘 We The Parent™ – Master Specification (v5.1 - Corrected)

## 1. 🎯 Project Overview & Core Principles
(No changes from the previous version)

---

## 2. 📜 AI Agent Constitution (Unbreakable Rules)
(No changes from the previous version)

---

## 3. 🏛️ Architectural Blueprint

1.  **Workflow:** The required workflow for every feature is a series of micro-tasks following the pattern: **`API -> Jest Test -> Hook -> Jest Test -> UI -> Playwright Test`**.
2.  **API Design:** All internal APIs must be RESTful and adhere to the resource-oriented structure.
3.  **State Management:** Frontend state will be managed via React Query (`@tanstack/react-query`) for server state and React Context for global UI state.

---

## 4. ✅ Project Task Checklist & Specifications

*(To be executed in strict sequential order)*

### **Phase 1: Foundation Repair (Highest Priority)**

* [ ] **Task 1.1: Fix Pre-Commit Hooks** (Completed)
* [ ] **Task 1.2: Database Migrations** (Completed)

* [ ] **Task 1.3: Pass All Unit & Integration Tests (Jest)**
    * **Agent Directives:**
        1.  **Execute:** Run the Jest test suite with `npm run test`.
        2.  **Analyze & Fix:** For each failing test, identify the root cause in the application code and provide the complete, corrected code for the necessary files to make the tests pass. Repeat until all Jest tests are green.

* [ ] **Task 1.4: Pass All End-to-End Tests (Playwright)**
    * **Agent Directives:**
        1.  **Configure:** Add a script to `package.json` named `test:e2e` that executes `npx playwright test`.
        2.  **Execute:** Run the Playwright E2E test suite with `npm run test:e2e`.
        3.  **Analyze & Fix:** For each failing test, identify the root cause in the application code and provide the complete, corrected code for the necessary files to make the tests pass. Repeat until all Playwright tests are green.

### **Phase 2: Architectural Enhancements**

* [ ] **Task 2.1: Enhance Document Intelligence Pipeline**
    * **Agent Directives:**
        1.  **API:** Modify the `app/api/upload/route.ts`...
        2.  **API Test (Jest):** Create a new Jest integration test for the upload route...
        3.  **Hook:** Modify the `hooks/useDocuments.ts`...
        4.  **Hook Test (Jest):** Modify the Jest unit test for the `useDocuments` hook...
        5.  **UI:** Modify the `components/DocumentsList.tsx`...
        6.  **UI Test (Playwright):** Modify the `tests/documents.spec.ts` Playwright test...

---
*(This detailed, corrected pattern continues for all subsequent tasks.)*