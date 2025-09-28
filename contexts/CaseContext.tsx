'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Define the Case type based on your database schema
export interface Case {
  id: string;
  name: string;
  case_number: string;
  // Add any other fields you need from the 'cases' table
}

interface CaseContextType {
  cases: Case[];
  activeCase: Case | null;
  setActiveCase: (caseId: string | null) => void;
  loading: boolean;
  refetchCases: () => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActiveCaseState] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cases');
      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }
      const data = await response.json();
      const fetchedCases = data.cases || [];
      setCases(fetchedCases);

      const storedCaseId = localStorage.getItem('activeCaseId');
      if (storedCaseId) {
        const foundCase = fetchedCases.find((c: Case) => c.id === storedCaseId);
        setActiveCaseState(foundCase || (fetchedCases[0] || null));
      } else if (fetchedCases.length > 0) {
        setActiveCaseState(fetchedCases[0]);
        localStorage.setItem('activeCaseId', fetchedCases[0].id);
      }
    } catch (error) {
      console.error(error);
      // Handle error state in UI, maybe set cases to an empty array
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const setActiveCase = (caseId: string | null) => {
    if (caseId) {
      const foundCase = cases.find(c => c.id === caseId);
      setActiveCaseState(foundCase || null);
      if (foundCase) {
        localStorage.setItem('activeCaseId', foundCase.id);
      }
    } else {
      setActiveCaseState(null);
      localStorage.removeItem('activeCaseId');
    }
  };

  return (
    <CaseContext.Provider value={{ cases, activeCase, setActiveCase, loading, refetchCases: fetchCases }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
}