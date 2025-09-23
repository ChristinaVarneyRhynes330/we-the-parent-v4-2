import { NextResponse, type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9'; // Hardcoded for now

// GET handler to fetch all children for the case
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('case_id', CASE_ID)
      .order('date_of_birth', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ children: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler to create a new child record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, date_of_birth, ...otherFields } = body;

    if (!name || !date_of_birth) {
      return NextResponse.json({ 
        error: 'Missing required fields: name and date_of_birth' 
      }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('children')
      .insert({
        case_id: CASE_ID,
        name,
        date_of_birth,
        ...otherFields,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ child: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}