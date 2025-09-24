'use client';

import { useEffect, useState } from 'react';
import { Evidence } from '@/types'; // Import the shared Evidence type

// Define the type for the component's props
interface EvidenceListProps {
  initialEvidence: Evidence[];
}

export default function EvidenceList({ initialEvidence }: EvidenceListProps) {
  const [evidence, setEvidence] = useState(initialEvidence);

  useEffect(() => {
    setEvidence(initialEvidence);
  }, [initialEvidence]);
  
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Uploaded Evidence</h2>
      {evidence.length === 0 ? (
        <p>No evidence has been uploaded for this case yet.</p>
      ) : (
        <ul className="space-y-4">
          {evidence.map((item: Evidence) => ( // Explicitly type 'item'
            <li key={item.id} className="p-4 border rounded-md">
              <p className="font-medium">{item.file_name}</p>
              <p className="text-sm text-gray-500">
                Size: {(item.file_size / 1024).toFixed(2)} KB
              </p>
              <p className="text-sm text-gray-500">
                Uploaded: {new Date(item.upload_date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}