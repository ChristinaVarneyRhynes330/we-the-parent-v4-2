'use client';

import { useCase } from '@/contexts/CaseContext';
import DocumentsList from '@/components/DocumentsList';

export default function EvidencePage() {
  const { activeCase } = useCase();

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-2 text-3xl font-bold">Evidence Management</h1>
      <p className="mb-8 text-lg text-gray-600">Case: {activeCase?.name || 'No case selected'}</p>
      
      {activeCase ? (
        <DocumentsList caseId={activeCase.id} />
      ) : (
        <p>Please select a case to manage evidence.</p>
      )}
    </div>
  );
}