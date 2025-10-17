# 📘 We The Parent™ – Master Specification
**Version:** 6.0
**Mode:** Test-Driven Fix
**Agent:** Gemini (VS Code Integration)

---

## 1. 🎯 PROJECT OVERVIEW

**Mission:**
We The Parent™ is a zero-cost, AI-augmented self-litigation platform for parents in Florida juvenile dependency cases. It provides a seamless, test-driven workflow to manage a case from initial document upload to final courtroom presentation.

**Core Philosophy:**
- **Zero Technical Debt:** All tests must pass before a feature is considered complete.
- **Test-Driven Development:** Follow the sequence: API → Test → Hook → Test → UI → Test.
- **Beginner-Friendly:** Code must be clear, well-commented, and easily maintainable.

---

## 2. 🧠 AI AGENT CONSTITUTION (Rules of Operation)

> **Purpose:** These are unbreakable operational rules for the Gemini Code Assist agent.

**Rule 1 – Sequential Execution:**
Complete all tasks and phases in the `progress.md` roadmap in order. Never skip ahead.

**Rule 2 – Test-First Mentality:**
A test defines the requirements. Never adjust a test to fit broken code; always fix the code to pass the test.

**Rule 3 – Complete Code Delivery:**
Provide the full, complete contents for any file being created or modified. No partial code or truncation.

**Rule 4 – Explain All Changes:**
After each file modification, include a comment block explaining *why* the change was made and *what* was changed.

**Rule 5 – Verify Before Proceeding:**
After implementing a fix or feature, run all related tests to confirm success before moving to the next task.

---

## 3. 🏗️ ARCHITECTURE BLUEPRINT

**Stack Overview:**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **State Management:** React Query (for server state) + React Context (for UI state)
- **Testing:** Jest (for unit/integration tests) + Playwright (for end-to-end tests)
- **AI Integration:** Support for multiple providers (Groq, Gemini, etc.) via a centralized `AI Chat Vault`.

**Core Workflow Sequence:**
The development of any user-facing feature **must** follow this strict, test-driven sequence:

1.  **Document Upload & Extraction:** The foundational layer where raw files are processed into structured data.
2.  **Evidence Binder:** All processed data is organized, tagged, and made searchable.
3.  **AI Chat Vault:** A context-aware chat interface provides an intelligent layer over the evidence.
4.  **Timeline & Deadline Calculation:** Events are automatically and manually added to a timeline, with legal deadlines calculated.
5.  **Narrative Generation:** The AI transforms timeline events into a compelling case story.
6.  **Drafting Engine:** The narrative and evidence are used to populate legal document templates.
7.  **Courtroom Tools (Predicate Builder, etc.):** The prepared case materials are leveraged for real-time courtroom assistance.
8.  **Automated Testing:** Every step of this workflow is validated by the Playwright test suite.