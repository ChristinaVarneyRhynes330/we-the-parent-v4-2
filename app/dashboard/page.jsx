'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client'; // Correct import
import { Scale } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient(); // Correctly create the client here
  const userName = 'Christina';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-700">Welcome back, {userName}</h1>
          </div>
          <Scale className="h-20 w-20 text-slate-400" />
        </div>
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>
    </div>
  );
};