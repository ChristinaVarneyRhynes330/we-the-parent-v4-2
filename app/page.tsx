"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      <Topbar />

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="stat"><div className="text-sm text-navy/70">AI Assistant</div><Link href="/chat" className="mt-1 block text-2xl font-semibold text-rust">Ask about my case →</Link></div>
        <div className="stat"><div className="text-sm text-navy/70">Next Hearing</div><div className="mt-1 text-2xl font-semibold text-navy">—</div></div>
        <div className="stat"><div className="text-sm text-navy/70">Strategy Updates</div><Link href="/strategy" className="mt-1 block text-2xl font-semibold text-navy">0</Link></div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2 p-4">
          <h2 className="text-lg font-semibold heading">Recent documents</h2>
          <div className="mt-3 card-muted p-8 text-center">
            <p className="text-navy/80">No documents yet. Upload a file to get started.</p>
            <Link href="/documents" className="btn-primary mt-4">Upload document</Link>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="text-lg font-semibold heading">Case chat (AI)</h2>
          <p className="mt-3 text-navy/80">Ask questions grounded in your documents and Florida law.</p>
          <Link href="/chat" className="btn-secondary mt-3">Open AI Assistant</Link>
        </div>
      </section>

      <Onboarding />
    </main>
  );
}

function Topbar() {
  return (
    <div className="sticky top-0 z-30 -mx-6 mb-2 border-b border-navy/10 bg-ivory/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-3">
        <span className="text-sm text-navy/70">Case Command Center</span>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/documents" className="btn-ghost">Upload</Link>
          <Link href="/chat" className="btn-primary">Ask AI</Link>
        </div>
      </div>
    </div>
  );
}

function Onboarding() {
  const steps = [
    { key: "upload",    label: "Upload your first document", href: "/documents" },
    { key: "summarize", label: "Ask AI to summarize it",     href: "/chat" },
    { key: "hearing",   label: "Add your next hearing date", href: "/timeline" },
  ] as const;

  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try { const raw = localStorage.getItem("wtp_onboarding"); setDone(raw ? JSON.parse(raw) : {}); } catch {}
  }, []);

  function toggle(k: string) {
    const next = { ...done, [k]: !done[k] }; setDone(next);
    try { localStorage.setItem("wtp_onboarding", JSON.stringify(next)); } catch {}
  }

  return (
    <div className="card p-4">
      <h2 className="text-lg font-semibold heading">Getting started (3 steps)</h2>
      <ul className="mt-3 divide-y divide-navy/10">
        {steps.map(s => (
          <li key={s.key} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button
                aria-label={`Mark ${s.label} complete`}
                onClick={() => toggle(s.key)}
                className={`size-5 rounded border ${done[s.key] ? "bg-rust border-rust" : "bg-paper border-navy/30"}`}
              />
              <span className={done[s.key] ? "line-through text-navy/50" : "text-navy"}>{s.label}</span>
            </div>
            <Link href={s.href} className="text-sm text-navy/70 underline">Go</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
