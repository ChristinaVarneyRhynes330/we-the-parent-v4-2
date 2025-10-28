// FILE: contexts/CaseContext.tsx
// COMPLETE REPLACEMENT

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Case {
  id: string;
  user_id: string;
  name: string;
  case_number: string;
  title?: string;
  description?: string;
  created_at: string;
}

type CaseContextType = {
  cases: Case[];
  loading: boolean;
  error: string | null;
  refreshCases: () => Promise<void>;
  refetchCases: () => Promise<void>;
  activeCase: Case | null;
  setActiveCase: (caseId: string) => void;
};

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActiveCaseState] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching cases:', error.message);
        setError(error.message);
        setCases([]);
      } else {
        const casesData = (data || []).map(c => ({
          ...c,
          title: c.title || c.name,
        })) as Case[];
        
        setCases(casesData);
        
        if (casesData.length > 0 && !activeCase) {
          setActiveCaseState(casesData[0]);
        }
      }
    } catch (err: any) {
      console.error('Unexpected error fetching cases:', err);
      setError(err?.message || 'Unknown error');
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [activeCase]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);
  
  const setActiveCase = useCallback((caseId: string) => {
    const foundCase = cases.find(c => c.id === caseId);
    if (foundCase) {
      setActiveCaseState(foundCase);
    }
  }, [cases]);

  return (
    <CaseContext.Provider
      value={{
        cases,
        loading,
        error,
        refreshCases: fetchCases,
        refetchCases: fetchCases,
        activeCase,
        setActiveCase,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

export function useCases() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
}

export function useCase() {
  return useCases();
}