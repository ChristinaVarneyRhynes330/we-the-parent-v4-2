import { NextResponse, type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.AI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { case_id } = await request.json();

  if (!case_id) {
    return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
  }
  
  if (!process.env.AI_API_KEY) {
      return NextResponse.json({ 
        error: 'Groq API key not configured' 
      }, { status: 500 });
  }

  try {
    const supabase = createServiceClient();
    const { data: events, error: dbError } = await supabase
      .from('events')
      .select('event_date, title, description')
      .eq('case_id', case_id)
      .order('event_date', { ascending: true });

    if (dbError) throw dbError;

    if (!events || events.length === 0) {
      return NextResponse.json({ narrative: 'No events found for this case. Add events to the timeline to generate a narrative.' });
    }

    const eventsSummary = events
      .map(event => `Date: ${new Date(event.event_date).toLocaleDateString()}\nEvent: ${event.title}\nDetails: ${event.description || 'N/A'}`)
      .join('\n\n');

    const prompt = `
      You are an AI legal assistant for a pro se parent in a Florida juvenile dependency case.
      Your task is to write a clear, professional, and compelling case narrative based on the following timeline of events.
      The narrative should be written in the first person from the parent's perspective.
      Focus on creating a story that highlights progress, compliance, and the parent-child bond.
      Structure the output into logical paragraphs. Do not use bullet points.

      Here are the case events:
      ---
      ${eventsSummary}
      ---

      Based on these events, generate the case narrative.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gemma2-9b-it", // FIX: Using a currently active model
      temperature: 0.7,
    });

    const narrative = completion.choices[0]?.message?.content;

    if (!narrative) {
      throw new Error('Failed to get a response from the AI model.');
    }

    return NextResponse.json({ narrative });

  } catch (error: any) {
    console.error("Narrative Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}