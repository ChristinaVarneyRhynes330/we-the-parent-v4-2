'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import Link from 'next/link';

export default function CasePage({ params }) {
  const supabase = createClient();
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getData = async () => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Get the case details
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', params.caseId)
        .single();

      if (error) {
        console.error('Error fetching case details:', error);
      } else {
        setCaseDetails(data);
      }
      setLoading(false);
    };

    if (params.caseId) {
      getData();
    }
  }, [supabase, params.caseId]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !caseDetails) {
      setMessage('Please select a file and ensure you are logged in.');
      return;
    }

    setUploading(true);
    setMessage('');
    
    // 1. Upload the file to Supabase Storage
    const filePath = `${user.id}/${caseDetails.id}/${selectedFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('case-documents')
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      setMessage(`Error: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    // 2. Get the URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('case-documents')
      .getPublicUrl(filePath);

    // 3. Insert a record into the 'documents' database table
    const { error: dbError } = await supabase
      .from('documents')
      .insert({
        file_name: selectedFile.name,
        storage_url: publicUrl,
        user_id: user.id,
        // We'll need to add a case_id to our documents table later
      });

    setUploading(false);

    if (dbError) {
      console.error('Error saving document to database:', dbError);
      setMessage(`Error saving document record: ${dbError.message}`);
    } else {
      setMessage('Success! File uploaded and recorded.');
      setSelectedFile(null);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;
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
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Upload a Document</h2>
        <div>
          <input type="file" onChange={handleFileChange} />
          {selectedFile && <p className="text-sm mt-2">Selected: {selectedFile.name}</p>}
          <button onClick={handleUpload} disabled={!selectedFile || uploading} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {message && <p className="text-center mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
}