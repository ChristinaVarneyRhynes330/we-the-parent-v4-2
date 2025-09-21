import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { caseName, caseNumber, reason, outcome, modelName, documentType } = await request.json();

  if (!caseName || !caseNumber || !documentType || !modelName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  let prompt;
  // Construct the prompt based on the document type
  switch (documentType) {
    case 'Motion':
      prompt = `As an AI legal drafting assistant for a pro se parent in a Florida juvenile dependency case, draft a Motion for Increased Visitation. The motion must be formatted with the following information in a standard court caption:
        Case Name: ${caseName}
        Case Number: ${caseNumber}
        Court: [Insert Court/Division manually]

        The body of the motion should include:
        1. A brief introduction identifying the parent and the purpose of the motion.
        2. A section titled 'Statement of Facts' that details the progress made by the parent. Use the following facts: ${reason}.
        3. A section titled 'Prayer for Relief' that clearly states the requested action from the court. Use the following requested outcome: ${outcome}.
        4. A space for the parent's signature, printed name, address, and phone number, followed by a 'Certificate of Service' section.

        Ensure the tone is formal and respectful, as would be expected in a legal document. Do not provide any legal advice, just draft the content based on the provided facts.`;
      break;

    case 'Affidavit':
      prompt = `As an AI legal drafting assistant, draft a sworn Affidavit for a pro se parent. The document must be formatted with a standard court caption.
        Case Name: ${caseName}
        Case Number: ${caseNumber}
        Court: [Insert Court/Division manually]

        The body of the affidavit should begin with a sworn statement from the affiant, followed by numbered paragraphs containing the facts provided below.
        Affiant: ${outcome}
        Statement of Facts: ${reason}
        
        Ensure the document is notarized with a signature line for the affiant and a notary public. Do not provide legal advice, just draft the document based on the facts.`;
      break;

    case 'Objection':
      prompt = `As an AI legal drafting assistant, draft an Objection for a pro se parent. The document must be formatted with a standard court caption.
        Case Name: ${caseName}
        Case Number: ${caseNumber}
        Court: [Insert Court/Division manually]

        The body should clearly state the objection based on the reason and legal basis provided below.
        Reason for Objection: ${reason}
        Legal Basis: ${outcome}
        
        Ensure the document is formatted for a court filing with a signature line for the parent. Do not provide legal advice, just draft the content.`;
      break;

    default:
      return NextResponse.json({ error: 'Unsupported document type.' }, { status: 400 });
  }

  try {
    let text;
    if (modelName === 'gemini-pro') {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    } else if (modelName === 'gpt-4o') {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
      });
      text = completion.choices[0].message.content;
    } else {
      return NextResponse.json({ error: 'Unsupported AI model.' }, { status: 400 });
    }

    return NextResponse.json({ draft: text });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate document.' }, { status: 500 });
  }
}