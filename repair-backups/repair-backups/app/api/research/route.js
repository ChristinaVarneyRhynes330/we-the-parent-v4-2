import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// This is a mock function that simulates a real API call to a search engine like Google.
// In a production environment, you would replace this with an actual API call.
const mockGoogleSearch = async (query) => {
  console.log(`Performing mock search for: ${query}`);
  const mockData = {
    results: [
      {
        title: "Troxel v. Granville, 530 U.S. 57 (2000)",
        snippet: "This case addresses the fundamental right of parents to make decisions concerning the care, custody, and control of their children...",
        url: "https://supreme.justia.com/cases/federal/us/530/57/"
      },
      {
        title: "Florida Statute § 39.507 - Shelter Hearings",
        snippet: "A shelter hearing must be held within 24 hours of a child being removed from their home...",
        url: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0039/Sections/0039.507.html"
      },
      {
        title: "Santosky v. Kramer, 455 U.S. 745 (1982)",
        snippet: "This case established that parents in a juvenile dependency case are entitled to a higher standard of evidence before parental rights can be terminated.",
        url: "https://supreme.justia.com/cases/federal/us/455/745/"
      }
    ]
  };
  return mockData;
};

export async function POST(request) {
  const { query, database } = await request.json();

  if (!query || !database) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const searchResults = await mockGoogleSearch(`${query} site:${database === 'google_scholar' ? 'scholar.google.com' : 'justia.com'}`);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are a legal research assistant. Your task is to take the following search results and format them into proper Bluebook citations.
    Search Query: "${query}"
    Search Results:
    ${searchResults.results.map(result => `Title: ${result.title}\nSnippet: ${result.snippet}\nURL: ${result.url}`).join('\n\n')}
    
    Format the output as a numbered list of Bluebook citations. Do not provide any additional information, only the formatted citations.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    const citations = completion.choices[0].message.content;

    return NextResponse.json({ results: searchResults.results, citations: citations });

  } catch (error) {
    console.error("Research API Error:", error);
    return NextResponse.json({ error: 'Failed to perform legal research.' }, { status: 500 });
  }
}