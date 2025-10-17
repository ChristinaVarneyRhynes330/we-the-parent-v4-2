import { NextResponse, NextRequest } from 'next/server';
import { checkGALConflict } from '@/lib/ai/analysis';
import { createSSRClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createSSRClient();
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    const conflictResult = await checkGALConflict(name);
    
    return NextResponse.json({ result: conflictResult });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
