# We The Parent - Visual Development Roadmap

🎯 **Your Journey Overview**

**START → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → LAUNCH!** 🚀
`YOU ARE HERE`
`Tests` `Docs AI` `Features` `Strategy` `Courtroom`
`▓▓▓░░` `░░░░░` `░░░░░` `░░░░░` `░░░░░`
`50% Done` `Locked` `Locked` `Locked` `Locked`

---

📋 **Phase 1: Foundation & Testing (50% Complete)**

✅ **Task 1.1: Pre-Commit Hooks & Automation**
- Hooks configured and tested.
- GitHub Actions for Playwright are set up.

✅ **Task 1.2: Database Migrations**
- Initial schema migrations created and applied.

🔴 **Task 1.3: Playwright Tests (YOUR CURRENT FOCUS)**
- **Goal:** Achieve 100% pass rate on all end-to-end tests.
- **Narrative Tests (1/3 ✅):**
    - ✅ Create narrative entry (PASSING)
    - ❌ Edit narrative entry
    - ❌ Delete narrative entry
- **Timeline Tests (1/5 ✅):**
    - ✅ Create timeline event (PASSING)
    - ❌ Edit timeline event
    - ❌ Delete timeline event
    - ❌ Validation: Missing title
    - ❌ Validation: Missing date
- **Document Tests (1/2 ✅):**
    - ✅ Upload document (PASSING)
    - ❌ Delete document

🎉 **Phase 1 Completion**
- All 11 Playwright tests passing.
- Run `npm run test:e2e` and see all green.
- **Git commit:** `"feat: Phase 1 complete - all tests passing"`

---

🔒 **Phase 2: Core Feature Implementation (LOCKED)**

**Task 2.1: Document Upload & Extraction**
- Implement robust file handling for `.docx`, `.txt`, audio, and screenshots.
- Build the text and metadata extraction pipeline.

**Task 2.2: AI Chat Vault**
- Develop the centralized chat interface.
- Integrate context retrieval from uploaded documents.
- Implement switching between AI models (Groq, Gemini).

**Task 2.3: Evidence Binder**
- Create the UI for organizing and tagging all uploaded materials.
- Implement linking between evidence, timeline events, and narratives.

**Task 2.4: Timeline Builder**
- Build the timeline UI to display chronological events.
- Implement automatic event detection from document metadata.

🎉 **Phase 2 Completion**
- All core data features are functional and tested.
- **Git commit:** `"feat: Phase 2 complete - core data features"`

---

🔒 **Phase 3: AI-Powered Generation (LOCKED)**

**Task 3.1: Narrative Generator**
- Implement AI-powered narrative drafting from timeline events.
- Add editing, versioning, and export to DOCX/PDF.

**Task 3.2: Deadline Calculator**
- Integrate Florida Juvenile Procedure rules.
- Automatically calculate and display deadlines in the timeline.

**Task 3.3: Transcription Engine**
- Integrate AI service to transcribe uploaded audio.
- Implement speaker tagging and segment editing.

🎉 **Phase 3 Completion**
- AI generation tools are live and tested.
- **Git commit:** `"feat: Phase 3 complete - AI generation tools"`

---

🔒 **Phase 4: Advanced Legal Tooling (LOCKED)**

**Task 4.1: Drafting Engine**
- Build the system for generating legal motions from templates.
- Integrate case facts directly into the drafts.

**Task 4.2: Legal Research & Citations**
- Implement AI-powered legal database search.
- Add automatic Bluebook citation formatting.

**Task 4.3: Predicate Builder & Review Queue**
- Create the UI for building logical predicates.
- Implement audit logs and a review workflow for accountability.

🎉 **Phase 4 Completion**
- Advanced legal tools are operational.
- **Git commit:** `"feat: Phase 4 complete - advanced legal tooling"`

---

🔒 **Phase 5: Final Polish & Launch (LOCKED)**

**Task 5.1: Accessibility & PWA Polish**
- Implement ARIA labels, contrast checks, and keyboard navigation.
- Add offline support with Workbox and IndexedDB.

**Task 5.2: Final Testing & Debugging**
- Conduct a full manual walkthrough of all features.
- Fix all remaining bugs and ensure stability.

🎉 **LAUNCH!** 🚀
- Deploy the final, polished application to Vercel.
- Onboard the first wave of users.

---

📊 **Overall Progress Tracker**

- **Total Progress:** `[▓▓░░░░░░░░░░░░░░░░░░]` **10%**
- **Phase 1:** `[▓▓▓▓▓░░░░░]` **50%** ⏳ IN PROGRESS
- **Phase 2:** `[░░░░░░░░░░]` **0%** 🔒 LOCKED
- **Phase 3:** `[░░░░░░░░░░]` **0%** 🔒 LOCKED
- **Phase 4:** `[░░░░░░░░░░]` **0%** 🔒 LOCKED
- **Phase 5:** `[░░░░░░░░░░]` **0%** 🔒 LOCKED

---

🎯 **Today's Focus (Daily Checklist)**

**Date:** `Wednesday, October 15, 2025`
- **Morning Session:**
    - [ ] Review the failing Playwright tests for "Edit narrative entry".
    - [ ] Debug the state/rendering issue causing the test to fail.
- **Afternoon Session:**
    - [ ] Implement the fix for the edit functionality.
    - [ ] Run `npx playwright test narrative.spec.ts` until the edit test passes.
- **Evening Wrap-Up:**
    - [ ] Commit the working code with a clear message.
    - [ ] Update this `progress.md` file with today's progress.
    - [ ] Note any blockers for tomorrow.