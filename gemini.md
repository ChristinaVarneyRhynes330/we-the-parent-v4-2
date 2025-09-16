# We The Parent™ — Gemini Agent Mode Context

## 📋 Table of Contents

1. [Safety Rules](#-safety-rules)
2. [MCP Server Configuration Goals](#-mcp-server-configuration-goals)
3. [Context Files](#-context-files)
4. [MVP Build Sequence Prompts](#-mvp-build-sequence-prompts)
5. [Slash Commands](#-slash-commands)
6. [Optional Yolo Mode](#-optional-yolo-mode)
7. [Example Prompts](#-example-prompts)
8. [Version History](#-version-history)
9. [Related Resources](#-related-resources)

---

## 🛡 Safety Rules

- **Approved Tools:** Only use `file read`, `file write`, and `fetch` tools.
- **Prohibited Commands:** Block destructive commands like `ShellTool(rm -rf)`, `ShellTool(sudo)`, and `ShellTool(del)`.
- **Diff Confirmation:** Always show a diff before writing to any file.
- **Multi-File Changes:** Stop and confirm if a change affects more than 5 files.

---

## 📡 MCP Server Configuration Goals

- **Supabase MCP Server:** Query `documents`, `knowledge_chunks`, and `events` tables.
- **GitHub MCP Server:** Fetch open issues tagged `bug`.
- **Verification:** Use `/mcp` to verify connections before running tasks.

---

## 📂 Context Files

- **Global Context:** `~/.gemini/GEMINI.md` — coding style, naming conventions, legal formatting rules.
- **Project-Level Context:** `GEMINI.md` — MVP build plan (this file).
- **Module-Level Context:** `GEMINI.md` in `/evidence` — OCR → embedding → tagging pipeline.

---

## 🏗 MVP Build Sequence Prompts

### Step 1 – Backend & PWA Shell

- Scaffold Supabase schema for `cases`, `documents`, `knowledge_chunks`, `events`, `messages`.
- Set up PWA manifest and service worker.

### Step 2 – Document Upload → OCR → Embedding

- Create `/api/upload` to store files in Supabase Storage and insert metadata.
- Integrate Tesseract.js OCR to extract text and store in `raw_pages`.
- Chunk text and generate embeddings with local Instructor model.

### Step 3 – Evidence Extraction & Auto-Tagging

- Classify documents (Motion, Affidavit, Exhibit) and extract metadata.
- Auto-link evidence to timeline events.

### Step 4 – RAG Research Pane

- Implement `/api/rag/query` to search `knowledge_chunks` with filters.
- Create right-rail UI with citations and "Copy to Draft" button.

### Step 5 – Draft Generator

- Develop stepper UI for `/drafting` to collect facts and call Gemini for live preview.
- Auto-insert Certificate of Service before export.

### Step 6 – Timeline & Calendar Sync

- Integrate Google Calendar API to pull hearings into `events`.
- Render vertical timeline with icons.

### Step 7 – Motion Tracker

- Implement Chart.js donut chart showing motions by status.

### Step 8 – Emergency Filing Module

- Create guided urgent motion generator to export PDF/DOCX.

### Step 9 – Strategy Planner

- Auto-update next steps when new documents/events are added.

### Step 10 – Branding & Responsive Polish

- Apply navy, rose gold, burgundy, peach theme site-wide.

---

## ⚡ Slash Commands

- `/tools` → Lists all available tools that the AI agent can utilize. Example usage: `/tools`.
- `/mcp` → Lists configured MCP servers. Example usage: `/mcp`.

---

## 🚀 Optional Yolo Mode

- **Description:** Yolo Mode allows the AI agent to make more autonomous decisions.
- **Usage:** Enable `"geminicodeassist.agentYoloMode": true` only in trusted workspaces to ensure safe operations.

---

## 🎯 Example Prompts

### Understanding & Navigation

- “What does this repository do? Provide a high-level architecture map for *We The Parent™*.”
- “Trace the flow from document upload to evidence search results.”

### Feature Building

- “Add a `/motions` page with a Chart.js donut chart from Supabase data.”
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

---

## 📌 Version History

- **v4.2:** Initial release.
- **v4.3:** Added clarification on "Yolo Mode" and expanded slash commands section.

---

## 📚 Related Resources

- [Supabase Documentation](https://supabase.com/docs)
- [GitHub API Documentation](https://docs.github.com/en/rest)
