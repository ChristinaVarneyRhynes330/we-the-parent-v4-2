import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const performDocumentAnalysis = async (documentContent) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an AI legal document analyst. Analyze the following document content to determine its type and provide a brief summary of its key points. The possible document types are: Motion, Affidavit, Court Order, Letter, Evidence, or Other.
  
  Document Content:
  "${documentContent}"
  
  Based on the content, identify the document type and summarize its main purpose and key facts. Format your response as a JSON object with the keys "documentType" and "summary".`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }]
  });

  const responseText = completion.choices[0].message.content;

  try {
    const analysis = JSON.parse(responseText);
    return analysis;
  } catch (e) {
    console.error("Failed to parse AI response:", responseText);
    return {
      documentType: "Other",
      summary: "Could not analyze the document content. Please review manually."
    };
  }
};

export async function POST(request) {
  const { content } = await request.json();

  if (!content) {
    return NextResponse.json({ error: 'Missing document content' }, { status: 400 });
  }

  try {
    const analysis = await performDocumentAnalysis(content);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Document Analysis API Error:", error);
    return NextResponse.json({ error: 'Failed to analyze document.' }, { status: 500 });
  }
}