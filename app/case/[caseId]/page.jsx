'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import Link from 'next/link';

export default function CasePage({ params }) {
  const supabase = createClient();
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // New state for the file uploader
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getCaseDetails = async () => {
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
      getCaseDetails();
    }
  }, [supabase, params.caseId]);

  // This function runs when a user selects a file
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage('');
    }
  };

  // This function runs when the "Upload" button is clicked
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    setMessage('');

    const { error } = await supabase.storage
      .from('case-documents') // The name of your bucket
      .upload(`public/${selectedFile.name}`, selectedFile); // Uploads the file to a 'public' folder

    setUploading(false);

    if (error) {
      console.error('Error uploading file:', error);
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Success! File uploaded.');
      setSelectedFile(null); // Clear the selected file
    }
  };


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

      {/* --- New Document Uploader Section --- */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Upload a Document</h2>
        <div>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {selectedFile && <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>}
          <button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {message && <p className="text-center mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
}