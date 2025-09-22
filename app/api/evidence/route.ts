import { NextResponse, NextRequest } from 'next/server';

// This is a mock database for storing file metadata.
let evidenceFiles: any[] = [];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // In a real application, you would handle the file stream and upload to Supabase Storage.
  // For this mock, we'll just extract the file name and size.
  const fileMetadata = {
    id: evidenceFiles.length + 1,
    name: (file as File).name,
    size: (file as File).size,
    type: (file as File).type,
    uploadDate: new Date().toISOString(),
    // Assume all files are categorized as 'Uncategorized' until analysis.
    category: 'Uncategorized',
    storagePath: `evidence/${(file as File).name}`,
  };

  evidenceFiles.push(fileMetadata);

  return NextResponse.json(fileMetadata, { status: 201 });
}