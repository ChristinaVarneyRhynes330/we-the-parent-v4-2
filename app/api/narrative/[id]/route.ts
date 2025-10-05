import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// PATCH an existing narrative entry
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('[/api/narrative/[id]] PATCH request received');
  try {
    const supabase = createClient();
    const { id } = params;
    const { content } = await req.json();

    if (!content) {
      return new NextResponse(JSON.stringify({ error: 'Missing content' }), { status: 400 });
    }

    const { data, error } = await supabase
      .from('narrative_entries')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[/api/narrative/[id]] PATCH error:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// DELETE a narrative entry
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('[/api/narrative/[id]] DELETE request received');
  try {
    const supabase = createClient();
    const { id } = params;

    const { error } = await supabase.from('narrative_entries').delete().eq('id', id);

    if (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('[/api/narrative/[id]] DELETE error:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}