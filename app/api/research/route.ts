// File: app/api/research/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, ResearchResult, ResearchSource } from '@/types'; 
// NOTE: We assume 'lib/research/bluebook.ts' contains formatting helpers
// import { formatCitation } from '@/lib/research/bluebook'; 

// --- MOCK LEGAL DATABASE SEARCH & CITATION ---
async function performLegalResearch(query: string): Promise<ResearchResult> {
    // Simulate API call time
    await new Promise(resolve => setTimeout(resolve, 1800)); 

    const lowerQuery = query.toLowerCase();
    let citation: string;
    let summary: string;
    let sources: ResearchSource[] = [];

    if (lowerQuery.includes('best interest') || lowerQuery.includes('reunification')) {
        citation = '§ 39.001(1), Fla. Stat. (2024); In re S.H., 158 So. 3d 741 (Fla. 5th DCA 2015).';
        summary = "Florida law prioritizes the **best interests of the child** in all dependency proceedings. Courts must consider the likelihood of successful reunification, giving preference to the permanency goal of reunification over others unless specific factors (like severe abuse or abandonment) prevent it. The parent must demonstrate substantial compliance with the case plan and show that they can provide a safe environment.";
        sources = [{
            id: 'stat-39', 
            document_id: 'N/A', 
            document_title: 'Florida Statutes § 39.001(1)', 
            page_number: 1, 
            content: "Legislative intent regarding the safety and permanent placement of children."
        }];
    } else if (lowerQuery.includes('timelines') || lowerQuery.includes('shelter hearing')) {
        citation = 'Rule 8.210, Fla. R. Juv. P.';
        summary = "The initial **shelter hearing** must be held within 24 hours of the child being taken into custody. This rule establishes critical deadlines for all subsequent filings and hearings, including the 90-day review period for the case plan and TPR timelines. Missing these statutory deadlines can lead to procedural advantage or disadvantage.";
        sources = [{
            id: 'rule-8.210', 
            document_id: 'N/A', 
            document_title: 'Florida Rules of Juvenile Procedure - Shelter Hearing', 
            page_number: 5, 
            content: "Procedures and timelines for holding a shelter hearing."
        }];
    } else {
        citation = 'No Direct Precedent Found.';
        summary = "The AI could not find a specific statute or case law directly matching your query within the mock database. Please refine your search terms. **Disclaimer: This is not real legal advice.**";
    }

    // In a real implementation, 'formatCitation' would apply Bluebook rules to 'citation'
    
    return { summary: summary, sources: sources, citation: citation };
}

/**
 * Handles the POST request from the client to perform legal research.
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<ResearchResult>>> {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ success: false, error: 'Research query is required.' }, { status: 400 });
        }

        const result = await performLegalResearch(query);

        // We embed the citation directly into the ResearchResult structure 
        // for ease of use by the client component.
        const responseData: ResearchResult = {
            summary: result.summary,
            sources: result.sources,
            citation: result.citation, 
        };

        return NextResponse.json({ success: true, data: responseData });

    } catch (error) {
        console.error("Legal Research API Error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Internal Server Error during legal research.' },
            { status: 500 }
        );
    }
}