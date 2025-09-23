import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Your personal case information for pre-filling templates
const YOUR_CASE_INFO = {
  caseNumber: "2024-DP-000587. Signature lines for:
   - Affiant signature and printed name
   - Date
   - Notary public signature, printed name, and seal
   - Notary commission expiration date

Ensure the document follows proper affidavit format with sworn language. Do not provide legal advice, just draft the document based on the facts provided.`;
        break;

      case 'Objection':
        prompt = `As an AI legal drafting assistant, draft a formal Objection for a pro se parent in a Florida juvenile dependency case. The document must be formatted with a standard Florida court caption and comply with the Florida Rules of Juvenile Procedure.

IN THE CIRCUIT COURT OF THE ${YOUR_CASE_INFO.circuit.toUpperCase()}
IN AND FOR ${YOUR_CASE_INFO.county.toUpperCase()}, FLORIDA
${YOUR_CASE_INFO.division.toUpperCase()}

Case Name: ${caseName}
Case Number: ${caseNumber}

The objection should include:

1. A clear title: "OBJECTION TO [SPECIFY WHAT IS BEING OBJECTED TO]"

2. An introduction identifying the objecting party

3. A section titled 'BASIS FOR OBJECTION' clearly stating the grounds for objection: ${body.reason}

4. A section titled 'LEGAL AUTHORITY' citing relevant legal principles, rules of evidence, or statutory authority: ${body.outcome}

5. A section titled 'PRAYER FOR RELIEF' requesting the court's action

6. Proper signature blocks including:
   - Parent's signature and printed name
   - Address and phone number
   - "Pro Se" designation
   - Date

7. Certificate of Service section

Ensure the document is formatted for immediate court filing with proper legal formatting. The tone should be respectful but firm. Do not provide legal advice, just draft the content based on the information provided.`;
        break;

      default:
        return NextResponse.json({ 
          error: 'Unsupported document type. Supported types: Motion, Affidavit, Objection' 
        }, { status: 400 });
    }

    let text: string;
    
    // Generate document using selected AI model
    if (body.modelName === 'gemini-pro') {
      if (!process.env.GOOGLE_API_KEY) {
        return NextResponse.json({ 
          error: 'Google API key not configured' 
        }, { status: 500 });
      }
      
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    } else if (body.modelName === 'groq') {
      if (!process.env.AI_API_KEY) {
        return NextResponse.json({ 
          error: 'Groq API key not configured' 
        }, { status: 500 });
      }
      
      const groq = new Groq({ apiKey: process.env.AI_API_KEY! });
      const completion = await groq.chat.completions.create({
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
        model: "gemma2-9b-it",
        temperature: 0.7,
        max_tokens: 4000
      });
      text = completion.choices[0]?.message?.content || '';
    } else {
      return NextResponse.json({ 
        error: 'Unsupported AI model. Use "gemini-pro" or "groq"' 
      }, { status: 400 });
    }

    if (!text) {
      return NextResponse.json({ 
        error: 'Failed to generate document content' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      draft: text,
      caseInfo: {
        caseNumber: caseNumber,
        caseName: caseName,
        circuit: YOUR_CASE_INFO.circuit,
        county: YOUR_CASE_INFO.county
      },
      documentType: body.documentType,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    
    // Handle specific API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json({ 
        error: 'API key configuration error. Check your environment variables.' 
      }, { status: 500 });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return NextResponse.json({ 
        error: 'API rate limit exceeded. Please try again later.' 
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate document. Please try again.' 
    }, { status: 500 });
  }
}

// GET endpoint to provide templates and case info
export async function GET() {
  return NextResponse.json({
    caseInfo: YOUR_CASE_INFO,
    supportedModels: ['gemini-pro', 'groq'],
    supportedDocumentTypes: ['Motion', 'Affidavit', 'Objection']
  });
}-XXDP-BC",
  caseName: "Your Name v. Department of Children and Families",
  circuit: "5th Judicial Circuit",
  county: "Lake County",
  division: "Dependency Division"
};

interface DraftRequest {
  caseName?: string;
  caseNumber?: string;
  reason: string;
  outcome: string;
  modelName: 'gemini-pro' | 'groq';
  documentType: 'Motion' | 'Affidavit' | 'Objection';
}

export async function POST(request: Request) {
  try {
    const body: DraftRequest = await request.json();
    
    // Validate required fields
    if (!body.documentType || !body.modelName || !body.reason || !body.outcome) {
      return NextResponse.json({ 
        error: 'Missing required fields. Need: documentType, modelName, reason, outcome' 
      }, { status: 400 });
    }

    // Use your case info as defaults if not provided
    const caseName = body.caseName || YOUR_CASE_INFO.caseName;
    const caseNumber = body.caseNumber || YOUR_CASE_INFO.caseNumber;

    let prompt: string;
    
    // Construct the prompt based on the document type
    switch (body.documentType) {
      case 'Motion':
        prompt = `As an AI legal drafting assistant for a pro se parent in a Florida juvenile dependency case, draft a professional motion. The motion must be formatted with the following information in a standard Florida court caption and comply with the Florida Rules of Juvenile Procedure for formatting:

IN THE CIRCUIT COURT OF THE ${YOUR_CASE_INFO.circuit.toUpperCase()}
IN AND FOR ${YOUR_CASE_INFO.county.toUpperCase()}, FLORIDA
${YOUR_CASE_INFO.division.toUpperCase()}

Case Name: ${caseName}
Case Number: ${caseNumber}

The body of the motion should include:

1. A proper introduction identifying the parent/petitioner and the specific purpose of the motion

2. A section titled 'BACKGROUND' providing relevant case context

3. A section titled 'STATEMENT OF FACTS' that details the progress made by the parent, using these specific facts: ${body.reason}

4. A section titled 'LEGAL ARGUMENT' citing relevant Florida Statutes (particularly Chapter 39) and case law supporting the motion

5. A section titled 'PRAYER FOR RELIEF' that clearly states the requested action from the court: ${body.outcome}

6. Proper signature blocks with spaces for:
   - Parent's signature and printed name
   - Address and phone number
   - Florida Bar number (if applicable) or "Pro Se"
   - Date line

7. A 'CERTIFICATE OF SERVICE' section stating how copies were served on all parties

Ensure the tone is formal, respectful, and professional as expected in legal documents. Use proper legal formatting with numbered paragraphs where appropriate. Do not provide legal advice, just draft the content based on the provided facts.`;
        break;

      case 'Affidavit':
        prompt = `As an AI legal drafting assistant, draft a sworn Affidavit for a pro se parent in a Florida juvenile dependency case. The document must be formatted with a standard Florida court caption and comply with the Florida Rules of Juvenile Procedure.

IN THE CIRCUIT COURT OF THE ${YOUR_CASE_INFO.circuit.toUpperCase()}
IN AND FOR ${YOUR_CASE_INFO.county.toUpperCase()}, FLORIDA
${YOUR_CASE_INFO.division.toUpperCase()}

Case Name: ${caseName}
Case Number: ${caseNumber}

The body of the affidavit should include:

1. A proper title: "AFFIDAVIT OF [AFFIANT NAME]"

2. An introduction stating: "STATE OF FLORIDA, COUNTY OF ${YOUR_CASE_INFO.county.toUpperCase()}"

3. A sworn statement beginning with: "I, [NAME], being first duly sworn, depose and say:"

4. Numbered paragraphs containing the facts: ${body.reason}

5. A statement regarding the affiant's personal knowledge: ${body.outcome}

6. A closing statement: "Further Affiant sayeth naught."

7