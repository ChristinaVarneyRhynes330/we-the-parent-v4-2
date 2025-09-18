import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UploadedDoc = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
};

export function useDocuments(caseId: string) {
  const supabase = createClient();
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from<UploadedDoc>('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setDocuments(data || []);
      }

      setLoading(false);
    };

    fetchDocuments();
  }, [caseId, supabase]);

  return { documents, loading, error };
}