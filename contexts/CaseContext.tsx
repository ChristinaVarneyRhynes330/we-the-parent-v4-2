'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { createClient } from '@supabase/supabase-js';

// ✅ Initialize Supabase client with env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Case = {
  id: string;
  title: string; // Adjusted for the Dashboard's expected type
  name: string; // Keeping the name property from the types file
  description?: string;
  created_at: string;
};

type CaseContextType = {
  cases: Case[];
  loading: boolean;
  error: string | null;
  refreshCases: () => Promise<void>;
};

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 👇 Query your "cases" table in Supabase
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching cases:', error.message);
        setError(error.message);
        setCases([]);
      } else {
        setCases(data || []);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching cases:', err);
      setError(err?.message || 'Unknown error');
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return (
    <CaseContext.Provider
      value={{
        cases,
        loading,
        error,
        refreshCases: fetchCases,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

// Keep backward compatibility with useCases
export function useCases() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
}

// CRITICAL FIX: Add the missing export (useCase) that multiple pages rely on (solves 6 warnings)
export function useCase() {
  return useCases();
}