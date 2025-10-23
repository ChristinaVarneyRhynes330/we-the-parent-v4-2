"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

export type Case = { id: string; name: string };

export type CaseContextType = {
  cases: Case[];
  loading: boolean;
  activeCase: Case | null;
  setActiveCase: (id: string) => void;
};

const CaseContext = createContext<CaseContextType>({
  cases: [],
  loading: false,
  activeCase: null,
  setActiveCase: () => {},
});

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActive] = useState<Case | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("wtp_cases") : null;
      const parsed: Case[] | null = stored ? JSON.parse(stored) : null;

      const demoCases: Case[] =
        parsed && Array.isArray(parsed) && parsed.length > 0
          ? parsed
          : [{ id: "demo-1", name: "My Case" }];

      if (!alive) return;
      setCases(demoCases);
      setActive(demoCases[0] ?? null);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setActiveCase = useCallback(
    (id: string) => {
      const found = cases.find((c) => c.id === id) || null;
      setActive(found);
    },
    [cases]
  );

  const value = useMemo(
    () => ({ cases, loading, activeCase, setActiveCase }),
    [cases, loading, activeCase, setActiveCase]
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used within CaseProvider");
  return ctx;
}

/** 🔧 Alias to preserve existing imports in older pages */
export function useCases() {
  return useCase();
}
