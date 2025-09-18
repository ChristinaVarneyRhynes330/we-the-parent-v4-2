import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const performPredicateAnalysis = async (documentContent) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an AI legal assistant specializing in juvenile dependency cases. Analyze the following motion to identify its legal and factual predicates. Provide a brief report on the strength of the arguments and suggest ways to strengthen them by matching facts to legal principles.
  
  Document Content:
  "${documentContent}"
  
  Based on the content, provide a report on the argument's structure, evidence sufficiency, and legal basis. Format your response as a clear, easy-to-read report.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }]
  });

  const analysisReport = completion.choices[0].message.content;
  return analysisReport;
};

export async function POST(request) {
  const { documentContent } = await request.json();

  if (!documentContent) {
    return NextResponse.json({ error: 'Missing document content' }, { status: 400 });
  }

  try {
    const analysisReport = await performPredicateAnalysis(documentContent);
    return NextResponse.json({ report: analysisReport });
  } catch (error) {
    console.error("Predicate Analysis API Error:", error);
    return NextResponse.json({ error: 'Failed to perform predicate analysis.' }, { status: 500 });
  }
}