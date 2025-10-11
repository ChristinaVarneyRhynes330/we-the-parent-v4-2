# 📘 We The Parent™ – Master Specification
**Version:** 5.2  
**Mode:** Test-Driven Fix  
**Agent:** Gemini (VS Code Integration)

---

## 1. 🎯 PROJECT OVERVIEW

**Mission:**  
We The Parent™ is a zero-cost, AI-augmented self-litigation platform for Florida parents in juvenile dependency cases.

**Core Philosophy:**
- Zero Technical Debt → all tests must pass before feature merge.
- Test-Driven Development → API → Test → Hook → Test → UI → Test.
- Beginner-Friendly → clear, well-commented, maintainable code.

---

## 2. 🧠 AI AGENT CONSTITUTION (Rules of Operation)

> **Purpose:** These define unbreakable operational logic for the Gemini Code Assist agent.

**Rule 1 – Sequential Execution**  
Complete tasks in order. Never skip ahead.

**Rule 2 – Test-First Mentality**  
A test must define “done.” Never adjust the test to fit broken code.

**Rule 3 – Complete Code Delivery**  
Provide full file contents. No truncation.

**Rule 4 – Explain All Changes**  
After each modification, include a “Why & What Changed” comment block.

**Rule 5 – Verify Before Next Step**  
Run all related tests before moving forward.

---

## 3. 🏗️ ARCHITECTURE BLUEPRINT

**Stack Overview:**
- Framework → Next.js 14+ (App Router)
- Styling → Tailwind CSS
- Database → Supabase (PostgreSQL)
- State Management → React Query (server) + React Context (UI)
- Testing → Jest (unit/integration) + Playwright (E2E)

**Workflow Sequence:**
```bash
# Required Build/Test Pattern
1. Build/Fix API endpoint
2. Write/Fix Jest test for API
3. Build/Fix React Hook
4. Write/Fix Jest test for Hook
5. Build/Fix UI Component
6. Write/Fix Playwright test for UI
