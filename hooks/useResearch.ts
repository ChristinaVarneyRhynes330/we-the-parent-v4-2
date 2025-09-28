import { useMutation } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---

// Represents a source chunk used for the research summary
export interface ResearchSource {
  id: string;
  document_id: string;
  document_title: string;
  page_number: number;
  content: string;
}

// Represents the complete result of a research query
export interface ResearchResult {
  summary: string;
  sources: ResearchSource[];
}

interface ResearchPayload {
  query: string;
  caseId: string;
}

// --- API HELPER FUNCTION ---

const performAiResearch = async (payload: ResearchPayload): Promise<ResearchResult> => {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task: 'performResearch', // The specific AI task we want to run
      payload: payload,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to perform research');
  }

  return response.json();
};

// --- THE CUSTOM HOOK ---

/**
 * Custom hook to manage the state and actions for the legal research feature.
 */
export function useResearch() {
  // We use a mutation because performing a search is an action that changes state,
  // not just a passive data fetch.
  const researchMutation = useMutation<ResearchResult, Error, ResearchPayload>({ 
    mutationFn: performAiResearch 
  });

  return {
    // The `mutate` function to trigger a new research query
    performResearch: researchMutation.mutate,
    // The results of the latest query
    researchResult: researchMutation.data,
    // The loading state
    isLoading: researchMutation.isPending,
    // Any error that occurred
    error: researchMutation.error,
  };
}
