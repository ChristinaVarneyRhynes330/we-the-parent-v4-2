import { gemini } from '@/lib/gemini';

export async function analyzeDocument(documentContent: string): Promise<{ documentType: string; summary: string; keyDates: string[] }> {
  const prompt = `Analyze the following legal document content. Return a JSON object with three keys: "documentType" (e.g., "Motion", "Affidavit", "Order"), "summary" (a concise one-paragraph summary), and "keyDates" (an array of any dates found in YYYY-MM-DD format). Content: ${documentContent.substring(0, 15000)}`; // Limiting content length for safety

  try {
    const result = await gemini.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to get only the JSON part
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonString);

    return {
      documentType: parsed.documentType || 'Unknown',
      summary: parsed.summary || 'Could not generate summary.',
      keyDates: parsed.keyDates || [],
    };
  } catch (error) {
    console.error("Error analyzing document with Gemini:", error);
    return {
      documentType: 'Error',
      summary: 'Failed to analyze document.',
      keyDates: [],
    };
  }
}

// Other AI task functions will be re-implemented here later.