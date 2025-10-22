import { NextRequest, NextResponse } from 'next/server';
// FIX: Alias createServiceClient as createClient (solves the createClient error)
import { createServiceClient as createClient } from '@/lib/supabase/server'; 
import { ComplianceIssue, ApiResponse } from '@/types'; 

/**
 * Handles GET request to retrieve all compliance tasks for the current user/case.
 * Purpose: Provides a list of required and completed tasks to the compliance dashboard.
 */
// FIX: Prefixed req with underscore to suppress 'req is declared but its value is never read'
export async function GET(_req: NextRequest): Promise<NextResponse<ApiResponse<ComplianceIssue[]>>> {
  const supabase = createClient();
  
  // NOTE: In a single-user model, we must first authenticate and get the user ID
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized: User not found' }, { status: 401 });
  }

  try {
    // Assuming a simple compliance table structure
    const { data: complianceTasks, error } = await supabase
      .from('compliance')
      .select('*')
      .eq('user_id', user.id) // Assuming a user_id column is present
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error fetching compliance:", error.message);
      return NextResponse.json({ success: false, error: 'Failed to fetch compliance data.' }, { status: 500 });
    }

    // Since the database returns standard data, we cast it to our typed array.
    return NextResponse.json({ success: true, data: complianceTasks as ComplianceIssue[] });

  } catch (e) {
    console.error("Server error during compliance GET:", e);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * Handles POST request to create a new compliance task.
 * Purpose: Allows the user to input requirements from their court-ordered case plan.
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<ComplianceIssue>>> {
    const supabase = createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized: User not found' }, { status: 401 });
    }

    try {
        const body = await req.json();
        // Assuming the incoming body has required fields like case_id, description, status, etc.
        const newComplianceTask = {
            ...body,
            user_id: user.id,
            // Ensure necessary fields are aligned with your Supabase schema (e.g., case_id)
        };

        const { data, error } = await supabase
            .from('compliance')
            .insert([newComplianceTask])
            .select()
            .single();

        if (error) {
            console.error("Supabase error creating compliance task:", error.message);
            return NextResponse.json({ success: false, error: 'Failed to create compliance task.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: data as ComplianceIssue });

    } catch (e) {
        console.error("Server error during compliance POST:", e);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}