import { useQuery } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
export interface Precedent {
  title: string;
  summary: string;
  relevance: string;
}

// --- API HELPER FUNCTIONS ---
const API_BASE_URL = '/api/constitutional-law';

const fetchPrecedents = async (): Promise<Precedent[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch precedents');
  const data = await response.json();
  return data.precedents;
};

// --- THE CUSTOM HOOK ---
export function usePrecedents() {
  const { 
    data: precedents, 
    isLoading, 
    error 
  } = useQuery<Precedent[]>({
    queryKey: ['precedents'],
    queryFn: fetchPrecedents,
  });

  return {
    precedents: precedents ?? [],
    isLoading,
    error: error as Error | null,
  };
}
