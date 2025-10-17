'use client';

import { useState } from 'react';

export default function GALConflictCheckerPage() {
  const [name, setName] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!name) {
      setResult('Please enter a name to check.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/gal-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check for conflicts');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      setResult(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="mb-2 text-3xl font-bold">GAL Conflict Checker</h1>
      <p className="mb-8 text-lg text-gray-600">Enter the name of a Guardian Ad Litem to check for potential conflicts of interest.</p>
      
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter GAL's full name"
          className="form-input flex-grow"
        />
        <button onClick={handleCheck} disabled={loading} className="button-primary">
          {loading ? 'Checking...' : 'Check for Conflicts'}
        </button>
      </div>

      {result && (
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Analysis Result</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}