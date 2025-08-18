'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';
import { uploadDocument } from './actions';

export default function CasePage({ params }) {
  const supabase = createClient();
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getCaseDetails = async () => {
      const { data, error } = await supabase.from('cases').select('*').eq('id', params.caseId).single();
      if (error) console.error('Error fetching case details:', error);
      else setCaseDetails(data);
      setLoading(false);
    };
    if (params.caseId) getCaseDetails();
  }, [supabase, params.caseId]);

  const handleSubmit = async (formData) => {
    setMessage('Uploading...');
    const result = await uploadDocument(formData, params.caseId);
    setMessage(result.error ? `Error: ${result.error}` : 'Success! File uploaded.');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;
  if (!caseDetails) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Case not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Link href="/dashboard"><div className="text-blue-500 hover:underline mb-4">&larr; Back to Dashboard</div></Link>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-700">{caseDetails.case_number}</h1>
        <p className="text-lg text-slate-600">{caseDetails.case_name}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Upload a Document</h2>
        <form action={handleSubmit}>
          <input type="file" name="document" required />
          <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md">Upload</button>
          {message && <p className="text-center mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
}