import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';
// REMOVED: import { createSSRClient } from '@/lib/supabase/server';
// This import was unused and causing the build error

const performDocumentAnalysis = async (documentContent: string): Promise<{ documentType: string; summary: string }> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an AI legal document analyst. Analyze the following document content to determine its type and provide a brief summary of its key points. The possible document types are: Motion, Affidavit, Court Order, Letter, Evidence, or Other.
  
  Document Content:
  "${documentContent}"
  
  Based on the content, identify the document type and summarize its main purpose and key facts. Format your response as a JSON object with the keys "documentType" and "summary".`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    try {
      const analysis = JSON.parse(responseText);
      
      // Validate the response structure
      if (!analysis.documentType || !analysis.summary) {
        throw new Error('Invalid response format');
      }

      return {
        documentType: analysis.documentType,
        summary: analysis.summary
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      return {
        documentType: "Other",
        summary: "Could not analyze the document content. Please review manually."
      };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  // REMOVED: const supabase = await createSSRClient();
  // This was declared but never used

  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid document content' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Document content cannot be empty' },
        { status: 400 }
      );
    }

    const analysis = await performDocumentAnalysis(content);
    
    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error: unknown) {
    console.error("Document Analysis API Error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API configuration error' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to analyze document.' },
      { status: 500 }
    );
  }
}