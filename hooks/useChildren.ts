import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
export interface Child {
  id: string;
  case_id: string;
  name: string;
  date_of_birth: string;
  placement_type?: string;
  placement_address?: string;
}

export type NewChild = Omit<Child, 'id'>;

// --- API HELPER FUNCTIONS ---
const API_BASE_URL = '/api/children';

const fetchChildren = async (caseId: string): Promise<Child[]> => {
  const response = await fetch(`${API_BASE_URL}?case_id=${caseId}`);
  if (!response.ok) throw new Error('Failed to fetch children');
  const data = await response.json();
  return data.children;
};

const createChild = async (newChild: NewChild): Promise<Child> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newChild),
  });
  if (!response.ok) throw new Error('Failed to create child');
  return response.json();
};

// --- THE CUSTOM HOOK ---
export function useChildren(caseId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ['children', caseId];

  const { 
    data: children, 
    isLoading, 
    error 
  } = useQuery<Child[]>({
    queryKey,
    queryFn: () => fetchChildren(caseId!),
    enabled: !!caseId,
  });

  const createChildMutation = useMutation({
    mutationFn: createChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    children: children ?? [],
    isLoading,
    error: error as Error | null,
    createChild: createChildMutation.mutate,
    isCreating: createChildMutation.isPending,
  };
}
