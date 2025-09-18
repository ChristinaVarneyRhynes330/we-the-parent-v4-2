import { NextResponse } from 'next/server';

// If using OpenAI, install: npm install openai
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Add this to your .env.local
});

export async function POST(request: Request) {
  try {
    const { prompt, documents } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    // Optional: include document names in the context
    const docList =
      Array.isArray(documents) && documents.length > 0
        ? `\n\nThe user has uploaded these documents: ${documents
            .map((d: any) => d.file_name)
            .join(', ')}`
        : '';

    // Call OpenAI's Chat Completions API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or gpt-4o, gpt-3.5-turbo, etc.
      messages: [
        {
          role: 'system',
          content:
            'You are We The Parent, an AI legal assistant for Florida juvenile dependency cases. You cannot give legal advice, but you can provide general legal information and guidance on using the platform.',
        },
        {
          role: 'user',
          content: prompt + docList,
        },
      ],
      temperature: 0.7,
    });

    const aiReply = completion.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ response: aiReply });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}