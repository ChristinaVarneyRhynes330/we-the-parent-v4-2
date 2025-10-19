// File: app/api/contradiction/route.ts

import { NextRequest, NextResponse } from 'next/server';
// FIX: Use the correct path alias for the types file
import { ApiResponse } from '@/types'; 

interface ContradictionReport {
    flagged: boolean;
    analysis: string;
    details: Array<{ statementA: string; statementB: string; contradiction: string }>;
}

/**
 * Mocks the AI analysis for contradictions between two statements or documents.
 */
async function runContradictionAnalysis(statement1: string, statement2: string): Promise<ContradictionReport> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    const lower1 = statement1.toLowerCase();
    const lower2 = statement2.toLowerCase();
    const report: ContradictionReport = { flagged: false, analysis: "No major direct contradictions detected based on the statements.", details: [] };

    // --- MOCK LOGIC: Detect Contradiction ---
    // Example 1: Contradiction on attendance
    if (lower1.includes('missed') && lower2.includes('attended all')) {
        report.flagged = true;
        report.analysis = "CRITICAL CONTRADICTION FOUND: The statements directly conflict regarding attendance records.";
        report.details.push({
            statementA: statement1,
            statementB: statement2,
            contradiction: "One source claims services were missed, while the other claims they were attended.",
        });
    }

    // Example 2: Contradiction on dates/times
    if ((lower1.includes('monday') || lower1.includes('tuesday')) && (lower2.includes('saturday') || lower2.includes('sunday'))) {
         report.flagged = true;
         report.analysis = "CONTRADICTION FLAGGED: Inconsistency regarding the day of the week for a key event.";
         report.details.push({
            statementA: statement1,
            statementB: statement2,
            contradiction: "Conflicting days reported for the same event/observation period.",
        });
    }
    
    if(report.flagged && report.details.length === 0) {
        report.analysis = "Contradiction flagged, but specific details were inconclusive. Further review needed."
    }

    return report;
}

/**
 * Handles the POST request to check document/statement contradiction.
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<ContradictionReport>>> {
    try {
        const { statement1, statement2 } = await req.json();

        if (!statement1 || !statement2) {
            return NextResponse.json({ success: false, error: 'Two statements are required for contradiction analysis.' }, { status: 400 });
        }

        const report = await runContradictionAnalysis(statement1, statement2);

        return NextResponse.json({ success: true, data: report });

    } catch (error) {
        console.error("Contradiction Index API Error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Internal Server Error during contradiction analysis.' },
            { status: 500 }
        );
    }
}