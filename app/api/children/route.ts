import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

// FIX 1: Add non-null assertions (!) to environment variables.
// This tells TypeScript that you are sure these variables will be available.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('children')
      .select(
        `
        *,
        placements(*),
        visits(*),
        alerts(*)
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ children: data });
  } catch (error) {
    // FIX 2: Check the type of the error before accessing its properties.
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

// FIX 3: Add the `NextRequest` type to the request parameter.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('children')
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json({ child: data[0] }, { status: 201 });
  } catch (error) {
    // FIX 4: Check the type of the error before accessing its properties.
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}