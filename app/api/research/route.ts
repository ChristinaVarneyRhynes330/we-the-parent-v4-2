import { NextRequest, NextResponse } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server';
import { pipeline } from '@xenova/transformers';
import { OpenAI } from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { query, caseId } = await req.json();
  const supabase = await createSSRClient();

  if (!query || !caseId) {
    return NextResponse.json({ error: 'Query and caseId are required.' }, { status: 400 });
  }

  // 1. Generate an embedding for the user's query
  const extractor = await pipeline('feature-extraction', 'Xenova/gte-small');
  const output = await extractor(query, { pooling: 'mean', normalize: true });
  const query_embedding = Array.from(output.data);

  // 2. Query Supabase for relevant document chunks for the specific case
  const { data: chunks, error: rpcError } = await supabase.rpc('match_document_chunks', {
    p_case_id: caseId,
    p_query_embedding: query_embedding,
    p_match_threshold: 0.7,
    p_match_count: 10, // Get more chunks for research
  });

  if (rpcError) {
    console.error('RPC Error:', rpcError);
    return NextResponse.json({ error: 'Failed to fetch relevant documents.' }, { status: 500 });
  }

  // 3. Construct the context string and prepare for citation
  const context = chunks.map((c: any) => `Source: [Document ID: ${c.document_id}]\nContent: ${c.content}`).join('\n\n---\n\n');

  // 4. Construct the new prompt for a detailed research answer
  const prompt = `You are a legal research assistant. Your task is to provide a detailed answer to the user's query based *only* on the provided document excerpts. Structure your response as follows:
1.  **Direct Answer:** A clear and concise answer to the query.
2.  **Detailed Explanation:** A thorough explanation of the answer, synthesizing information from the provided sources.
3.  **Citations:** A list of the source documents you used to formulate the answer, formatted in Bluebook style. Use the Document IDs from the context to cite.

Context from case documents:
${context}

User's Query: "${query}"`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = response.choices[0].message.content;

    return NextResponse.json({ results: result, citations: 'Citations will be part of the result.' });
  } catch (error) {
    console.error('Research API Error:', error);
    return NextResponse.json(
      { error: 'Failed to perform research.' },
      { status: 500 }
    );
  }
}
