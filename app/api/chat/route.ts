// FILE: app/api/chat/route.ts
// UPDATED - Improved RAG context retrieval with better error handling

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
      console.log('[Chat API] Generated query embedding, length:', query_embedding.length);
    } catch (embeddingError) {
      console.error('[Chat API] Embedding generation failed:', embeddingError);
      query_embedding = null;
    }

    // 2. Try to find relevant document chunks
    let context = '';
    let sourcesFound = 0;

    if (query_embedding) {
      try {
        // Get the active case ID from the first case (single user mode)
        const { data: cases } = await supabase
          .from('cases')
          .select('id')
          .limit(1)
          .single();

        if (cases) {
          console.log('[Chat API] Searching documents for case:', cases.id);

          const { data: chunks, error: rpcError } = await supabase.rpc('match_document_chunks', {
            p_case_id: cases.id,
            p_query_embedding: query_embedding,
            p_match_threshold: 0.4, // Lower threshold for better recall
            p_match_count: 8, // Get more chunks for richer context
          });

          if (rpcError) {
            console.error('[Chat API] RPC Error:', rpcError);
          } else if (chunks && chunks.length > 0) {
            context = chunks
              .map((c: any, idx: number) => `[Source ${idx + 1}]\n${c.content}`)
              .join('\n\n---\n\n');
            sourcesFound = chunks.length;
            console.log('[Chat API] Found', sourcesFound, 'relevant chunks');
          } else {
            console.log('[Chat API] No relevant chunks found');
          }
        }
      } catch (searchError) {
        console.error('[Chat API] Document search failed:', searchError);
      }
    }

    // 3. Construct the system prompt based on whether we found context
    let systemPrompt;
    
    if (context && sourcesFound > 0) {
      systemPrompt = `You are a helpful legal assistant for Florida juvenile dependency cases. Answer the user's question based on the following context from their case documents. If the context doesn't contain enough information to fully answer the question, say so and provide general guidance based on Florida law.

IMPORTANT: When referencing information from the context, indicate which source you're using (e.g., "According to Source 1..." or "Based on the documents provided...").

Context from case documents:
${context}

User question: ${userQuery}`;
    } else {
      systemPrompt = `You are a helpful legal assistant for Florida juvenile dependency cases. The user hasn't uploaded any relevant documents yet, or their question isn't related to their uploaded documents. Provide general guidance based on Florida law and juvenile dependency procedures.

IMPORTANT: Remind the user that you don't have access to their specific case documents for this query, but you can provide general legal information.

User question: ${userQuery}`;
    }

    // 4. Create messages array for the AI
    const aiMessages = [
      { 
        role: 'system' as const, 
        content: 'You are a helpful legal assistant specializing in Florida juvenile dependency law. Provide accurate, helpful information while reminding users you are not a licensed attorney and they should consult with legal counsel for specific advice.' 
      },
      ...messages.slice(0, -1), // Include conversation history
      { role: 'user' as const, content: systemPrompt },
    ];

    console.log('[Chat API] Calling OpenAI with', sourcesFound, 'context sources');

    // 5. Stream the response
    const result = await streamText({
      model: openai('gpt-4o'),
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('[Chat API] Fatal error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}