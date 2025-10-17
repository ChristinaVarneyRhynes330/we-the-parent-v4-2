'use client';

import { useDocuments, Document } from '@/hooks/useDocuments';

// Define the type for the component's props
interface EvidenceListProps {
  caseId: string;
}

export default function EvidenceList({ caseId }: EvidenceListProps) {
  const { documents, isLoading, error } = useDocuments(caseId);
  
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Uploaded Evidence</h2>
      {isLoading && <p>Loading evidence...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
      {!isLoading && !error && documents.length === 0 ? (
        <p>No evidence has been uploaded for this case yet.</p>
      ) : (
        <ul className="space-y-4">
          {documents.map((item: Document) => ( // Explicitly type 'item'
            <li key={item.id} className="p-4 border rounded-md">
              <p className="font-medium">{item.file_name}</p>
              <p className="text-sm text-gray-500">
                Size: {(item.file_size / 1024).toFixed(2)} KB
              </p>
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(item.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}