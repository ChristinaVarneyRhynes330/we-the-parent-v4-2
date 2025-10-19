// File: app/api/certificate-of-service/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';
import { format } from 'date-fns';

// Define the required output structure
interface CertificateOfService {
    date: string;
    method: string;
    servedParties: Array<{ role: string; email: string }>;
    cosBlock: string;
}

// --- MOCK DATABASE RETRIEVAL (Zero-Cost Focus) ---
// FIX: Removed caseId from the argument list entirely to solve the unused variable warning.
async function retrieveCaseParties(): Promise<Array<{ role: string; email: string }>> {
    // Simulate database lookup delay
    await new Promise(resolve => setTimeout(resolve, 50)); 
    
    // Hardcoded parties for a typical dependency case
    return [
        { role: 'GAL (Guardian ad Litem)', email: 'gal.semco@example.com' },
        { role: 'DCF Attorney', email: 'dcf.counsel@state.fl.us' },
        { role: 'Adverse Parent Counsel', email: 'adverse.parent@lawfirm.net' },
        { role: 'Child’s Attorney', email: 'attorney.ad.litem@example.com' },
    ];
}

/**
 * Generates the final, formatted Certificate of Service text block.
 */
function generateCosBlock(parties: Array<{ role: string; email: string }>, date: Date, method: string): string {
    const formattedDate = format(date, 'MMMM d, yyyy');

    let block = `\n\n### CERTIFICATE OF SERVICE\n\n`;
    block += `I HEREBY CERTIFY that a true and correct copy of the foregoing document was furnished on ${formattedDate} `;
    block += `by ${method} (electronic mail) to the following parties of record:\n\n`;
    
    // List all served parties
    parties.forEach(party => {
        block += `- ${party.role}: ${party.email}\n`;
    });
    
    block += `\n\n__________________________________\n`;
    block += `[Petitioner's Printed Name]\n`;
    block += `Pro Se Petitioner\n`;

    return block;
}

/**
 * Handles the POST request to generate the Certificate of Service.
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<CertificateOfService>>> {
    try {
        // FIX: Removed destructuring and argument for caseId here too
        const { serviceMethod } = await req.json(); 

        // NOTE: The check is simplified now that caseId is unused in the mock function.
        if (!serviceMethod) {
            return NextResponse.json({ success: false, error: 'Missing service method.' }, { status: 400 });
        }
        
        const servedParties = await retrieveCaseParties();
        const currentDate = new Date();
        const cosBlock = generateCosBlock(servedParties, currentDate, serviceMethod);

        const responseData: CertificateOfService = {
            date: currentDate.toISOString(),
            method: serviceMethod,
            servedParties: servedParties,
            cosBlock: cosBlock,
        };

        return NextResponse.json({ success: true, data: responseData });

    } catch (error) {
        console.error("Certificate of Service API Error:", error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error during CoS generation.' },
            { status: 500 }
        );
    }
}