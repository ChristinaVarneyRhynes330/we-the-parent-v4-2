import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const case_id = searchParams.get('case_id');

  if (!case_id) {
    return new NextResponse(JSON.stringify({ error: 'case_id is required' }), { status: 400 });
  }

  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('case_id', case_id)
    .order('created_at', { ascending: false });

  if (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new NextResponse(JSON.stringify({ documents }), { status: 200 });
}