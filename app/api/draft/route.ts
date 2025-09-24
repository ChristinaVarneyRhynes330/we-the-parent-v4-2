import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Your personal case information for pre-filling templates
const YOUR_CASE_INFO = {
  caseNumber: "2024-DP-000587-XXDP-BC",
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

// Enhanced prompt templates with better structure
const getPromptTemplate = (documentType: string, caseName: string, caseNumber: string, reason: string, outcome: string) => {
  const commonHeader = `
IN THE CIRCUIT COURT OF THE ${YOUR_CASE_INFO.circuit.toUpperCase()}
IN AND FOR ${YOUR_CASE_INFO.county.toUpperCase()}, FLORIDA
${YOUR_CASE_INFO.division.toUpperCase()}

Case Name: ${caseName}
Case Number: ${caseNumber}`;

  const templates = {
    Motion: `As an AI legal drafting assistant for a pro se parent in a Florida juvenile dependency case, draft a professional motion with the following format:

${commonHeader}

MOTION FOR [SPECIFIC RELIEF REQUESTED]

TO THE HONORABLE COURT:

COMES NOW, [Parent Name], appearing pro se, and respectfully moves this Honorable Court as follows:

I. INTRODUCTION
[Brief introduction identifying the parent and purpose of the motion]

II. BACKGROUND
[Relevant case context and procedural history]

III. STATEMENT OF FACTS
The following facts support this motion:
${reason}

IV. LEGAL ARGUMENT
[Cite relevant Florida Statutes (Chapter 39) and case law supporting the motion, including constitutional due process rights and fundamental parental rights]

V. PRAYER FOR RELIEF
WHEREFORE, Petitioner respectfully requests that this Honorable Court:
${outcome}

RESPECTFULLY SUBMITTED,

_____________________________
[Parent Name], Pro Se
[Address]
[City, State ZIP]
[Phone Number]
Florida Bar No: N/A

CERTIFICATE OF SERVICE

I HEREBY CERTIFY that a true and correct copy of the foregoing has been served upon all parties by [method of service] on this _____ day of _________, 2025.

_____________________________
[Parent Name]`,

    Affidavit: `Draft a sworn Affidavit for a Florida juvenile dependency case:

${commonHeader}

AFFIDAVIT OF [AFFIANT NAME]

STATE OF FLORIDA
COUNTY OF ${YOUR_CASE_INFO.county.toUpperCase()}

BEFORE ME, the undersigned authority, personally appeared [Affiant Name], who being first duly sworn, deposes and says:

1. I am [age] years of age and am competent to testify to the matters set forth herein based upon my personal knowledge.

2. I am the [relationship] of the minor child(ren) involved in the above-styled case.

3. The following facts are true and correct:
${reason}

4. ${outcome}

5. I make this affidavit based upon my personal knowledge and in support of [purpose of affidavit].

FURTHER AFFIANT SAYETH NAUGHT.

_____________________________
[Affiant Name]

Sworn to and subscribed before me this _____ day of _________, 2025.

_____________________________
Notary Public, State of Florida
Print Name: ______________________
My Commission Expires: ___________`,

    Objection: `Draft a formal Objection for a Florida juvenile dependency case:

${commonHeader}

OBJECTION TO [SPECIFY WHAT IS BEING OBJECTED TO]

TO THE HONORABLE COURT:

COMES NOW, [Parent Name], appearing pro se, and hereby objects to [specific matter] on the following grounds:

I. BASIS FOR OBJECTION
${reason}

II. LEGAL AUTHORITY
The following legal principles support this objection:
${outcome}

III. PRAYER FOR RELIEF
WHEREFORE, [Parent Name] respectfully requests that this Honorable Court sustain this objection and [specific relief requested].

RESPECTFULLY SUBMITTED,

_____________________________
[Parent Name], Pro Se
[Address]
[City, State ZIP]
[Phone Number]

CERTIFICATE OF SERVICE
[Standard certificate of service language]`
  };

  return templates[documentType as keyof typeof templates] || templates.Motion;
};

export async function POST(request: Request) {
  try {
    const body: DraftRequest = await request.json();
    
    // Enhanced validation
    if (!body.documentType || !body.modelName || !body.reason?.trim() || !body.outcome?.trim()) {
      return NextResponse.json({ 
        error: 'Missing required fields. Need: documentType, modelName, reason (non-empty), outcome (non-empty)' 
      }, { status: 400 });
    }

    // Validate document type
    const validDocTypes = ['Motion', 'Affidavit', 'Objection'];
    if (!validDocTypes.includes(body.documentType)) {
      return NextResponse.json({ 
        error: `Invalid document type. Must be one of: ${validDocTypes.join(', ')}` 
      }, { status: 400 });
    }

    // Validate model
    const validModels = ['gemini-pro', 'groq'];
    if (!validModels.includes(body.modelName)) {
      return NextResponse.json({ 
        error: `Invalid model. Must be one of: ${validModels.join(', ')}` 
      }, { status: 400 });
    }

    // Use your case info as defaults if not provided
    const caseName = body.caseName?.trim() || YOUR_CASE_INFO.caseName;
    const caseNumber = body.caseNumber?.trim() || YOUR_CASE_INFO.caseNumber;

    // Get the appropriate prompt template
    const prompt = getPromptTemplate(body.documentType, caseName, caseNumber, body.reason.trim(), body.outcome.trim());

    let text: string;
    
    // Generate document using selected AI model
    if (body.modelName === 'gemini-pro') {
      if (!process.env.GOOGLE_API_KEY) {
        return NextResponse.json({ 
          error: 'Google API key not configured. Please check server configuration.' 
        }, { status: 500 });
      }
      
      try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-pro",
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            maxOutputTokens: 4000,
          }
        });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        
      } catch (geminiError: any) {
        console.error("Gemini API Error:", geminiError);
        
        // Handle specific Gemini API errors
        if (geminiError.message?.includes('quota')) {
          return NextResponse.json({ 
            error: 'Google AI quota exceeded. Please try again later or use the Groq model.' 
          }, { status: 429 });
        }
        
        return NextResponse.json({ 
          error: 'Failed to generate document with Gemini. Please try the Groq model instead.' 
        }, { status: 500 });
      }
      
    } else if (body.modelName === 'groq') {
      if (!process.env.AI_API_KEY) {
        return NextResponse.json({ 
          error: 'Groq API key not configured. Please check server configuration.' 
        }, { status: 500 });
      }
      
      try {
        const groq = new Groq({ apiKey: process.env.AI_API_KEY });
        const completion = await groq.chat.completions.create({
          messages: [{ 
            role: "user", 
            content: prompt 
          }],
          model: "llama3-8b-8192", // Using a more reliable model
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 0.8,
        });
        
        text = completion.choices[0]?.message?.content || '';
        
      } catch (groqError: any) {
        console.error("Groq API Error:", groqError);
        
        // Handle specific Groq API errors
        if (groqError.message?.includes('rate limit')) {
          return NextResponse.json({ 
            error: 'Groq API rate limit exceeded. Please wait a moment and try again.' 
          }, { status: 429 });
        }
        
        return NextResponse.json({ 
          error: 'Failed to generate document with Groq. Please try again or use the Gemini model.' 
        }, { status: 500 });
      }
    }

    // Validate generated content
    if (!text || text.trim().length < 100) {
      return NextResponse.json({ 
        error: 'Generated document is too short or empty. Please try again with more detailed information.' 
      }, { status: 500 });
    }

    // Clean up the generated text
    text = text.trim();

    // Add timestamp and generation info
    const generatedAt = new Date().toISOString();
    
    return NextResponse.json({ 
      draft: text,
      caseInfo: {
        caseNumber: caseNumber,
        caseName: caseName,
        circuit: YOUR_CASE_INFO.circuit,
        county: YOUR_CASE_INFO.county
      },
      documentType: body.documentType,
      modelUsed: body.modelName,
      generatedAt: generatedAt,
      wordCount: text.split(/\s+/).length,
      success: true
    }, { status: 200 });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    
    // Handle different types of errors
    if (error.name === 'SyntaxError') {
      return NextResponse.json({ 
        error: 'Invalid request format. Please check your input data.' 
      }, { status: 400 });
    }
    
    if (error.message?.includes('network') || error.message?.includes('timeout')) {
      return NextResponse.json({ 
        error: 'Network error occurred. Please check your connection and try again.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'An unexpected error occurred while generating the document. Please try again.' 
    }, { status: 500 });
  }
}

