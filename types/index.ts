// types/index.ts
export interface Evidence {
  id: string;
  file_name: string;
  file_size: number;
  upload_date: string;
  // Add any other properties from your Supabase 'evidence' table here
}