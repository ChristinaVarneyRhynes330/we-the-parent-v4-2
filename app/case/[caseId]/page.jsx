'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client'; // Note the '../../'
import Link from 'next/link';

export default function CasePage({ params }) {
  const supabase = createClient();
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCaseDetails = async () => {
      // params.caseId gets the ID from the URL
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', params.caseId) // Fetch only the case with this ID
        .single(); // We only expect one result

      if (error) {
        console.error('Error fetching case details:', error);
      } else {
        setCaseDetails(data);
      }
      setLoading(false);
    };

    if (params.caseId) {
      getCaseDetails();
    }
  }, [supabase, params.caseId]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading case details...</div>;
  }

  if (!caseDetails) {
    return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Case not found.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Link href="/dashboard">
        <div className="text-blue-500 hover:underline mb-4">&larr; Back to Dashboard</div>
      </Link>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-700">{caseDetails.case_number}</h1>
        <p className="text-lg text-slate-600">{caseDetails.case_name}</p>
        <div className="mt-4">
          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">{caseDetails.status}</span>
        </div>
      </div>

      {/* This is where we will add the document uploader and other tools later */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
        <h2 className="text-2xl font-bold text-slate-700">Documents</h2>
        <p className="text-slate-500 mt-4">Document uploader will go here...</p>
      </div>
    </div>
  );
}