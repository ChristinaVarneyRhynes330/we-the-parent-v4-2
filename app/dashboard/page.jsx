'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase/client';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '5rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Welcome to Your Dashboard</h1>
      <p>You are successfully logged in.</p>
      <p>This is where your legal tools and case management features will live.</p>
      <button 
        onClick={handleLogout} 
        style={{ marginTop: '2rem', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Log Out
      </button>
    </div>
  );
}