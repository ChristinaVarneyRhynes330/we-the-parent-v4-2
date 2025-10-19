// File: app/api/objection-stream/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types'; 

// Define the structure for the immediate real-time response
interface ObjectionFlag {
    flagged: boolean;
    type?: 'Hearsay' | 'Lack of Foundation' | 'Irrelevant' | 'Leading';
    triggerPhrase?: string;
    scriptSuggestion?: string;
}

/**
 * Mocks the real-time AI analysis of a live transcript chunk.
 * In a live system, this would be an Edge Function processing a WebSockets stream.
 */
async function analyzeTranscriptChunk(chunk: string): Promise<ObjectionFlag> {
    const lowerChunk = chunk.toLowerCase();

    // 1. Hearsay Trigger
    // Look for phrases that introduce out-of-court statements
    if (lowerChunk.includes('he said') || lowerChunk.includes('she told me') || lowerChunk.includes('the report says')) {
        // Exclude common phrases like "she told me the time"
        if (!lowerChunk.includes('time') && !lowerChunk.includes('date')) {
            return {
                flagged: true,
                type: 'Hearsay',
                triggerPhrase: lowerChunk.match(/(he said|she told me|the report says)/)?.[0] || 'Out-of-court statement',
                scriptSuggestion: 'OBJECT: Hearsay. Your Honor, I object on the grounds that the witness is attempting to introduce an out-of-court statement offered for the truth of the matter asserted, which constitutes hearsay.',
            };
        }
    }

    // 2. Lack of Foundation Trigger (e.g., trying to admit evidence without proper intro)
    if (lowerChunk.includes('i show you') || lowerChunk.includes('i offer this')) {
        return {
            flagged: true,
            type: 'Lack of Foundation',
            triggerPhrase: lowerChunk.match(/(i show you|i offer this)/)?.[0] || 'Attempt to enter evidence',
            scriptSuggestion: 'OBJECT: Lack of Foundation. Your Honor, I object. Counsel has failed to establish the foundational predicate required for the admission of this evidence.',
        };
    }

    // 3. Irrelevant/Speculation Trigger
    if (lowerChunk.includes('i think') || lowerChunk.includes('i believe') || lowerChunk.includes('in my opinion')) {
        return {
            flagged: true,
            type: 'Irrelevant',
            triggerPhrase: lowerChunk.match(/(i think|i believe|in my opinion)/)?.[0] || 'Witness speculation',
            scriptSuggestion: 'OBJECT: Speculation. Your Honor, I object. The witness is speculating and offering their opinion, which is not admissible under the Rules of Evidence.',
        };
    }
    
    // Default: No immediate objection required
    return { flagged: false };
}

/**
 * Handles the POST request, simulating a chunk of real-time audio transcript.
 * It immediately responds with any detected objection flags.
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<ObjectionFlag>>> {
    try {
        const { transcript_chunk } = await req.json();

        if (!transcript_chunk) {
            return NextResponse.json({ success: false, error: 'Missing transcript chunk for analysis.' }, { status: 400 });
        }

        const flag = await analyzeTranscriptChunk(transcript_chunk);

        return NextResponse.json({ success: true, data: flag });

    } catch (error) {
        console.error("Objection Stream API Error:", error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error during real-time analysis.' },
            { status: 500 }
        );
    }
}