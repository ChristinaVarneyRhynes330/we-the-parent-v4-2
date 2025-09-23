import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.AI_API_KEY,
});

export async function performDocumentAnalysis(documentContent: string): Promise<{ documentType: string; summary: string }> {
  if (!process.env.AI_API_KEY) {
    throw new Error('Groq API key not configured');
  }

  const prompt = `
    Analyze the following document content from a Florida juvenile dependency case.
    Determine its type and provide a concise one-sentence summary.
    Possible document types are: Motion, Affidavit, Court Order, Letter, Evidence, or Other.
    
    Respond with ONLY a valid JSON object with two keys: "documentType" and "summary".
    
    Document Content:
    ---
    ${documentContent.substring(0, 8000)} 
    ---
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gemma2-9b-it", // FIX: Using a currently active model
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('Empty response from Groq');
    }

    const analysis = JSON.parse(responseText);
    
    if (!analysis.documentType || !analysis.summary) {
      throw new Error('Invalid response format from AI');
    }

    return analysis;

  } catch (error) {
    console.error("========================================");
    console.error("Groq API Error in analysis function:");
    console.error(error);
    console.error("========================================");
    
    return {
      documentType: "Other",
      summary: "Could not analyze the document content."
    };
  }
};