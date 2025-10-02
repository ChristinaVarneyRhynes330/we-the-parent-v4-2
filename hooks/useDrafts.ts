import { useMutation } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
export interface DraftRequest {
  templateId: string;
  caseId: string;
  userInstructions: string;
}

export interface DraftResponse {
  draft: string;
}

// --- API HELPER FUNCTION ---
const API_BASE_URL = '/api/draft';

const generateDraft = async (request: DraftRequest): Promise<DraftResponse> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate draft.');
  }
  return response.json();
};

// --- THE CUSTOM HOOK ---
export function useDrafts() {
  const generateDraftMutation = useMutation({
    mutationFn: generateDraft,
  });

  return {
    generateDraft: generateDraftMutation.mutate,
    isGenerating: generateDraftMutation.isPending,
    error: generateDraftMutation.error as Error | null,
    draft: generateDraftMutation.data?.draft,
  };
}
