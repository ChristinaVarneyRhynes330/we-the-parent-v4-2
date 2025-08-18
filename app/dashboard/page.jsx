'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import the Link component
import { createClient } from '../lib/supabase/client';
import { Scale } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const userName = 'Christina';

  const [caseNumber, setCaseNumber] = useState('');
  const [caseName, setCaseName] = useState('');
  const [status, setStatus] = useState('Active');
  const [message, setMessage] = useState('');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCases = async () => {
      const { data, error } = await supabase.from('cases').select('*');
      if (error) {
        console.error('Error fetching cases:', error);
      } else {
        setCases(data);
      }
      setLoading(false);
    };
    getCases();
  }, [supabase]);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    setMessage('');
    const { data, error } = await supabase
      .from('cases')
      .insert([{ case_number: caseNumber, case_name: caseName, status: status }])
      .select();
    if (error) {
      setMessage('Error: Could not save the case.');
    } else {
      setMessage('Success! Case created.');
      setCases(prevCases => [...prevCases, ...data]);
      setCaseNumber('');
      setCaseName('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="space-y-8" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-slate-700">Welcome back, {userName}</h1></div>
          <Scale className="h-20 w-20 text-slate-400" />
        </div>
      </div>

      {/* Create New Case Form */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Create a New Case</h2>
        <form onSubmit={handleCreateCase} className="space-y-4">
          <div>
            <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700">Case Number</label>
            <input type="text" id="caseNumber" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="caseName" className="block text-sm font-medium text-gray-700">Case Name (optional)</label>
            <input type="text" id="caseName" value={caseName} onChange={(e) => setCaseName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Save Case</button>
          {message && <p className="text-center mt-4">{message}</p>}
        </form>
      </div>

      {/* Case List Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Your Cases</h2>
        {loading ? <p>Loading cases...</p> : (
          <div className="space-y-3">
            {cases.map((caseItem) => (
              // This is the new part: wrap the case item in a Link
              <Link href={`/case/${caseItem.id}`} key={caseItem.id}>
                <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center hover:bg-slate-100 cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-800">{caseItem.case_number}</p>
                    <p className="text-sm text-slate-600">{caseItem.case_name}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">{caseItem.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>
    </div>
  );
};