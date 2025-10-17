// FILE: app/api/chat/route.ts
// Replace the entire file with this fixed version

import { createServiceClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { pipeline } from '@xenova/transformers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const supabase = createServiceClient();

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content;

    console.log('[Chat API] User query:', userQuery);

    // 1. Generate embedding for the query
    let query_embedding;
    try {
      const extractor = await pipeline('feature-extraction', 'Xenova/gte-small');
      const output = await extractor(userQuery, { pooling: 'mean', normalize: true });
      query_embedding = Array.from(output.data);
      console.log('[Chat API] Generated embedding, length:', query_embedding.length);
    } catch (embeddingError) {
      console.error('[Chat API] Embedding generation failed:', embeddingError);
      // Continue without RAG if embedding fails
      query_embedding = null;
    }

    // 2. Try to find relevant document chunks
    let context = '';
    if (query_embedding) {
      try {
        // First, get the active case ID from the first case (single user mode)
        const { data: cases } = await supabase
          .from('cases')
          .select('id')
          .limit(1)
          .single();

        if (cases) {
          const { data: chunks, error: rpcError } = await supabase.rpc('match_document_chunks', {
            p_case_id: cases.id,
            p_query_embedding: query_embedding,
            p_match_threshold: 0.5, // Lower threshold for better recall
            p_match_count: 5,
          });

          if (rpcError) {
            console.error('[Chat API] RPC Error:', rpcError);
          } else if (chunks && chunks.length > 0) {
            context = chunks.map((c: any) => c.content).join('\n\n');
            console.log('[Chat API] Found', chunks.length, 'relevant chunks');
          } else {
            console.log('[Chat API] No relevant chunks found');
          }
        }
      } catch (searchError) {
        console.error('[Chat API] Document search failed:', searchError);
      }
    }

    // 3. Construct the prompt
    const systemPrompt = context 
      ? `You are a helpful legal assistant for Florida juvenile dependency cases. Answer the user's question based on the following context from their case documents. If the answer is not in the context, say so and provide general guidance.

Context from documents:
${context}

Question: ${userQuery}`
      : `You are a helpful legal assistant for Florida juvenile dependency cases. The user hasn't uploaded any documents yet, so provide general guidance based on Florida law and procedures.

Question: ${userQuery}`;

    // 4. Create new messages array
    const newMessages = [
      { role: 'system', content: 'You are a helpful legal assistant specializing in Florida juvenile dependency law. Provide accurate, helpful information while reminding users you are not a licensed attorney.' },
      ...messages.slice(0, -1),
      { role: 'user', content: systemPrompt },
    ];

    console.log('[Chat API] Calling OpenAI with context length:', context.length);

    // 5. Stream the response
    const result = await streamText({
      model: openai('gpt-4o'),
      messages: newMessages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('[Chat API] Fatal error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message. Please try again.' },
      { status: 500 }
    );
  }
}