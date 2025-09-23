import { NextResponse, NextRequest } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.AI_API_KEY });

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  relevance: string;
}

// Mock legal database for demonstration
const MOCK_LEGAL_DATABASE = {
  'parental rights': [
    {
      title: "Troxel v. Granville, 530 U.S. 57 (2000)",
      snippet: "The Supreme Court held that parents have a fundamental right to make decisions concerning the care, custody, and control of their children. The Due Process Clause does not permit a state to infringe on this right simply because a state judge believes a 'better' decision could be made.",
      url: "https://supreme.justia.com/cases/federal/us/530/57/",
      relevance: "high"
    },
    {
      title: "Santosky v. Kramer, 455 U.S. 745 (1982)",
      snippet: "Before a State may sever completely and irrevocably the rights of parents in their natural child, due process requires that the State support its allegations by at least clear and convincing evidence.",
      url: "https://supreme.justia.com/cases/federal/us/455/745/",
      relevance: "high"
    }
  ],
  'due process': [
    {
      title: "Florida Statute § 39.013 - Procedures and Jurisdiction",
      snippet: "The circuit court shall have exclusive original jurisdiction of proceedings involving children alleged to be dependent. All parties have the right to be represented by counsel at every stage of dependency proceedings.",
      url: "http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0039/Sections/0039.013.html",
      relevance: "high"
    },
    {
      title: "Lassiter v. Department of Social Services, 452 U.S. 18 (1981)",
      snippet: "The pre-eminent generalization that emerges from this Court's precedents on an indigent's right to appointed counsel is that such a right has been recognized to exist only where the litigant may lose his physical liberty if he loses the litigation.",
      url: "https://supreme.justia.com/cases/federal/us/452/18/",
      relevance: "medium"
    }
  ],
  'reunification': [
    {
      title: "Florida Statute § 39.801 - Case Plan Development",
      snippet: "The case plan must be designed to achieve the child's safe return to the child's own home whenever possible, or another permanent placement. The case plan shall specify the services to be provided to effectuate the return of the child.",
      url: "http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0039/Sections/0039.801.html",
      relevance: "high"
    },
    {
      title: "In re D.B., 385 So. 2d 83 (Fla. 1980)",
      snippet: "Florida courts have consistently held that reunification with the natural parent is the preferred goal in dependency proceedings, and reasonable efforts must be made to preserve and reunify families.",
      url: "https://law.justia.com/cases/florida/supreme-court/1980/59-406-0.html",
      relevance: "high"
    }
  ],
  'case plan': [
    {
      title: "Florida Statute § 39.801 - Case Plan Requirements",
      snippet: "Each case plan must contain a description of the type of home or institution in which a child is to be placed, including a discussion of the safety and appropriateness of the placement and how the agency determined that the proposed placement is in the best interest of the child.",
      url: "http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0039/Sections/0039.801.html",
      relevance: "high"
    },
    {
      title: "Florida Rules of Juvenile Procedure 8.415",
      snippet: "The case plan shall be filed with the court and provided to all parties at least 72 hours before any hearing in which the court will consider the case plan, unless the time requirement is waived by the court for good cause shown.",
      url: "https://www.floridarules.org/gateway/ruleno.asp?id=168",
      relevance: "medium"
    }
  ]
};

const generateCitations = async (results: SearchResult[]): Promise<string> => {
  if (!process.env.AI_API_KEY || results.length === 0) {
    return "No citations available.";
  }

  try {
    const casesText = results.map(r => `${r.title}: ${r.snippet}`).join('\n\n');
    
    const prompt = `Convert the following legal cases and statutes into proper Bluebook citation format. For each item, provide the correct legal citation format:

${casesText}

Provide proper Bluebook citations for each item, formatted correctly for legal writing.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gemma2-9b-it",
      temperature: 0.3,
      max_tokens: 1000
    });

    return completion.choices[0]?.message?.content || "Citations could not be generated.";
  } catch (error) {
    console.error("Citation generation error:", error);
    return "Citations could not be generated due to an error.";
  }
};

const searchLegalDatabase = (query: string): SearchResult[] => {
  const lowerQuery = query.toLowerCase();
  let results: SearchResult[] = [];
  
  // Search through mock database
  Object.entries(MOCK_LEGAL_DATABASE).forEach(([key, cases]) => {
    if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
      results.push(...cases);
    }
  });
  
  // If no specific matches, search in all content
  if (results.length === 0) {
    Object.values(MOCK_LEGAL_DATABASE).forEach(cases => {
      cases.forEach(case_item => {
        if (case_item.title.toLowerCase().includes(lowerQuery) || 
            case_item.snippet.toLowerCase().includes(lowerQuery)) {
          results.push(case_item);
        }
      });
    });
  }
  
  // Remove duplicates and limit results
  const uniqueResults = results.filter((result, index, self) => 
    index === self.findIndex(r => r.title === result.title)
  );
  
  return uniqueResults.slice(0, 10); // Limit to 10 results
};

export async function POST(request: NextRequest) {
  try {
    const { query, database = 'google_scholar' } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ 
        error: 'Search query is required' 
      }, { status: 400 });
    }

    if (query.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Search query cannot be empty' 
      }, { status: 400 });
    }

    // Search the legal database
    const results = searchLegalDatabase(query);
    
    // Generate citations
    const citations = await generateCitations(results);

    return NextResponse.json({
      query: query,
      database: database,
      results: results,
      citations: citations,
      total: results.length
    });

  } catch (error: any) {
    console.error("Legal Research API Error:", error);
    
    return NextResponse.json({ 
      error: 'Failed to perform legal research. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    availableDatabases: ['google_scholar', 'justia'],
    sampleQueries: [
      'parental rights',
      'due process dependency',
      'reunification standards',
      'case plan requirements',
      'Florida statute 39',
      'constitutional parental rights'
    ],
    disclaimer: 'This is a mock legal research tool for demonstration purposes. Always verify legal information with official sources.'
  });
}