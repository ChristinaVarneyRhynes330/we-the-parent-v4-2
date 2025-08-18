'use server';

import { createClient } from '@/lib/supabase/server'; // Note the import from 'server'
import { cookies } from 'next/headers';

export async function uploadDocument(formData, caseId) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to upload a document.' };
  }

  // 2. Get the file from the form data
  const file = formData.get('document');
  if (!file) {
    return { error: 'No file selected.' };
  }

  // 3. Upload the file to Supabase Storage
  const filePath = `${user.id}/${caseId}/${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('case-documents')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return { error: uploadError.message };
  }

  // 4. Get the public URL of the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('case-documents')
    .getPublicUrl(filePath);

  // 5. Insert a record into the 'documents' database table
  const { error: dbError } = await supabase
    .from('documents')
    .insert({
      file_name: file.name,
      storage_url: publicUrl,
      user_id: user.id,
      // We still need to add a 'case_id' column to our documents table
    });

  if (dbError) {
    console.error('Error saving document to database:', dbError);
    return { error: dbError.message };
  }

  return { error: null }; // Success!
}