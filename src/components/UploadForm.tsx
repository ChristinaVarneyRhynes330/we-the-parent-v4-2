'use client';

import { useState } from 'react';

export default function UploadForm({ onUpload }: { onUpload?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setStatus('✅ File uploaded successfully!');
      setFile(null);

      if (onUpload) onUpload();
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-slate-gray"
      />
      <button
        type="submit"
        disabled={!file || loading}
        className="button-primary"
      >
        {loading ? 'Uploading...' : 'Upload Document'}
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  );
}