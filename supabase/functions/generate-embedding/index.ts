import { serve } from 'https-deno.land/std@0.168.0/http/server.ts'
import { pipeline } from 'https-esm.sh/@xenova/transformers@2.17.1'

// Create a singleton pipeline instance to avoid reloading the model on every call
const extractor = await pipeline('feature-extraction', 'Xenova/gte-small');

serve(async (req) => {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Missing "text" property in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate the embedding from the text
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    
    // Extract the embedding vector
    const embedding = Array.from(output.data);

    return new Response(
      JSON.stringify({ embedding }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});