// Enhanced GET endpoint with more information
export async function GET() {
  return NextResponse.json({
    caseInfo: YOUR_CASE_INFO,
    supportedModels: [
      {
        name: 'groq',
        label: 'Groq (Recommended)',
        description: 'Fast and reliable AI model for legal document generation',
        features: ['High speed', 'Good legal understanding', 'Consistent formatting']
      },
      {
        name: 'gemini-pro',
        label: 'Google Gemini Pro',
        description: 'Advanced AI model with excellent reasoning capabilities',
        features: ['Advanced reasoning', 'Complex document handling', 'High quality output']
      }
    ],
    supportedDocumentTypes: [
      {
        type: 'Motion',
        description: 'Formal requests to the court for specific relief or action',
        examples: ['Motion for Increased Visitation', 'Motion for Reunification', 'Motion to Modify Case Plan']
      },
      {
        type: 'Affidavit',
        description: 'Sworn statements of facts under oath',
        examples: ['Affidavit of Compliance', 'Affidavit of Changed Circumstances', 'Character Affidavit']
      },
      {
        type: 'Objection',
        description: 'Formal challenges to evidence or proceedings',
        examples: ['Objection to Evidence', 'Objection to Testimony', 'Objection to Proposed Order']
      }
    ],
    tips: [
      'Be specific and detailed in your facts and reasons',
      'Include dates, locations, and specific examples',
      'State exactly what relief you want from the court',
      'Always review and customize the generated document',
      'Consider consulting with a legal professional before filing'
    ]
  });
}