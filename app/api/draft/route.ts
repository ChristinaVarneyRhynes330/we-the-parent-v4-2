// File: app/api/draft/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createSSRClient } from '@/lib/supabase/server';
import { ApiResponse, DraftRequest, DraftResponse } from '@/types'; 
import { promises as fs } from 'fs';
import path from 'path';

// --- HELPER FUNCTION: Load Template ---
async function loadTemplate(templateId: string): Promise<string> {
    const templatePath = path.join(process.cwd(), 'lib', 'templates', 'florida', `${templateId}.md`);
    
    try {
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        return templateContent;
    } catch (e) {
        throw new Error(`Template not found for ID: ${templateId}`);
    }
}

// --- MOCK AI DRAFTING CORE ---
async function generateDraft(templateContent: string, facts: string, request: DraftRequest): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    let draft = templateContent;
    
    draft = draft.replace('{{CASE_NAME}}', request.caseName || '[PETITIONER NAME] vs. [RESPONDENT NAME]');
    draft = draft.replace('{{CASE_NUMBER}}', request.caseNumber || '2025-DP-0000X');
    draft = draft.replace('{{JURISDICTION_COURT}}', 'Circuit Court, 18th Judicial Circuit, Seminole County, Florida');
    
    const factSummary = `\n\n--- KEY FACTS FROM EVIDENCE BINDER ---\n` +
                        `The following facts support this filing:\n${facts}\n` +
                        `---------------------------------------\n\n`;

    const injectionPoint = draft.indexOf('### ARGUMENTS');
    if (injectionPoint !== -1) {
        draft = draft.slice(0, injectionPoint) + factSummary + draft.slice(injectionPoint);
    } else {
        draft += factSummary;
    }

    return draft;
}

// --- LIVE RAG FACT RETRIEVAL ---
async function retrieveCaseFacts(caseId: string, documentType: string): Promise<string> {
    // FIX: Added await here - createSSRClient() is async!
   const supabase = await createClient();
    
    try {
       const { data: relevantChunks, error: searchError } = await supabase.rpc(
  'match_document_chunks',
  {
    p_case_id: caseId,
    p_query_embedding: embedding,
    p_match_threshold: 0.7,
    p_match_count: 3,
  }
);

        if (error) {
            console.error("Supabase RAG Error for Drafting:", error);
            return "Error retrieving case facts. Draft will rely on template only.";
        }

        if (!documents || documents.length === 0) {
            return "No highly specific evidence found in the binder to support this filing.";
        }

        const context = documents.map((doc: any) => `- ${doc.content.substring(0, 100)}... (Evid. Ref.)`).join('\n'); 
        return context;

    } catch (e) {
        console.error("Critical error retrieving facts for draft:", e);
        return "RAG system failed to retrieve facts due to critical error.";
    }
}

/**
 * Handles the POST request to generate a legal draft.
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<DraftResponse>>> {
    try {
        const requestBody: DraftRequest = await req.json();
        const { templateId, caseId, documentType, caseName, caseNumber } = requestBody;

        if (!templateId || !caseId || !documentType) {
            return NextResponse.json({ success: false, error: 'Missing templateId, caseId, or documentType.' }, { status: 400 });
        }

        // 1. Load the Template
        const templateContent = await loadTemplate(templateId);

        // 2. Retrieve Live Case Facts (RAG)
        const caseFacts = await retrieveCaseFacts(caseId, documentType);

        // 3. Generate Draft
        const generatedDraft = await generateDraft(templateContent, caseFacts, requestBody);

        const responseData: DraftResponse = {
            draft: generatedDraft,
            caseInfo: {
                caseNumber: caseNumber || '2025-DP-0000X',
                caseName: caseName || '[PETITIONER] vs. [RESPONDENT]',
                circuit: '18th',
                county: 'Seminole',
            },
            documentType: documentType,
            generatedAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, data: responseData });

    } catch (error) {
        console.error("Drafting Engine API Error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Internal Server Error during drafting.' },
            { status: 500 }
        );
    }
}