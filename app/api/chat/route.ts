import { NextRequest, NextResponse } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server'; 
import { generateGeminiChatStream } from '@/lib/gemini';

/**
 * Generates an embedding for the query text using OpenAI
 */
async function generateQueryEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate query embedding');
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Fetches relevant case context using RAG (Retrieval-Augmented Generation)
 */
async function fetchCaseContext(caseId: string, query: string): Promise<string> {
  const supabase = await createSSRClient();
  
  try {
    // Step 1: Generate embedding for the user's query
    console.log('[RAG] Generating query embedding...');
    const queryEmbedding = await generateQueryEmbedding(query);
    
    // Step 2: Search for similar document chunks
    console.log('[RAG] Searching document chunks...');
    const { data: chunks, error } = await supabase.rpc('match_document_chunks', {
      p_case_id: caseId,
      p_query_embedding: queryEmbedding,
      p_match_threshold: 0.7,
      p_match_count: 5
    });

    if (error) {
      console.error('[RAG Error]:', error);
      return `Unable to retrieve case context. Error: ${error.message}`;
    }

    if (!chunks || chunks.length === 0) {
      return 'No relevant case documents found for this query. I can still provide general legal guidance.';
    }

    // Step 3: Format the context for the AI
    console.log(`[RAG] Found ${chunks.length} relevant chunks`);
    const context = chunks
      .map((chunk: any, idx: number) => 
        `[Document ${idx + 1}] ${chunk.content}`
      )
      .join('\n\n---\n\n');
    
    return context;
    
  } catch (error) {
    console.error('[RAG Pipeline Error]:', error);
    return 'RAG system encountered an error. Providing general guidance only.';
  }
}

/**
 * Main API handler for AI chat with RAG
 */
export async function POST(req: NextRequest) {
  try {
    const { caseId, history, newMessage } = await req.json();

    // Validation
    if (!caseId || !newMessage) {
      return NextResponse.json(
        { error: 'Missing required fields: caseId and newMessage' }, 
        { status: 400 }
      );
    }

    console.log('[Chat API] Processing message for case:', caseId);

    // Retrieve relevant case context using RAG
    const caseContext = await fetchCaseContext(caseId, newMessage);
    console.log('[Chat API] Context retrieved, generating response...');

    // Generate streaming AI response
    const stream = await generateGeminiChatStream(
      history || [], 
      newMessage, 
      caseContext
    );

    // Return the stream
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('[Chat API Error]:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { error: 'AI Service not configured. Please set GEMINI_API_KEY.' }, 
          { status: 500 }
        );
      }
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'Embedding service not configured. Please set OPENAI_API_KEY.' }, 
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during chat processing.' },
      { status: 500 }
    );
  }
}