import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const performWeaknessAnalysis = async (documentContent) => {
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
    const analysisReport = await performWeaknessAnalysis(documentContent);
    return NextResponse.json({ report: analysisReport });
  } catch (error) {
    console.error("Predicate Analysis API Error:", error);
    return NextResponse.json({ error: 'Failed to perform predicate analysis.' }, { status: 500 });
  }
}