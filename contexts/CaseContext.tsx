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
  title: string; 
  description?: string;
  created_at: string;
  // CRITICAL FIX: Added required properties for Sidebar and components
  name: string;
  case_number: string;
};

type CaseContextType = {
  cases: Case[];
  loading: boolean;
  error: string | null;
  refreshCases: () => Promise<void>;
  
  // CRITICAL FIX: Add active case state and setter (Solves errors in Sidebar/Compliance)
  activeCase: Case | null;
  setActiveCase: (caseId: string) => void;
};

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActiveCaseState] = useState<Case | null>(null); // Added state
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
        // Set first case as active if none is currently selected
        if (data && data.length > 0 && !activeCase) {
          setActiveCaseState(data[0] as Case);
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
  
  // CRITICAL FIX: Add setActiveCase function
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
        
        // Expose new properties
        activeCase,
        setActiveCase,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

// Export the primary hook used by components
export function useCases() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
}

// CRITICAL FIX: Add the missing useCase export that pages rely on
export function useCase() {
  return useCases();
}