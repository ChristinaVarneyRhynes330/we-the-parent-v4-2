import { NextResponse, type NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.AI_API_KEY });

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();

    // 1. Get an embedding for the user's question from our Edge Function
    const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke('generate-embedding', {
      body: { text: message },
    });
    if (embeddingError) throw embeddingError;

    // 2. Search for relevant document chunks using the database function
    const { data: chunks, error: matchError } = await supabase
      .rpc('match_document_chunks', {
        query_embedding: embeddingData.embedding,
        match_threshold: 0.7, // You can adjust this threshold
        match_count: 5,       // And the number of chunks to retrieve
      });
    
    if (matchError) throw matchError;

    // 3. Construct a prompt with the retrieved context
    const contextText = chunks && chunks.length > 0
      ? chunks.map(c => `- ${c.content}`).join('\n')
      : "No context found.";

    const prompt = `
      You are an AI legal assistant for a pro se parent in a Florida juvenile dependency case.
      Answer the user's question based *only* on the provided context from their case documents.
      Be concise, helpful, and do not provide legal advice. If the context doesn't contain the answer, say "I could not find an answer in your documents."

      Context from documents:
      ---
      ${contextText}
      ---

      User's question:
      ${message}
    `;

    // 4. Call Groq with the augmented prompt
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gemma2-9b-it',
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('Failed to get a response from the AI.');

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}