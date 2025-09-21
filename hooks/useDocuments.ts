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

export function useDocuments(caseId: string | null) {
  const supabase = createClient();
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) {
      setLoading(false);
      return;
    }

    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error.message);
        setError(error.message);
      } else {
        setDocuments(data || []);
      }
      
      setLoading(false);
    };

    fetchDocuments();
    // FIX: Added `supabase` to the dependency array to satisfy the linter rule.
  }, [caseId, supabase]);

  return { documents, loading, error };
}