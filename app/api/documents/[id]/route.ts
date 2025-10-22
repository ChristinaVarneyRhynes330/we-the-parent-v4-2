import { createSSRClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSSRClient();

  const { id } = params;
  // FIX: Added line to read the updates from the request body
  const updates = await req.json(); 


  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// FIX: Prefixed req with underscore to suppress 'req is declared but its value is never read'
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSSRClient();

  const { id } = params;

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}