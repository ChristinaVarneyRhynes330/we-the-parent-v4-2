// File: lib/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "@/types"; 

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the cost-effective model, prioritizing speed/low-cost
const CHAT_MODEL = "gemini-2.5-flash"; 

/**
 * Generates a streaming chat response using RAG context.
 * * @param history The preceding messages in the conversation thread.
 * @param newMessage The latest user message.
 * @param caseContext Relevant facts retrieved from your Evidence Binder (RAG).
 * @returns A standard ReadableStream for use with Next.js API Routes.
 */
export async function generateGeminiChatStream(
  history: ChatMessage[],
  newMessage: string,
  caseContext: string
): Promise<ReadableStream<Uint8Array>> {
  
  // 1. Construct the system instruction, injecting the RAG context for grounding.
  const systemInstruction = `You are a sophisticated, supportive, and precise AI legal assistant 
    for a pro se parent in a Florida juvenile dependency case. Use the provided case 
    facts ONLY when directly relevant to the user's query. The case facts are: 
    ${caseContext}`;

  // 2. Map your internal ChatMessage types to the Google SDK format
  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : msg.role, // Gemini uses 'model' for assistant
    parts: [{ text: msg.content }],
  }));

  // 3. Add the new user message
  contents.push({
    role: 'user',
    parts: [{ text: newMessage }],
  });

  // --- FIX: Get the model instance first, then call the streaming method ---
  const model = genAI.getGenerativeModel({ model: CHAT_MODEL });
  
  const responseStream = await model.generateContentStream({ 
    contents: contents,
    config: {
        systemInstruction: systemInstruction,
    },
  });
  // -------------------------------------------------------------------------

  // 5. Convert the Gemini Stream to a standard Web ReadableStream for Next.js
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          controller.enqueue(new TextEncoder().encode(text));
        }
      }
      controller.close();
    },
  });

  return stream;
}