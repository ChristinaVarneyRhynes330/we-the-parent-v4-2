import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { pipeline } from 'https://esm.sh/@xenova/transformers@2.17.1';
import { createClient } from 'https://deno.land/x/supabase/mod.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const extractor = await pipeline('feature-extraction', 'Xenova/gte-small');

serve(async (req) => {
  try {
    const { text } = await req.json();
    if (!text) return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 });

    const output = await extractor(text, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);

    // Store in Supabase
    const { data, error } = await supabase.from('embeddings').insert([
      { text, embedding, created_at: new Date().toISOString() },
    ]);
    if (error) throw error;

    return new Response(JSON.stringify({ embedding, data }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
