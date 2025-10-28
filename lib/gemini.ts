// FILE: lib/gemini.ts
// COMPLETE REPLACEMENT

import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn("Warning: No Gemini API key found. AI features will not work.");
}

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const CHAT_MODEL = "gemini-2.0-flash-exp";

interface ChatMessage {
  role: 'user' | 'assistant' | 'model' | 'system';
  content: string;
}

export async function generateGeminiChatStream(
  history: ChatMessage[],
  newMessage: string,
  caseContext: string
): Promise<ReadableStream<Uint8Array>> {
  
  const systemInstruction = `You are a sophisticated, supportive, and precise AI legal assistant 
    for a pro se parent in a Florida juvenile dependency case. Use the provided case 
    facts ONLY when directly relevant to the user's query. The case facts are: 
    ${caseContext}`;

  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  contents.push({
    role: 'user',
    parts: [{ text: newMessage }],
  });

  const model = genAI.getGenerativeModel({ 
    model: CHAT_MODEL,
    systemInstruction: systemInstruction,
  });
  
  const result = await model.generateContentStream({
    contents: contents,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return stream;
}

// Export for backward compatibility
export const gemini = genAI;