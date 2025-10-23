"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCase } from "@/contexts/CaseContext";

type ComplianceIssue = {
  id: string;
  title: string;
  due?: string | null;
  done: boolean;
};

export default function CompliancePage() {
  const { activeCase } = useCase(); // use current case from context
  const [tasks, setTasks] = useState<ComplianceIssue[]>([]);

  // Demo data – replace with Supabase query later
  useEffect(() => {
    setTasks([
      { id: "c1", title: "Parenting class enrollment", due: null, done: false },
      { id: "c2", title: "Weekly therapy session", due: "2025-11-01", done: false },
      { id: "c3", title: "Random UA test", due: null, done: true },
    ]);
  }, []);

  function toggle(id: string) {
    setTasks((prev) => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  return (
    <main className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-serif text-navy">Compliance</h1>
          <p className="text-navy/70">
            Case: <span className="font-medium">{activeCase?.name ?? "—"}</span>
          </p>
        </div>
        <Link href="/documents" className="btn-ghost">Upload proof</Link>
      </header>

      <section className="card p-4">
        <h2 className="text-lg font-semibold text-navy">Tasks</h2>
        <ul className="mt-3 divide-y divide-navy/10">
          {tasks.length === 0 && (
            <li className="py-6 text-navy/70">No tasks yet.</li>
          )}
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.id)}
                  className="h-4 w-4 rounded border-navy/30 text-rust focus:ring-rust"
                />
                <span className={t.done ? "line-through text-navy/50" : "text-navy"}>
                  {t.title}
                </span>
              </label>
              <span className="text-sm text-navy/60">{t.due ? `Due ${t.due}` : ""}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
