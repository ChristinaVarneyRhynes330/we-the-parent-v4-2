import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Extract the form data sent from the frontend.
  const { caseName, caseNumber, reason, outcome } = await request.json();

  // Basic validation to ensure no fields are empty.
  if (!caseName || !caseNumber || !reason || !outcome) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Initialize the Gemini API client with the API key from your environment variables.
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // This is the detailed prompt that guides the AI to draft a legal document.
    // We are embedding the user's form data directly into the prompt.
    const prompt = `As an AI legal drafting assistant for a pro se parent in a Florida juvenile dependency case, draft a Motion for Increased Visitation. The motion must be formatted with the following information in a standard court caption:
    Case Name: ${caseName}
    Case Number: ${caseNumber}
    Court: [Insert Court/Division manually]

    The body of the motion should include:
    1. A brief introduction identifying the parent and the purpose of the motion.
    2. A section titled 'Statement of Facts' that details the progress made by the parent. Use the following facts: ${reason}.
    3. A section titled 'Prayer for Relief' that clearly states the requested action from the court. Use the following requested outcome: ${outcome}.
    4. A space for the parent's signature, printed name, address, and phone number, followed by a 'Certificate of Service' section.

    Ensure the tone is formal and respectful, as would be expected in a legal document. Do not provide any legal advice, just draft the content based on the provided facts.`;

    // Send the prompt to the AI model and get a response.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the AI-generated draft to the frontend.
    return NextResponse.json({ draft: text });
  } catch (error) {
    // Log any errors for debugging purposes.
    console.error("AI Generation Error:", error);
    // Return a user-friendly error message.
    return NextResponse.json({ error: 'Failed to generate document.' }, { status: 500 });
  }
}
