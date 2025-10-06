import { createSSRClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { pipeline } from '@xenova/transformers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const supabase = await createSSRClient();

  const lastMessage = messages[messages.length - 1];
  const userQuery = lastMessage.content;

  // 1. Generate an embedding for the user's query
  const extractor = await pipeline('feature-extraction', 'Xenova/gte-small');
  const output = await extractor(userQuery, { pooling: 'mean', normalize: true });
  const query_embedding = Array.from(output.data);

  // 2. Query Supabase for relevant document chunks
  const { data: chunks, error: rpcError } = await supabase.rpc('match_document_chunks', {
    query_embedding,
    match_threshold: 0.7,
    match_count: 5,
  });

  if (rpcError) {
    console.error('RPC Error:', rpcError);
    return NextResponse.json({ error: 'Failed to fetch relevant documents.' }, { status: 500 });
  }

  // 3. Construct the context string
  const context = chunks.map((c: any) => c.content).join('\n\n');

  // 4. Construct the new prompt
  const prompt = `You are a helpful legal assistant. Answer the user's question based *only* on the following context from their case documents. If the answer is not in the context, say 'I cannot find the answer in the provided documents.'

Context:
${context}

Question: ${userQuery}`;

  // 5. Create a new messages array with the new prompt
  const newMessages = [
    ...messages.slice(0, -1),
    { role: 'user', content: prompt },
  ];

  try {
    const result = await streamText({
      model: openai('gpt-4o'),
      messages: newMessages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message.' },
      { status: 500 }
    );
  }
}