import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize the embedding model (lazy-loaded on first request)
let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    console.log('[Embedding] Loading OpenAI text-embedding-3-small model via API...');
    // Note: For production, we'll use OpenAI API instead of @xenova/transformers
    // to get 1536-dimensional embeddings that match the unified schema
  }
  return extractor;
}

interface ChunkPayload {
  document_id: string;
  content: string;
  checksum: string;
  chunk_index?: number;
}

interface RequestBody {
  chunks: ChunkPayload[];
  embedding_model?: string; // 'openai' | 'xenova'
}

/**
 * Generate embedding using OpenAI API
 */
async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Generate embedding using Xenova/transformers (384-dim, faster but less accurate)
 */
async function generateXenovaEmbedding(text: string): Promise<number[]> {
  if (!extractor) {
    const { pipeline } = await import('https://esm.sh/@xenova/transformers@2.17.1');
    extractor = await pipeline('feature-extraction', 'Xenova/gte-small');
  }
  
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

serve(async (req) => {
  // CORS headers for browser requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse request body
    const body: RequestBody = await req.json();
    
    if (!body.chunks || !Array.isArray(body.chunks)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: chunks array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const useOpenAI = body.embedding_model === 'openai' || !body.embedding_model;
    console.log(`[Embedding] Processing ${body.chunks.length} chunks using ${useOpenAI ? 'OpenAI' : 'Xenova'}`);

    const results = [];
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < body.chunks.length; i++) {
      const chunk = body.chunks[i];
      
      try {
        // Validate chunk data
        if (!chunk.document_id || !chunk.content || !chunk.checksum) {
          console.error('[Embedding] Invalid chunk data:', chunk);
          errorCount++;
          continue;
        }

        // Check if this chunk already exists (deduplication by checksum)
        const { data: existing, error: checkError } = await supabase
          .from('document_chunks')
          .select('id')
          .eq('document_id', chunk.document_id)
          .eq('checksum', chunk.checksum)
          .maybeSingle();

        if (checkError) {
          console.error('[Embedding] Error checking for existing chunk:', checkError);
        }

        if (existing) {
          console.log(`[Embedding] Skipping duplicate chunk (checksum: ${chunk.checksum.substring(0, 8)}...)`);
          skippedCount++;
          continue;
        }

        // Generate embedding based on selected model
        console.log(`[Embedding] Generating embedding for chunk ${processedCount + 1}/${body.chunks.length}`);
        const embedding = useOpenAI 
          ? await generateOpenAIEmbedding(chunk.content)
          : await generateXenovaEmbedding(chunk.content);

        // Estimate token count (rough approximation: 1 token ≈ 4 characters)
        const tokenCount = Math.ceil(chunk.content.length / 4);

        // Insert chunk with embedding into database
        const { data: inserted, error: insertError } = await supabase
          .from('document_chunks')
          .insert({
            document_id: chunk.document_id,
            content: chunk.content,
            embedding: embedding,
            checksum: chunk.checksum,
            chunk_index: chunk.chunk_index !== undefined ? chunk.chunk_index : i,
            token_count: tokenCount,
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('[Embedding] Error inserting chunk:', insertError);
          errorCount++;
          continue;
        }

        results.push({
          chunk_id: inserted.id,
          checksum: chunk.checksum,
          chunk_index: chunk.chunk_index !== undefined ? chunk.chunk_index : i,
          embedding_length: embedding.length,
          token_count: tokenCount,
        });

        processedCount++;
      } catch (chunkError) {
        console.error('[Embedding] Error processing chunk:', chunkError);
        errorCount++;
      }
    }

    // Update document status to 'ready' if we processed any chunks
    if (processedCount > 0 && body.chunks.length > 0) {
      const documentId = body.chunks[0].document_id;
      const { error: updateError } = await supabase
        .from('documents')
        .update({ status: 'ready', updated_at: new Date().toISOString() })
        .eq('id', documentId);

      if (updateError) {
        console.error('[Embedding] Error updating document status:', updateError);
      }
    }

    console.log(`[Embedding] Completed: ${processedCount} processed, ${skippedCount} skipped, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        skipped: skippedCount,
        errors: errorCount,
        results: results,
        model: useOpenAI ? 'openai/text-embedding-3-small' : 'xenova/gte-small',
        embedding_dimension: useOpenAI ? 1536 : 384,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('[Embedding] Fatal error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to process embeddings',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});