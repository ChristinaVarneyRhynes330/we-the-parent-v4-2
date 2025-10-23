"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  Upload,
  FolderOpen,
  Calendar,
  Users,
  CheckCircle,
  Scale,
  FileText,
  Search,
  AlertTriangle,
  Mic,
  Wrench,
  ListTree,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useCase } from "@/contexts/CaseContext";

type NavItem = { name: string; href: string; icon: React.ElementType };
function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const main: NavItem[] = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Chat", href: "/chat", icon: MessageSquare },
];

const caseMgmt: NavItem[] = [
  { name: "Documents", href: "/documents", icon: Upload },
  { name: "Evidence", href: "/evidence", icon: FolderOpen },
  { name: "Timeline", href: "/timeline", icon: Calendar },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Children", href: "/children", icon: Users },
  { name: "Compliance", href: "/compliance", icon: CheckCircle },
];

const drafting: NavItem[] = [
  { name: "Narrative", href: "/narrative", icon: FileText },
  { name: "Predicate", href: "/predicate", icon: ListTree },
  { name: "Draft", href: "/draft", icon: FileText },
  { name: "Strategy", href: "/strategy", icon: ListTree },
];

const research: NavItem[] = [
  { name: "Research", href: "/research", icon: Search },
  { name: "Constitutional", href: "/constitutional", icon: Scale },
];

const courtroomTools: NavItem[] = [
  { name: "Live Courtroom Guide", href: "/guide", icon: BookOpen },
  { name: "Emergency", href: "/emergency", icon: AlertTriangle },
  { name: "Transcribe", href: "/transcribe", icon: Mic },
  { name: "Tools", href: "/tools", icon: Wrench },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { cases, activeCase, setActiveCase, loading } = useCase();
  const [open, setOpen] = useState(false);

  function Group({ title, items }: { title: string; items: NavItem[] }) {
    return (
      <div>
        <p className="px-4 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-cream/70">
          {title}
        </p>
        <nav className="px-2 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cx(
                  "group relative flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-cream"
                    : "text-cream/85 hover:bg-white/10 hover:text-cream"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-rust" />
                )}
                <Icon
                  className={cx(
                    "mr-3 h-5 w-5",
                    active ? "text-rust" : "text-cream/70 group-hover:text-cream"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  function SidebarContent() {
    return (
      <>
        {/* Brand */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
          <div className="h-8 w-8 rounded-md bg-rust text-white flex items-center justify-center font-bold">
            W
          </div>
          <h1 className="font-serif text-xl text-white tracking-tight">
            We The Parent™
          </h1>
        </div>

        {/* Case selector */}
        <div className="px-4 py-4 border-b border-white/10">
          <label
            htmlFor="case"
            className="block text-xs text-cream/70 mb-1"
          >
            Current Case
          </label>
          {loading ? (
            <div className="text-sm text-cream/85">Loading…</div>
          ) : cases.length > 0 ? (
            <select
              id="case"
              className="w-full rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white"
              value={activeCase?.id || ""}
              onChange={(e) => setActiveCase(e.target.value)}
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id} className="text-ink">
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-cream/85">No cases</div>
          )}
        </div>

        {/* Navigation groups */}
        <Group title="Main" items={main} />
        <div className="px-4 pt-4"><div className="h-px bg-white/10" /></div>
        <Group title="Case Management" items={caseMgmt} />
        <div className="px-4 pt-4"><div className="h-px bg-white/10" /></div>
        <Group title="Drafting" items={drafting} />
        <div className="px-4 pt-4"><div className="h-px bg-white/10" /></div>
        <Group title="Research" items={research} />
        <div className="px-4 pt-4"><div className="h-px bg-white/10" /></div>
        <Group title="Courtroom & Tools" items={courtroomTools} />

        {/* Footer */}
        <div className="mt-auto px-4 py-4 border-t border-white/10 text-xs text-cream/70">
          We The Parent™ v1.0
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-md bg-navy p-2 text-white shadow"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-navy">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={cx(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 bg-navy",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
