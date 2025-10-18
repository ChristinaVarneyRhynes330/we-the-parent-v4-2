-- ==========================================
-- Schema Alignment Migration
-- Ensures compatibility between original migrations and unified schema
-- ==========================================

-- 1. Ensure vector extension is available
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add missing columns to documents table if they don't exist
DO $$
BEGIN
  -- Add title column if missing (used in unified schema)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'documents' 
    AND column_name = 'title'
  ) THEN
    ALTER TABLE public.documents ADD COLUMN title TEXT;
    -- Backfill title from file_name
    UPDATE public.documents SET title = file_name WHERE title IS NULL;
  END IF;

  -- Add status column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'documents' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.documents ADD COLUMN status TEXT DEFAULT 'ready';
  END IF;

  -- Add error_message column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'documents' 
    AND column_name = 'error_message'
  ) THEN
    ALTER TABLE public.documents ADD COLUMN error_message TEXT;
  END IF;
END $$;

-- 3. Add missing columns to document_chunks if they don't exist
DO $$
BEGIN
  -- Add chunk_index column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'document_chunks' 
    AND column_name = 'chunk_index'
  ) THEN
    ALTER TABLE public.document_chunks ADD COLUMN chunk_index INTEGER DEFAULT 0;
    
    -- Backfill chunk_index with row numbers per document
    WITH numbered_chunks AS (
      SELECT 
        id,
        ROW_NUMBER() OVER (PARTITION BY document_id ORDER BY created_at) - 1 AS idx
      FROM public.document_chunks
    )
    UPDATE public.document_chunks dc
    SET chunk_index = nc.idx
    FROM numbered_chunks nc
    WHERE dc.id = nc.id;
  END IF;

  -- Add token_count column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'document_chunks' 
    AND column_name = 'token_count'
  ) THEN
    ALTER TABLE public.document_chunks ADD COLUMN token_count INTEGER;
  END IF;

  -- Add checksum column if missing (critical for deduplication)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'document_chunks' 
    AND column_name = 'checksum'
  ) THEN
    ALTER TABLE public.document_chunks ADD COLUMN checksum TEXT;
  END IF;
END $$;

-- 4. Update embedding vector dimension if needed
-- NOTE: This checks current dimension and only runs if it needs to change
DO $$
DECLARE
  current_dim INTEGER;
BEGIN
  -- Get current dimension of embedding column
  SELECT atttypmod - 4 INTO current_dim
  FROM pg_attribute
  WHERE attrelid = 'public.document_chunks'::regclass
    AND attname = 'embedding';

  -- If dimension is 384 (from original migrations), update to 1536 for OpenAI
  -- CAUTION: This will clear existing embeddings if dimension changes
  IF current_dim = 384 THEN
    RAISE NOTICE 'Updating embedding dimension from 384 to 1536. Existing embeddings will be cleared.';
    
    -- Drop the old embedding column
    ALTER TABLE public.document_chunks DROP COLUMN embedding;
    
    -- Add new embedding column with correct dimension
    ALTER TABLE public.document_chunks ADD COLUMN embedding vector(1536);
    
    -- Recreate the index
    DROP INDEX IF EXISTS document_chunks_embedding_idx;
    CREATE INDEX document_chunks_embedding_idx 
      ON public.document_chunks 
      USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 100);
  END IF;
END $$;

-- 5. Create or replace the search_chunks function
CREATE OR REPLACE FUNCTION public.search_chunks(
  query_embedding vector(1536),
  match_count integer DEFAULT 5
)
RETURNS TABLE (
  chunk_id uuid,
  document_id uuid,
  similarity float4,
  content text,
  document_title text,
  chunk_index integer
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    dc.id AS chunk_id,
    dc.document_id,
    1 - (dc.embedding <=> query_embedding) AS similarity,
    dc.content,
    COALESCE(d.title, d.file_name) AS document_title,
    dc.chunk_index
  FROM public.document_chunks dc
  JOIN public.documents d ON d.id = dc.document_id
  WHERE dc.embedding IS NOT NULL
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
$$;

COMMENT ON FUNCTION public.search_chunks IS 'Semantic search across document chunks using vector similarity';

-- 6. Update the match_document_chunks RPC function for backward compatibility
CREATE OR REPLACE FUNCTION public.match_document_chunks(
  p_case_id uuid,
  p_query_embedding vector(1536),
  p_match_threshold float DEFAULT 0.7,
  p_match_count int DEFAULT 5
)
RETURNS TABLE (
  id bigint,
  document_id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
SECURITY INVOKER
STABLE
PARALLEL SAFE
AS $$
BEGIN
  IF p_query_embedding IS NULL THEN
    RAISE EXCEPTION 'Query embedding cannot be null';
  END IF;
  
  IF p_match_threshold < 0 OR p_match_threshold > 1 THEN
    RAISE EXCEPTION 'Match threshold must be between 0 and 1';
  END IF;
  
  IF p_match_count <= 0 THEN
    RAISE EXCEPTION 'Match count must be greater than 0';
  END IF;

  RETURN QUERY
  SELECT
    dc.id::bigint,
    dc.document_id,
    dc.content,
    (1 - (dc.embedding <=> p_query_embedding)) AS similarity
  FROM public.document_chunks AS dc
  JOIN public.documents AS d ON dc.document_id = d.id
  WHERE d.case_id = p_case_id 
    AND dc.embedding IS NOT NULL
    AND (1 - (dc.embedding <=> p_query_embedding)) > p_match_threshold
  ORDER BY similarity DESC
  LIMIT p_match_count;
END;
$$;

COMMENT ON FUNCTION public.match_document_chunks IS 'Legacy RPC function for case-specific chunk matching with threshold';

-- 7. Create indexes for new columns
CREATE INDEX IF NOT EXISTS document_chunks_checksum_idx ON public.document_chunks(checksum);
CREATE INDEX IF NOT EXISTS document_chunks_chunk_index_idx ON public.document_chunks(document_id, chunk_index);
CREATE INDEX IF NOT EXISTS documents_title_idx ON public.documents(title);

-- 8. Update documents status for existing records
UPDATE public.documents 
SET status = 'ready' 
WHERE status IS NULL;

-- 9. Verification query
DO $$
DECLARE
  doc_count INTEGER;
  chunk_count INTEGER;
  embedded_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO doc_count FROM public.documents;
  SELECT COUNT(*) INTO chunk_count FROM public.document_chunks;
  SELECT COUNT(*) INTO embedded_count FROM public.document_chunks WHERE embedding IS NOT NULL;
  
  RAISE NOTICE 'Schema alignment complete:';
  RAISE NOTICE '  Documents: %', doc_count;
  RAISE NOTICE '  Chunks: %', chunk_count;
  RAISE NOTICE '  Embedded chunks: %', embedded_count;
END $$;