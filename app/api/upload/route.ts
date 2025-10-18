// FILE: app/api/upload/route.ts
// FINAL VERSION - Compatible with unified schema

import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { chunkText, sha256Checksum, sanitizeText, estimateTokenCount } from '@/lib/utils';

export const runtime = 'nodejs';
export const maxDuration = 60;

const BUCKET = 'case_documents';

// Simple document analysis based on content patterns
function analyzeDocument(content: string) {
  const lower = content.toLowerCase();
  
  let documentType = 'Document';
  if (lower.includes('motion')) documentType = 'Motion';
  else if (lower.includes('affidavit')) documentType = 'Affidavit';
  else if (lower.includes('order')) documentType = 'Court Order';
  else if (lower.includes('objection')) documentType = 'Objection';
  else if (lower.includes('evidence') || lower.includes('exhibit')) documentType = 'Evidence';
  
  const summary = content.substring(0, 250).trim() + (content.length > 250 ? '...' : '');
  
  return { documentType, summary };
}

// Extract text from different file types
async function extractText(file: File, buffer: Buffer): Promise<string> {
  try {
    if (file.type.startsWith('text/')) {
      return buffer.toString('utf8');
    }
    
    // For other types, try to read as text
    const text = buffer.toString('utf8');
    // Check if it's readable text (contains letters)
    if (text.length > 0 && /[a-zA-Z]/.test(text.substring(0, 100))) {
      return text;
    }
    
    return '';
  } catch (error) {
    console.error('[Upload] Text extraction error:', error);
    return '';
  }
}

// Call the Supabase Edge Function to generate embeddings
async function generateEmbeddings(
  documentId: string, 
  chunks: Array<{ content: string; checksum: string; index: number }>
) {
  try {
    const supabase = createServiceClient();
    
    console.log(`[Upload] Calling Edge Function for ${chunks.length} chunks`);
    
    const payload = {
      chunks: chunks.map(chunk => ({
        document_id: documentId,
        content: chunk.content,
        checksum: chunk.checksum,
        chunk_index: chunk.index,
      })),
      embedding_model: 'openai', // Use OpenAI for 1536-dim embeddings
    };

    const { data, error } = await supabase.functions.invoke('generate-embedding', {
      body: payload,
    });

    if (error) {
      console.error('[Upload] Edge Function error:', error);
      throw new Error(`Embedding generation failed: ${error.message}`);
    }

    console.log('[Upload] Edge Function response:', data);
    return data;
  } catch (error) {
    console.error('[Upload] Failed to generate embeddings:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  console.log('[Upload] Starting upload process...');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const caseId = formData.get('caseId') as string | null;

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (!caseId) {
      return NextResponse.json({ error: 'No caseId provided' }, { status: 400 });
    }

    console.log(`[Upload] File: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${caseId}/${timestamp}-${safeName}`;

    // 1. Upload to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) {
      console.error('[Upload] Storage error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }
    
    console.log('[Upload] File uploaded to storage successfully');

    // 2. Extract text from file
    const rawContent = await extractText(file, fileBuffer);
    const content = sanitizeText(rawContent);
    console.log('[Upload] Extracted', content.length, 'characters');

    // 3. Analyze document
    const analysis = content.length > 50 
      ? analyzeDocument(content)
      : { documentType: 'File', summary: 'File uploaded successfully' };

    // 4. Insert document record with "processing" status (unified schema compatible)
    const { data: doc, error: insertError } = await supabase
      .from('documents')
      .insert({
        case_id: caseId,
        title: file.name, // unified schema uses 'title'
        file_name: file.name,
        file_path: filePath,
        file_url: `${supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl}`,
        content_type: file.type,
        size_bytes: file.size,
        status: 'processing',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[Upload] DB insert error:', insertError);
      // Clean up storage file if database insert fails
      await supabase.storage.from(BUCKET).remove([filePath]);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log('[Upload] Document record created:', doc.id);

    // 5. Generate embeddings if we have meaningful content
    let embeddingStatus = 'no_content';
    let processedChunks = 0;

    if (content.length > 100) {
      try {
        // Chunk the text (800 chars ≈ 200 tokens, with 100 char overlap)
        const chunks = chunkText(content, 800, 100);
        console.log(`[Upload] Created ${chunks.length} chunks`);

        // Filter out very short chunks and prepare with checksums
        const validChunks = chunks
          .filter(chunk => chunk.trim().length > 50)
          .slice(0, 50) // Limit to 50 chunks to avoid timeouts
          .map((chunk, index) => ({
            content: chunk.trim(),
            checksum: sha256Checksum(chunk.trim()),
            index,
          }));

        console.log(`[Upload] Processing ${validChunks.length} valid chunks`);

        if (validChunks.length > 0) {
          // Call Edge Function to generate embeddings
          const embeddingResult = await generateEmbeddings(doc.id, validChunks);
          
          processedChunks = embeddingResult?.processed || 0;
          embeddingStatus = processedChunks > 0 ? 'ready' : 'failed';
          
          console.log(`[Upload] Embeddings generated: ${processedChunks} chunks processed`);
        } else {
          embeddingStatus = 'no_valid_chunks';
          // Update status to ready anyway since there's nothing to embed
          await supabase
            .from('documents')
            .update({ status: 'ready' })
            .eq('id', doc.id);
        }
      } catch (embeddingError) {
        console.error('[Upload] Embedding generation failed:', embeddingError);
        embeddingStatus = 'failed';
        
        // Update document with error status
        await supabase
          .from('documents')
          .update({ 
            status: 'error',
            error_message: embeddingError instanceof Error ? embeddingError.message : 'Unknown error'
          })
          .eq('id', doc.id);
      }
    } else {
      // No content to embed, mark as ready
      await supabase
        .from('documents')
        .update({ status: 'ready' })
        .eq('id', doc.id);
    }

    // 6. Return success response
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      document: {
        id: doc.id,
        file_name: file.name,
        document_type: analysis.documentType,
        summary: analysis.summary,
        embedding_status: embeddingStatus,
        chunks_processed: processedChunks,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Upload] Fatal error:', error);
    return NextResponse.json({
      error: 'Upload failed',
      details: error.message,
      suggestion: 'Please try a different file or check file size'
    }, { status: 500 });
  }
}