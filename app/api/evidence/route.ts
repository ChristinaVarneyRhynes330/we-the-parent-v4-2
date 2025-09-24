import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const caseId = formData.get('caseId') as string;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!caseId) {
    return NextResponse.json({ error: 'Case ID is required' }, { status: 400 });
  }

  const filePath = `evidence/${caseId}/${file.name}`;

  // Upload the file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('evidence-files') // Make sure this bucket exists in your Supabase project
    .upload(filePath, file);

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }

  // Insert file metadata into the 'evidence' table
  const { data: evidenceRecord, error: insertError } = await supabase
    .from('evidence')
    .insert({
      case_id: caseId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: filePath,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Supabase insert error:', insertError);
    // If the database insert fails, attempt to delete the orphaned file from storage
    await supabase.storage.from('evidence-files').remove([filePath]);
    return NextResponse.json({ error: 'Failed to save file metadata' }, { status: 500 });
  }

  return NextResponse.json(evidenceRecord, { status: 201 });
}