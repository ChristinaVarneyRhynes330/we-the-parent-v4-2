import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY!,
  baseURL: process.env.AI_API_BASE!, // Groq or OpenRouter
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'mixtral-8x7b-32768', // Groq free model
      messages: [
        {
          role: 'system',
          content:
            'You are We The Parent, an AI legal assistant for Florida juvenile dependency cases. You cannot give legal advice, but you can provide general legal information and guidance on using the platform.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const aiReply = completion.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ response: aiReply });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}