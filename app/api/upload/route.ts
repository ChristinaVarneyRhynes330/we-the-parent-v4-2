// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { supabaseService } from '../../lib/supabase/service';

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filePath = `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseService.storage
      .from('case_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Insert metadata into documents table and return the inserted row
    const { data: insertedDocs, error: insertError } = await supabaseService
      .from('documents')
      .insert({
        case_id: CASE_ID,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
      })
      .select('*') // This makes Supabase return the inserted row(s)
      .single();   // Since we only insert one file at a time

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      document: insertedDocs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}