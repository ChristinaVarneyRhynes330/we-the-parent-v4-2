'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Document = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
};

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9';

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const supabase = createClient();

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('case_id', CASE_ID)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="border p-2 rounded flex justify-between">
          <span>{doc.file_name}</span>
          <a
            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/case_documents/${doc.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}