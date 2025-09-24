'use client';

import { useState } from 'react';
import { Evidence } from '@/types'; // Import the Evidence type

// Define an interface for the component's props
interface EvidenceUploaderProps {
  onUploadSuccess: (newEvidence: Evidence) => void;
  caseId: string | null;
}

export default function EvidenceUploader({ onUploadSuccess, caseId }: EvidenceUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    if (!caseId) {
      setError('Case ID is missing. Cannot upload file.');
      return;
    }
    
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);

    const response = await fetch('/api/evidence', {
      method: 'POST',
      body: formData,
    });

    setIsUploading(false);

    if (response.ok) {
      const newEvidence = await response.json();
      onUploadSuccess(newEvidence);
      setFile(null); 
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Failed to upload file.');
    }
  };

  return (
    <div className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Upload New Evidence</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-700">
            Select file
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!file || isUploading}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}