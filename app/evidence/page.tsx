'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import EvidenceUploader from '@/components/EvidenceUploader';
import EvidenceList from '@/components/EvidenceList';

// Define a type for a single evidence record
interface Evidence {
  id: string;
  file_name: string;
  file_size: number;
  upload_date: string;
  // Add any other properties you expect from your Supabase table
}

export default function EvidencePage() {
  // Explicitly type the evidence state using the Evidence interface
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  // The caseId is now stored in the page's state.
  // The unused 'setCaseId' has been removed.
  const [caseId] = useState('05-2024-DP-000587-XXDP-BC');

  useEffect(() => {
    const fetchEvidence = async () => {
      if (!caseId) {
        setLoading(false);
        return;
      };
      
      setLoading(true);
      const { data, error } = await supabase
        .from('evidence')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching evidence:', error);
      } else if (data) {
        setEvidence(data);
      }
      setLoading(false);
    };

    fetchEvidence();
  }, [supabase, caseId]);

  // Explicitly type the newEvidence parameter
  const handleUploadSuccess = (newEvidence: Evidence) => {
    setEvidence((prevEvidence) => [newEvidence, ...prevEvidence]);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-2 text-3xl font-bold">Evidence Management</h1>
      <p className="mb-8 text-lg text-gray-600">Case: {caseId}</p>
      
      <EvidenceUploader onUploadSuccess={handleUploadSuccess} caseId={caseId} />
      
      {loading ? (
        <p>Loading evidence...</p>
      ) : (
        <EvidenceList initialEvidence={evidence} />
      )}
    </div>
  );
}