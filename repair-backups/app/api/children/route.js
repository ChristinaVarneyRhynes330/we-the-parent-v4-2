import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('children')
      .select(`
        *,
        placements(*),
        visits(*),
        alerts(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ children: data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('children')
      .insert([body])
      .select()

    if (error) throw error
    return NextResponse.json({ child: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}