import { gemini } from '@/lib/gemini';
import { google_web_search } from '@/lib/tools';

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

export async function checkGALConflict(name: string): Promise<string> {
    const searchResults = await google_web_search.run({ query: `"${name}" AND ("attorney" OR "lawyer" OR "judge") AND ("family law" OR "dependency court")` });

    if (!searchResults || searchResults.length === 0) {
        return "No potential conflicts found.";
    }

    const analysisPrompt = `Analyze the following search results for a person named ${name} to determine if there is a potential conflict of interest for them to act as a Guardian Ad Litem (GAL) in a dependency case. Look for any indication that they are an attorney, judge, or have any other role that might create a conflict. Summarize your findings.

Search Results:
${JSON.stringify(searchResults, null, 2)}`;

    try {
        const result = await gemini.generateContent(analysisPrompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error analyzing search results with Gemini:", error);
        return "Error analyzing search results for potential conflicts.";
    }
}

// Other AI task functions will be re-implemented here later.