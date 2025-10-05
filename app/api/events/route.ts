import { NextResponse, type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server'; // Use the helper from server.ts

export async function GET(request: NextRequest) {
  console.log('[/api/events] GET request received');
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('case_id');
    const supabase = createServiceClient(); // Create the client using the helper

    if (!caseId) {
      return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('case_id', caseId)
      .order('event_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ events: data });
  } catch (error: any) {
    console.error('[/api/events] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('[/api/events] POST request received');
  try {
    const supabase = createServiceClient(); // Create the client using the helper

    const body = await request.json();
    const { case_id, title, event_date, ...otherFields } = body;

    if (!case_id || !title || !event_date) {
      return NextResponse.json({ 
        error: 'Missing required fields: case_id, title, and event_date' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        case_id,
        title,
        event_date,
        ...otherFields,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ event: data }, { status: 201 });
  } catch (error: any) {
    console.error('[/api/events] POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}