import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  // In a real implementation, you would fetch data from a live table.
  // For now, we will return the mock data directly from the server.
  const mockCaseData = {
    caseSummary: {
      caseName: "Doe v. State of Florida",
      caseNumber: "2024-DP-000587-XXDP-BC",
      filingDate: "January 15, 2024",
      status: "Active",
      progress: 65,
      nextHearing: "March 15, 2025",
    },
    documentSummary: {
      totalDocuments: 8,
      drafts: 2,
      filed: 4,
      processing: 2,
      recentDraft: "Motion for Increased Visitation",
    },
    upcomingDeadlines: [
      { id: 1, title: 'Adjudicatory Hearing', date: 'March 15, 2025', daysRemaining: 3, type: 'critical' },
      { id: 2, title: 'Case Plan Review', date: 'March 25, 2025', daysRemaining: 13, type: 'important' },
    ],
  };

  return NextResponse.json(mockCaseData);
}