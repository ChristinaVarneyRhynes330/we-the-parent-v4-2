import { createSSRClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET all narrative entries for a case
export async function GET(req: NextRequest) {
  console.log('[/api/narrative] GET request received');
  try {
    const supabase = await createSSRClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('case_id');

    if (!caseId) {
      return NextResponse.json({ error: 'Missing case_id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('narrative_entries')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entries: data });
  } catch (error: any) {
    console.error('[/api/narrative] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new narrative entry
export async function POST(req: NextRequest) {
  console.log('[/api/narrative] POST request received');
  try {
    const supabase = await createSSRClient();

    const { case_id, content } = await req.json();

    if (!case_id || !content) {
      return NextResponse.json({ error: 'Missing case_id or content' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('narrative_entries')
      .insert([{ case_id, content }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[/api/narrative] POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}