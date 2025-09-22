import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';

const performWeaknessAnalysis = async (documentContent: string): Promise<string> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an AI legal analyst. Your task is to review the following document and identify potential weaknesses in the legal arguments and factual claims. Provide a clear, actionable report with suggestions for improvement.

  Document Content:
  "${documentContent}"

  Based on the content, generate a report that includes:
  1. A list of potential factual gaps or missing evidence.
  2. A breakdown of legal arguments that could be challenged by opposing counsel.
  3. Suggestions for strengthening the weak points with additional facts or legal research.
  4. A confidence score for each weakness identified.

  Format the output as an easy-to-read, professional report.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    });

    const analysisReport = completion.choices[0]?.message?.content;
    
    if (!analysisReport) {
      throw new Error('Empty response from OpenAI');
    }

    return analysisReport;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentContent } = body;

    if (!documentContent || typeof documentContent !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid document content' },
        { status: 400 }
      );
    }

    if (documentContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'Document content cannot be empty' },
        { status: 400 }
      );
    }

    const analysisReport = await performWeaknessAnalysis(documentContent);
    
    return NextResponse.json({ report: analysisReport }, { status: 200 });
  } catch (error: unknown) {
    console.error("Weakness Analysis API Error:", error);
    
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
      { error: 'Failed to perform weakness analysis.' },
      { status: 500 }
    );
  }
}