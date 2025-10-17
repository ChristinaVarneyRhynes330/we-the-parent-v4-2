import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
export interface Document {
  id: string;
  case_id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  document_type: string | null;
  summary: string | null;
  created_at: string;
}

export type UpdateDocument = Partial<Omit<Document, 'id' | 'case_id' | 'created_at'>>;

interface UploadParams {
  file: File;
  caseId: string;
}

// --- API HELPER FUNCTIONS ---

const API_BASE_URL = '/api';

/**
 * Fetches all documents for a specific case.
 */
const fetchDocuments = async (caseId: string): Promise<Document[]> => {
  const response = await fetch(`${API_BASE_URL}/documents?caseId=${caseId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch documents');
  }
  const data = await response.json();
  return data.documents;
};

/**
 * Uploads a new file.
 */
const uploadDocument = async ({ file, caseId }: UploadParams): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('caseId', caseId);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'File upload failed');
  }
  return response.json();
};

/**
 * Deletes a document.
 */
const deleteDocument = async (documentId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, { method: 'DELETE' });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete document');
  }
};

/**
 * Updates a document's metadata.
 */
const updateDocument = async ({ id, ...updates }: { id: string } & UpdateDocument): Promise<Document> => {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update document');
  }
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
    enabled: !!caseId, // Only run the query if caseId is provided
  });

  // Mutation to upload a new document
  const uploadDocumentMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      // When a document is uploaded, invalidate the documents query to refetch the list
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Mutation to delete a document
  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Mutation to update a document's metadata
  const updateDocumentMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: (updatedDocument) => {
      // Update the specific document in the cache
      queryClient.setQueryData<Document[]>(queryKey, (oldData) => 
        oldData ? oldData.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc) : []
      );
    },
  });

  return {
    // Data
    documents: documents ?? [],
    isLoading,
    error: error as Error | null,
    
    // Mutations
    uploadDocument: uploadDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    updateDocument: updateDocumentMutation.mutate,

    // Mutation states
    isUploading: uploadDocumentMutation.isPending,
    isDeleting: deleteDocumentMutation.isPending,
    isUpdating: updateDocumentMutation.isPending,
  };
}