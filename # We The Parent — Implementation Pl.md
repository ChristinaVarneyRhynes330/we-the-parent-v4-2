# We The Parent — Implementation Plan

## Vision
We The Parent™ is a zero-cost, AI‑augmented self‑litigation ecosystem for pro se parental defenders in Florida juvenile dependency cases.  
Built with Next.js, Supabase, Tailwind, and multiple AI providers, the platform delivers drafting, research, compliance, evidence management, and case organization tools — all emotionally resonant and technically lean.

---

## Phase 0 — Stabilize & Baseline ✅ (Complete)
**Duration:** 1–2 days  
**Milestones:**
- [x] Canonical `styles/global.css` imported in `app/layout.tsx`
- [x] Tailwind config matches folder structure; brand variables exposed
- [x] `tsconfig.json` baseUrl + `@/*` alias confirmed
- [x] `.vscode/settings.json` excludes heavy folders
- [x] Supabase client in `lib/supabase/client.ts`
- [x] `/api/health` route returns `{ ok: true }`

---

## Phase 1 — Core Data & Upload/Extraction (In Progress)
**Duration:** 3–4 days  
**Milestones:**
- [x] Tables: `cases`, `documents`, `document_chunks`
- [x] `/api/upload` → Supabase storage + `documents` row
- [x] `/api/extract` → parse `.docx`/`.txt` → chunk → embed → store in `document_chunks`
- [ ] Documents UI: `app/(documents)/[caseId]/page.tsx`

---

## Phase 2 — Unified AI Chat Vault
**Duration:** 4–6 days  
**Milestones:**
- [ ] Tables: `chat_threads`, `chat_messages`
- [ ] `/api/chat/route.ts` routes to provider adapter
- [ ] Context retrieval from `document_chunks`
- [ ] Model/provider switcher in UI: `components/ChatHeader.tsx`
- [ ] Rate limiting + structured error handling

---

## Phase 3 — Drafting + QA + Export
**Duration:** 5–7 days  
**Milestones:**
- [ ] Tables: `drafts`, `compliance_reports`
- [ ] Template registry: `lib/templates/florida/*.md`
- [ ] `/api/draft/generate`, `/api/draft/qa`, `/api/draft/export`
- [ ] Compliance engine v1: `lib/compliance/rules-fl.ts`
- [ ] Draft UI: `app/(drafts)/[caseId]/page.tsx`

---

## Phase 4 — Research + Bluebook + Offline
**Duration:** 4–6 days  
**Milestones:**
- [ ] Tables: `research_results`, `citations`
- [ ] `/api/research/search`, `/api/research/save`
- [ ] Bluebook formatter: `lib/research/bluebook.ts`
- [ ] Offline cache: IndexedDB + Workbox

---

## Phase 5 — Evidence + Timeline + Narrative ⬅️ PRIORITY
**Duration:** 5–6 days  
**Milestones:**
- [ ] Tables: `evidence`, `events`, `narratives`
- [ ] `/api/events` CRUD: `app/api/events/[id]/route.ts`
- [ ] `/api/narrative/generate`: AI-assisted Markdown narrative
- [ ] Timeline UI: `app/(timeline)/[caseId]/page.tsx`
- [ ] Event form modal: `components/EventForm.tsx`
- [ ] Narrative editor: `app/(narrative)/[caseId]/page.tsx`
- [ ] Auto-ingest events from document metadata
- [ ] Rule-based deadline generator: `lib/timeline/deadline.ts`

**Features:**
- Manual + automated event capture
- Chronological list, visual timeline, calendar view
- Filters by type/date/doc/evidence
- Inline previews of linked items
- Narrative generation from timeline + evidence
- Markdown editor with versioning
- Export narrative to DOCX/PDF

**Acceptance Criteria:**
- Events can be added manually and viewed in timeline
- Narrative can be generated from events and edited
- Timeline links to evidence and drafts
- Rule-based deadlines are calculated and displayed

---

## Phase 6 — Predicate Foundation + Review Workflows
**Duration:** 4–6 days  
**Milestones:**
- [ ] Tables: `predicates`, `audit_logs`
- [ ] Predicate builder UI: `app/(predicate)/[caseId]/page.tsx`
- [ ] Review queue + audit trail

---

## Phase 7 — Transcription
**Duration:** 3–5 days  
**Milestones:**
- [ ] Table: `transcription_jobs`
- [ ] `/api/transcribe/route.ts`
- [ ] Editor with segments, speakers, search
- [ ] Link excerpts to evidence

---

## Phase 8 — Polish, PWA, Accessibility
**Duration:** Ongoing  
**Milestones:**
- [ ] PWA manifest + offline caching
- [ ] Accessibility pass (ARIA, contrast, focus)
- [ ] Performance budgets, lazy routing

---

## Immediate Next Steps (Phase 5)
1. ✅ Add `events` and `narratives` tables to Supabase
2. ✅ Create `/api/events` CRUD routes
3. ✅ Create `/api/narrative/generate` route
4. ✅ Build Timeline UI + Event form modal
5. ✅ Build Narrative editor + Generate button
6. ✅ Hook document extraction to suggest events
7. ✅ Implement rule-based deadline generator

---

## References
- **Tech stack:** Next.js (App Router), Tailwind, TypeScript, Supabase (Postgres + Storage + pgvector), OpenAI, Google Generative AI, Groq, Vercel
- **Jurisdiction:** Florida juvenile dependency — compliance with Florida Juvenile & Civil Procedure rules