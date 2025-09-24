import { NextResponse, type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

// DELETE handler to remove an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceClient();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ 
        error: 'Event ID is required' 
      }, { status: 400 });
    }

    // Delete the event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ 
      message: 'Event deleted successfully' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Delete Event API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete event' 
    }, { status: 500 });
  }
}

// PUT handler to update an event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceClient();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ 
        error: 'Event ID is required' 
      }, { status: 400 });
    }

    const body = await request.json();
    const { case_id, title, event_date, event_type, description, location, notes } = body;

    // Validate required fields
    if (!title || !event_date || !event_type) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, event_date, and event_type' 
      }, { status: 400 });
    }

    // Update the event
    const { data, error } = await supabase
      .from('events')
      .update({
        title,
        event_date,
        event_type,
        description: description || null,
        location: location || null,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      event: data,
      message: 'Event updated successfully' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Update Event API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update event' 
    }, { status: 500 });
  }
}

// GET handler to fetch a specific event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceClient();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ 
        error: 'Event ID is required' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          error: 'Event not found' 
        }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ event: data });

  } catch (error: any) {
    console.error('Get Event API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch event' 
    }, { status: 500 });
  }
}