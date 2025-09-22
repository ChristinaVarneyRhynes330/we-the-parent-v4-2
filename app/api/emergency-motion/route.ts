import { NextResponse, NextRequest } from 'next/server';
import OpenAI from 'openai';

const generateEmergencyMotion = async (motionDetails: any) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an AI legal assistant specializing in Florida juvenile dependency law. Draft an Emergency Motion for [Insert Motion Type] based on the following details for a pro se litigant.
  
  Details:
  - Case Name: ${motionDetails.caseName}
  - Case Number: ${motionDetails.caseNumber}
  - Reason for Urgency: ${motionDetails.reason}
  - Requested Relief: ${motionDetails.outcome}
  
  The motion must be formatted for immediate court intervention. Include a clear, urgent caption, a statement of facts supporting the emergency, and a prayer for relief that is direct and specific. Ensure the tone is formal and respectful. Do not provide legal advice, just draft the content based on the provided facts.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }]
  });

  const motionDraft = completion.choices[0].message.content;
  return motionDraft;
};

export async function POST(request: NextRequest) {
  const motionDetails = await request.json();

  if (!motionDetails.caseName || !motionDetails.caseNumber || !motionDetails.reason || !motionDetails.outcome) {
    return NextResponse.json({ error: 'Missing required motion details' }, { status: 400 });
  }

  try {
    const motionDraft = await generateEmergencyMotion(motionDetails);
    return NextResponse.json({ draft: motionDraft });
  } catch (error) {
    console.error("Emergency Motion API Error:", error);
    return NextResponse.json({ error: 'Failed to generate emergency motion.' }, { status: 500 });
  }
}