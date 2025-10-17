import { useMutation } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
interface EmergencyMotionVariables {
  caseName: string;
  caseNumber: string;
  reason: string;
  outcome: string;
}

// --- API HELPER FUNCTIONS ---
const API_BASE_URL = '/api/emergency-motion';

const generateEmergencyMotion = async (variables: EmergencyMotionVariables): Promise<string> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate emergency motion');
  }
  const data = await response.json();
  return data.draft;
};

// --- THE CUSTOM HOOK ---
export function useEmergencyMotion() {
  const { mutate, isPending, error, data } = useMutation<string, Error, EmergencyMotionVariables>({
    mutationFn: generateEmergencyMotion,
  });

  return {
    generateEmergencyMotion: mutate,
    isGenerating: isPending,
    error: error as Error | null,
    draft: data,
  };
}
