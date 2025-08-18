import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const generateLegalStrategy = async (caseSummary) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an AI legal strategist specializing in Florida juvenile dependency cases. Based on the following case summary, generate a legal strategy report. The report should include:
  1. An analysis of the case's strengths and weaknesses.
  2. Recommended strategic actions (e.g., motions to file, evidence to gather).
  3. A risk assessment for the proposed strategy.

  Case Summary:
  "${caseSummary}"

  The tone should be formal and professional, and the report should be easy to understand. Do not provide any legal advice, just draft a potential strategy.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }]
  });

  const strategyReport = completion.choices[0].message.content;
  return strategyReport;
};

export async function POST(request) {
  const { caseSummary } = await request.json();

  if (!caseSummary) {
    return NextResponse.json({ error: 'Missing case summary' }, { status: 400 });
  }

  try {
    const strategyReport = await generateLegalStrategy(caseSummary);
    return NextResponse.json({ report: strategyReport });
  } catch (error) {
    console.error("Legal Strategy API Error:", error);
    return NextResponse.json({ error: 'Failed to generate legal strategy.' }, { status: 500 });
  }
}