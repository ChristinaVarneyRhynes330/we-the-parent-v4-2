import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { analyzeDocument } from '@/lib/ai/analysis';
import { chunkText } from '@/lib/utils';
import mammoth from 'mammoth';
import PDFParser from "pdf2json";
import { pipeline } from '@xenova/transformers';

export const runtime = 'nodejs';

const BUCKET = 'case_documents';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const caseId = formData.get('caseId') as string | null;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!caseId) return NextResponse.json({ error: 'No caseId provided' }, { status: 400 });

    const supabase = createServiceClient();
    const filePath = `${Date.now()}-${file.name}`;

    // Upload file
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file);
    if (uploadError) throw uploadError;

    // Extract text content
    let contentToAnalyze = '';
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    if (file.type.startsWith('text/')) {
      contentToAnalyze = fileBuffer.toString('utf8');
    } else if (file.type === 'application/pdf') {
      const pdfParser = new PDFParser(null, 1);
      contentToAnalyze = await new Promise<string>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", err => reject(err.parserError));
        pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
        pdfParser.parseBuffer(fileBuffer);
      });
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
      contentToAnalyze = value;
    }
    
    // Perform AI analysis for summary/type
    let analysis = { documentType: 'File', summary: 'File could not be analyzed.' };
    if (contentToAnalyze.trim()) {
      analysis = await analyzeDocument(contentToAnalyze);
    }

    // Insert main document record
    const { data: insertedDoc, error: insertError } = await supabase
      .from('documents')
      .insert({
        case_id: caseId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        document_type: analysis.documentType,
        summary: analysis.summary,
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    // --- NEW: Chunk, Embed, and Store ---
    if (contentToAnalyze.trim()) {
      const chunks = chunkText(contentToAnalyze);
      console.log(`Document ${insertedDoc.id} split into ${chunks.length} chunks.`);

      // Initialize the embedding model
      const extractor = await pipeline('feature-extraction', 'Xenova/gte-small');

      for (const chunk of chunks) {
        // Generate embedding directly
        const output = await extractor(chunk, { pooling: 'mean', normalize: true });
        const embedding = Array.from(output.data);

        // Save the chunk and its embedding to the database
        const { error: chunkInsertError } = await supabase
          .from('document_chunks')
          .insert({
            document_id: insertedDoc.id,
            content: chunk,
            embedding: embedding,
          });
        
        if (chunkInsertError) throw chunkInsertError;
      }
      console.log(`Successfully embedded and stored ${chunks.length} chunks.`);
    }
    // ------------------------------------

    return NextResponse.json({
      message: 'File uploaded, analyzed, and embedded successfully',
      document: { ...analysis, id: insertedDoc.id },
    });
  } catch (err: any) {
    console.error('Upload API failed:', err);
    return NextResponse.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
  }
}