'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Doc = {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
};

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9';

export default function DocumentsList() {
  const supabase = createClient();
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from<any>('documents')
        .select('id, file_name, file_path, created_at')
        .eq('case_id', CASE_ID)
        .order('created_at', { ascending: false });
      setDocs(data || []);
    })();
  }, [supabase]);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Documents</h3>
      <ul className="list-disc pl-5">
        {docs.map((d) => (
          <li key={d.id}>{d.file_name}</li>
        ))}
      </ul>
    </div>
  );
}