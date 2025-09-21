import { NextResponse, type NextRequest } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server'; // Using the server client

// GET handler to fetch all events for a given case
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get('case_id');

  if (!caseId) {
    return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
  }

  const supabase = await createSSRClient();
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('case_id', caseId)
      .order('event_date', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ events: data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

// POST handler to create a new event
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { case_id, title, event_type, event_date, notes } = body;

  // Basic validation for required fields
  if (!case_id || !title || !event_date) {
    return NextResponse.json({ error: 'Missing required fields: case_id, title, and event_date' }, { status: 400 });
  }

  const supabase = await createSSRClient();
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        case_id,
        title,
        event_type,
        event_date,
        notes,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ event: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}