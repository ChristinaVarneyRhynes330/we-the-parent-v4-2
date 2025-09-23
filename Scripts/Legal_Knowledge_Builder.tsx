import fetch from 'node-fetch';
import { LegalKnowledgeBuilder } from './Legal_Knowledge_Builder';

type EmbeddingResponse = {
  embedding: number[];
  data?: any;
  error?: string;
};

// Initialize your builder
const builder = new LegalKnowledgeBuilder();

// Export knowledge as flat text chunks
function flattenKnowledge(): string[] {
  const chunks: string[] = [];

  // Loop through federal templates
  Object.values(builder.legalTemplates.federal).forEach((law: any) => {
    chunks.push(law.title);
    if (law.summary) chunks.push(law.summary);
    if (law.keyPoints) chunks.push(...law.keyPoints);
    if (law.trainingPrompts) {
      law.trainingPrompts.forEach((p: any) => {
        chunks.push(p.input);
        chunks.push(p.output);
      });
    }
  });

  // Loop through Florida templates
  Object.values(builder.legalTemplates.florida).forEach((law: any) => {
    chunks.push(law.title);
    if (law.summary) chunks.push(law.summary);
    if (law.sections) chunks.push(...Object.values(law.sections));
    if (law.procedures) {
      Object.values(law.procedures).forEach((proc: any) => {
        chunks.push(proc.timeline || '');
        chunks.push(proc.purpose || '');
        chunks.push(proc.rights || '');
        chunks.push(proc.outcome || '');
      });
    }
    if (law.trainingPrompts) {
      law.trainingPrompts.forEach((p: any) => {
        chunks.push(p.input);
        chunks.push(p.output);
      });
    }
  });

  return chunks.filter(Boolean); // remove empty strings
}

// Main function to push knowledge
async function pushKnowledge() {
  const chunks = flattenKnowledge();

  console.log(`Pushing ${chunks.length} knowledge chunks to embedding function...`);

  for (const [i, text] of chunks.entries()) {
    try {
      const res = await fetch('http://localhost:54321/functions/v1/generate-embedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data: EmbeddingResponse = await res.json();

      if (data.error) {
        console.error(`Chunk ${i} failed:`, data.error);
      } else {
        console.log(`Chunk ${i} stored successfully. Embedding length: ${data.embedding.length}`);
      }
    } catch (err) {
      console.error(`Chunk ${i} error:`, err);
    }
  }

  console.log('All chunks processed.');
}

pushKnowledge();
