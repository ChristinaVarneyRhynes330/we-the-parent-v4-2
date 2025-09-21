'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Document = {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
};

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9';

export default function DocumentsList() {
  const supabase = createClient();
  const [docs, setDocs] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('id, file_name, file_path, created_at')
        .eq('case_id', CASE_ID)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error.message);
        setError(error.message);
      } else {
        setDocs(data || []);
      }
    };

    fetchDocuments();
  }, [supabase]);

  if (error) {
    return <div className="text-red-500">Error loading documents: {error}</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-header text-lg text-dusty-mauve">Documents</h3>
      <ul className="list-disc pl-5">
        {docs.length > 0 ? (
          docs.map((d) => <li key={d.id}>{d.file_name}</li>)
        ) : (
          <li>No documents found for this case.</li>
        )}
      </ul>
    </div>
  );
}