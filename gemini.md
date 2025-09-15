# We The Parent™ – Gemini Agent Mode Context

## 🛡 Safety Rules
- Only use approved tools: `file read`, `file write`.
- Block destructive commands: `ShellTool(rm -rf)`, `ShellTool(sudo)`, `ShellTool(del)`.
- Always show a diff before writing to any file.
- Never run shell commands without explicit confirmation.
- Stop and confirm if a change affects more than 5 files.

---

## 📡 MCP Server Configuration Goals
- Add MCP server for Supabase to query `documents`, `knowledge_chunks`, `events`.
- Add MCP server for GitHub to fetch open issues tagged `bug`.
- Use `/mcp` to verify connections before running tasks.

---

## 📋 Context Files
- Global `~/.gemini/GEMINI.md`: coding style, naming conventions, legal formatting rules.
- Project‑level `GEMINI.md`: MVP build plan (this file).
- Module‑level `GEMINI.md` in `/evidence`: OCR → embedding → tagging pipeline.

---

## 🏗 MVP Build Sequence Prompts

### Step 1 – Backend & PWA Shell
- Scaffold Supabase schema for `cases`, `documents`, `knowledge_chunks`, `events`, `messages`.
- Set up PWA manifest + service worker.

### Step 2 – Document Upload → OCR → Embedding
- Create `/api/upload` to store files in Supabase Storage + insert metadata.
- Integrate Tesseract.js OCR → store text in `raw_pages`.
- Chunk text + generate embeddings with local Instructor model.

### Step 3 – Evidence Extraction & Auto‑Tagging
- Classify docs (Motion, Affidavit, Exhibit) + extract metadata.
- Auto‑link evidence to timeline events.

### Step 4 – RAG Research Pane
- `/api/rag/query` to search `knowledge_chunks` with filters.
- Right‑rail UI with citations + “Copy to Draft” button.

### Step 5 – Draft Generator
- Stepper UI for `/drafting` → collect facts → call Gemini → live preview.
- Auto‑insert Certificate of Service before export.

### Step 6 – Timeline & Calendar Sync
- Integrate Google Calendar API → pull hearings into `events`.
- Render vertical timeline with icons.

### Step 7 – Motion Tracker
- Chart.js donut chart showing motions by status.

### Step 8 – Emergency Filing Module
- Guided urgent motion generator → export PDF/DOCX.

### Step 9 – Strategy Planner
- Auto‑update next steps when new docs/events are added.

### Step 10 – Branding & Responsive Polish
- Apply navy, rose gold, burgundy, peach theme site‑wide.

---

## ⚡ Slash Commands
- `/tools` → list available tools.
- `/mcp` → list configured MCP servers.

---

## 🚀 Optional Yolo Mode
- Only enable `"geminicodeassist.agentYoloMode": true` in trusted workspace.
- Never use in untrusted repos.

---

## 🎯 Example Prompts

### Understanding & Navigation
- “What does this repository do? Give me a high‑level architecture map for *We The Parent™*.”
- “Trace the flow from document upload to evidence search results.”

### Feature Building
- “Add a `/motions` page with Chart.js donut chart from Supabase data.”
- “Implement `/api/evidence/search` to return top 5 relevant chunks with metadata.”

### Refactoring & Optimization
- “Refactor `processDocument.js` to run OCR in a Web Worker.”
- “Extract common Supabase queries into `lib/db.js`.”

### Debugging
- “Fix chat history not persisting in LocalStorage after refresh.”
- “Resolve 500 error when uploading large PDFs.”

### Research & Integration
- “Summarize this statute and extract filing deadlines.”
- “Integrate OCR output into evidence tagging workflow.”
