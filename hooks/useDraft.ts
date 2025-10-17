import { useMutation } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
interface DraftVariables {
  templateId: string;
  caseId: string;
  userInstructions: string;
}

// --- API HELPER FUNCTIONS ---
const API_BASE_URL = '/api/draft';

const generateDraft = async (variables: DraftVariables): Promise<string> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate draft');
  }
  const data = await response.json();
  return data.draft;
};

// --- THE CUSTOM HOOK ---
export function useDraft() {
  const { mutate, isPending, error, data } = useMutation<string, Error, DraftVariables>({
    mutationFn: generateDraft,
  });

  return {
    generateDraft: mutate,
    isGenerating: isPending,
    error: error as Error | null,
    draft: data,
  };
}
