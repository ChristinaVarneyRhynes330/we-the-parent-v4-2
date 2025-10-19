// File: app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
// FIX: Changed import name from 'createClient' to 'createSSRClient' (Error 1)
import { createSSRClient } from '@/lib/supabase/server'; 
import { generateGeminiChatStream } from '@/lib/gemini';
// NOTE: Removed unused imports like ChatMessage and ApiResponse (Error 3)

// --- LIVE RAG CONTEXT FETCHING ---
// This function calls the Supabase 'match_documents' RPC to find relevant evidence.
async function fetchCaseContext(caseId: string, query: string): Promise<string> {
    // FIX: The server client must be awaited if it is an async function
    const supabase = createSSRClient(); 
    
    try {
        // NOTE: 'match_documents' is a PostgreSQL function that takes a query, 
        // finds the closest vector match, and returns the top content chunks.
        // We assume createSSRClient() is designed to be synchronous, or used 
        // synchronously, but we wrap the RPC call in the try/catch.
        
        const { data: documents, error } = await supabase.rpc('match_documents', {
            query_text: query,     // The user's new question
            case_id_filter: caseId, // Filter results to the current case
            match_threshold: 0.7,  // Minimum similarity score
            match_count: 5         // Number of top chunks to return
        });

        if (error) {
            console.error("Supabase RAG Error:", error);
            return "RAG system error. Providing general legal guidance only. Case ID: " + caseId;
        }

        if (!documents || documents.length === 0) {
            return "No highly relevant evidence found in the binder for this query.";
        }

        // FIX: Added type annotation ': any' to 'doc' parameter (Error 2)
        const context = documents.map((doc: any) => doc.content).join('\n---\n'); 
        return context;
        
    } catch (e) {
        console.error("Critical error in RAG pipeline:", e);
        return "RAG system failed due to critical infrastructure error.";
    }
}
// ---------------------------------


/**
 * Handles the POST request for AI Chat, using RAG (Retrieval-Augmented Generation).
 */
export async function POST(req: NextRequest) {
  try {
    const { caseId, history, newMessage } = await req.json();

    if (!caseId || !newMessage) {
      return NextResponse.json({ error: 'Missing caseId or newMessage' }, { status: 400 });
    }

    // 1. RAG Step: Fetch live context from the Evidence Binder
    const caseContext = await fetchCaseContext(caseId, newMessage);

    // 2. Generation Step: Pass the context, history, and new message to the streaming function
    const stream = await generateGeminiChatStream(history, newMessage, caseContext);

    // 3. Return the Stream to the Next.js client
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY is not set")) {
        return NextResponse.json(
            { error: "AI Service Configuration Error: GEMINI_API_KEY is not set." }, 
            { status: 500 }
        );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred during AI chat processing.' },
      { status: 500 }
    );
  }
}