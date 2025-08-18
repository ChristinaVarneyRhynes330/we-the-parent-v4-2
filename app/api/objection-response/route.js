import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const generateObjectionResponse = async (objectionText) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an AI legal assistant specializing in courtroom procedure. The opposing counsel has just made the following objection:
  "${objectionText}"

  Provide a concise, professional, and legally appropriate response. Your response should include:
  1. A formal reply to the judge.
  2. A brief explanation of why the objection is improper or a justification for your question.
  3. A suggestion to the court to overrule the objection.

  The response should be brief, and suitable for a pro se litigant to use in court. Do not provide legal advice.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }]
  });

  const responseText = completion.choices[0].message.content;
  return responseText;
};

export async function POST(request) {
  const { objection } = await request.json();

  if (!objection) {
    return NextResponse.json({ error: 'Missing objection text' }, { status: 400 });
  }

  try {
    const objectionResponse = await generateObjectionResponse(objection);
    return NextResponse.json({ response: objectionResponse });
  } catch (error) {
    console.error("Objection Response API Error:", error);
    return NextResponse.json({ error: 'Failed to generate objection response.' }, { status: 500 });
  }
}