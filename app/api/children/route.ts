import { NextResponse, type NextRequest } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server';

// GET handler to fetch all children for the case
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSSRClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const case_id = searchParams.get('case_id');

    if (!case_id) {
      return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('case_id', case_id)
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
    const supabase = await createSSRClient();

    const body = await request.json();
    const { name, date_of_birth, case_id, ...otherFields } = body;

    if (!name || !date_of_birth || !case_id) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, date_of_birth, and case_id' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('children')
      .insert({
        case_id,
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