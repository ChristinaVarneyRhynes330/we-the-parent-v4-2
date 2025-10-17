import { useMutation } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface ResearchData {
  results: SearchResult[];
  citations: string;
}

interface ResearchVariables {
  query: string;
  database: string;
}

// --- API HELPER FUNCTIONS ---
const API_BASE_URL = '/api/research';

const performSearch = async (variables: ResearchVariables): Promise<ResearchData> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to perform search');
  }
  return response.json();
};

// --- THE CUSTOM HOOK ---
export function useResearch() {
  const { mutate, isPending, error, data } = useMutation<ResearchData, Error, ResearchVariables>({
    mutationFn: performSearch,
  });

  return {
    performSearch: mutate,
    isSearching: isPending,
    error: error as Error | null,
    data,
  };
}