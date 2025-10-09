import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
export interface NarrativeEntry {
  id: string;
  case_id: string;
  content: string;
  created_at: string;
}

export type NewNarrativeEntry = Omit<NarrativeEntry, 'id' | 'created_at'>;
export type UpdateNarrativeEntry = Partial<Omit<NarrativeEntry, 'id' | 'case_id' | 'created_at'>>;

// --- API HELPER FUNCTIONS ---
const API_BASE_URL = '/api/narrative';

const fetchNarrativeEntries = async (caseId: string): Promise<NarrativeEntry[]> => {
  const response = await fetch(`${API_BASE_URL}?case_id=${caseId}`);
  if (!response.ok) throw new Error('Failed to fetch narrative entries');
  const data = await response.json();
  return data.entries;
};

const createNarrativeEntry = async (newEntry: NewNarrativeEntry): Promise<NarrativeEntry> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEntry),
  });
  if (!response.ok) throw new Error('Failed to create narrative entry');
  return response.json();
};

const updateNarrativeEntry = async ({ id, ...updates }: { id: string } & UpdateNarrativeEntry): Promise<NarrativeEntry> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update narrative entry');
  return response.json();
};

const deleteNarrativeEntry = async (entryId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${entryId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete narrative entry');
};

// --- THE CUSTOM HOOK ---
export function useNarrative(caseId: string | undefined) {
  const queryClient = useQueryClient();

  const queryKey = ['narrative', caseId];

  const { 
    data: entries, 
    isLoading, 
    error 
  } = useQuery<NarrativeEntry[]>({
    queryKey,
    queryFn: () => fetchNarrativeEntries(caseId!),
    enabled: !!caseId,
  });

  const createEntryMutation = useMutation({
    mutationFn: createNarrativeEntry,
    onMutate: async (newEntry: NewNarrativeEntry) => {
      await queryClient.cancelQueries({ queryKey });
      const previousEntries = queryClient.getQueryData<NarrativeEntry[]>(queryKey);
      const optimisticEntry: NarrativeEntry = {
        id: `optimistic-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...newEntry,
      };
      queryClient.setQueryData<NarrativeEntry[]>(queryKey, (old) => [...(old || []), optimisticEntry]);
      return { previousEntries };
    },
    onError: (err, newEntry, context) => {
      queryClient.setQueryData(queryKey, context?.previousEntries);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: updateNarrativeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: deleteNarrativeEntry,
    onMutate: async (entryId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousEntries = queryClient.getQueryData<NarrativeEntry[]>(queryKey);
      queryClient.setQueryData<NarrativeEntry[]>(queryKey, (old) => old?.filter(entry => entry.id !== entryId) || []);
      return { previousEntries };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousEntries);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    entries: entries ?? [],
    isLoading,
    error: error as Error | null,
    
    createEntry: createEntryMutation.mutate,
    updateEntry: updateEntryMutation.mutate,
    deleteEntry: deleteEntryMutation.mutate,

    isCreating: createEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
  };
}
