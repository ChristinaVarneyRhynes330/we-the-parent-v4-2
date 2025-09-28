import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

// Assuming types are defined in @/types/index.ts
// You might need to create/update these types
export interface Predicate {
  id: string;
  case_id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface Evidence {
  id: string;
  name: string;
  type: string;
  url: string;
}

export function usePredicates(caseId: string) {
  const supabase = createClient();
  const [predicates, setPredicates] = useState<Predicate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPredicates = useCallback(async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('predicates')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPredicates(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, caseId]);

  useEffect(() => {
    fetchPredicates();
  }, [fetchPredicates]);

  const linkEvidence = async (predicateId: string, evidenceId: string) => {
    if (!predicateId || !evidenceId) return;
    try {
      const { error } = await supabase
        .from('predicate_evidence_links')
        .insert({ predicate_id: predicateId, evidence_id: evidenceId, created_by: (await supabase.auth.getUser()).data.user?.id });

      if (error) {
        // Handle potential unique constraint violation gracefully
        if (error.code === '23505') {
          console.log('This link already exists.');
          return { success: true, message: 'Link already exists.' };
        } else {
          throw error;
        }
      }
      return { success: true };
    } catch (err: any) {
      console.error('Error linking evidence:', err);
      return { success: false, message: err.message };
    }
  };

  return { predicates, loading, error, linkEvidence, refetchPredicates: fetchPredicates };
}
