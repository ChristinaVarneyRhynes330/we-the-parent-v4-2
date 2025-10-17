-- Migration 003: Documents and document chunks for RAG/embedding
-- Stores uploaded documents and their semantic embeddings
-- Created: Phase A, Task 1

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in Supabase storage
  file_type TEXT, -- e.g., 'application/pdf', 'text/plain'
  file_size INTEGER, -- Size in bytes
  document_type TEXT, -- e.g., 'Motion', 'Affidavit', 'Court Order'
  summary TEXT, -- AI-generated summary
  storage_path TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  CONSTRAINT file_name_not_empty CHECK (length(trim(file_name)) > 0)
);

COMMENT ON TABLE public.documents IS 'Stores metadata about uploaded case documents.';
COMMENT ON COLUMN public.documents.file_path IS 'Path to file in Supabase Storage bucket.';
COMMENT ON COLUMN public.documents.document_type IS 'Categorized type (Motion, Affidavit, Court Order, Evidence, Letter, Other).';
COMMENT ON COLUMN public.documents.summary IS 'AI-generated one-paragraph summary of document contents.';

-- Document chunks table for RAG (Retrieval-Augmented Generation)
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(384), -- Using 384-dim embeddings from gte-small model
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.document_chunks IS 'Stores text chunks and embeddings for semantic search (RAG).';
COMMENT ON COLUMN public.document_chunks.embedding IS 'Vector embedding (384 dimensions) from Xenova/gte-small model.';

-- Enable Row-Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can manage documents for their own cases
DROP POLICY IF EXISTS "Allow users to manage documents for their own cases" ON public.documents;
CREATE POLICY "Allow users to manage documents for their own cases"
ON public.documents
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id
    AND cases.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id
    AND cases.user_id = auth.uid()
  )
);

-- RLS Policy: Users can view document chunks for their own documents
DROP POLICY IF EXISTS "Allow users to view document chunks" ON public.document_chunks;
CREATE POLICY "Allow users to view document chunks"
ON public.document_chunks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.documents
    JOIN public.cases ON documents.case_id = cases.id
    WHERE documents.id = document_chunks.document_id
    AND cases.user_id = auth.uid()
  )
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_documents_case_id ON public.documents(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON public.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at);
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON public.document_chunks(document_id);

-- Create HNSW index for vector similarity search (much faster than IVFFLAT)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
ON public.document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 4, ef_construction = 64);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_documents_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS documents_updated_at ON public.documents;
CREATE TRIGGER documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION update_documents_timestamp();