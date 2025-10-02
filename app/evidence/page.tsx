'use client';

import { useMemo } from 'react';
import { useCase } from '@/contexts/CaseContext';
import { useDocuments } from '@/hooks/useDocuments';
import EvidenceUploader from '@/components/EvidenceUploader';
import EvidenceList from '@/components/EvidenceList';

export default function EvidencePage() {
  const { activeCase } = useCase();
  const { 
    documents, 
    isLoading, 
    error 
  } = useDocuments(activeCase?.id || '');

  const evidence = useMemo(() => 
    documents.filter(doc => doc.document_type === 'Evidence'), 
    [documents]
  );

  const handleUploadSuccess = () => {
    // The useDocuments hook will automatically refetch the documents list
    // so no manual intervention is needed here.
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-2 text-3xl font-bold">Evidence Management</h1>
      <p className="mb-8 text-lg text-gray-600">Case: {activeCase?.name || 'No case selected'}</p>
      
      <EvidenceUploader onUploadSuccess={handleUploadSuccess} caseId={activeCase?.id || ''} />
      
      {isLoading ? (
        <p>Loading evidence...</p>
      ) : error ? (
        <p className="text-red-500">Error loading evidence: {error.message}</p>
      ) : (
        <EvidenceList initialEvidence={evidence} />
      )}
    </div>
  );
}