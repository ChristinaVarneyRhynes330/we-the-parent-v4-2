import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
export interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  document_type: string;
  summary: string;
  created_at: string;
  case_id: string;
}

// For creating a new document record (the file itself is handled separately)
export type NewDocument = Omit<Document, 'id' | 'created_at'>;
// For updating a document's metadata
export type UpdateDocument = Partial<Omit<Document, 'id' | 'case_id' | 'created_at'>>;


// --- API HELPER FUNCTIONS ---
// These functions will call our Next.js API routes.

const API_BASE_URL = '/api/documents';

const fetchDocuments = async (caseId: string): Promise<Document[]> => {
  const response = await fetch(`${API_BASE_URL}?case_id=${caseId}`);
  if (!response.ok) throw new Error('Failed to fetch documents');
  const data = await response.json();
  return data.documents;
};

const deleteDocument = async (documentId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${documentId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete document');
};

const updateDocument = async ({ id, ...updates }: { id: string } & UpdateDocument): Promise<Document> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update document');
  return response.json();
};


// --- THE CUSTOM HOOK ---

/**
 * Custom hook to manage all data and operations for the documents feature.
 */
export function useDocuments(caseId: string) {
  const queryClient = useQueryClient();

  const queryKey = ['documents', caseId];

  // Query to fetch all documents for a given case
  const { 
    data: documents, 
    isLoading, 
    error 
  } = useQuery<Document[]>({
    queryKey,
    queryFn: () => fetchDocuments(caseId),
    enabled: !!caseId, // Only run the query if caseId is not null
  });

  // Mutation to delete a document
  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      // When a document is deleted, invalidate the 'documents' query to refetch the list
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Mutation to update a document's metadata
  const updateDocumentMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    documents: documents ?? [],
    isLoading,
    error: error as Error | null,
    
    // Mutations
    deleteDocument: deleteDocumentMutation.mutate,
    updateDocument: updateDocumentMutation.mutate,

    // Mutation states
    isDeleting: deleteDocumentMutation.isPending,
    isUpdating: updateDocumentMutation.isPending,
  };
}
