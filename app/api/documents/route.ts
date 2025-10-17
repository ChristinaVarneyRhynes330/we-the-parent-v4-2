import { createSSRClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await createSSRClient();

  const { searchParams } = new URL(req.url);
  const case_id = searchParams.get('case_id');

  if (!case_id) {
    return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
  }

  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('case_id', case_id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents });
}