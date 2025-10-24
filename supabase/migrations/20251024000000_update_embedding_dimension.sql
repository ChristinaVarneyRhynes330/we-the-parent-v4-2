-- Update embedding dimension from 384 to 1536 for OpenAI compatibility
-- This migration safely handles existing data

DO $$
DECLARE
  current_dim INTEGER;
BEGIN
  -- Check current dimension
  SELECT atttypmod - 4 INTO current_dim
  FROM pg_attribute
  WHERE attrelid = 'public.document_chunks'::regclass
    AND attname = 'embedding';

  -- Only update if dimension is not already 1536
  IF current_dim != 1536 THEN
    RAISE NOTICE 'Updating embedding dimension from % to 1536', current_dim;
    
    -- Drop old index
    DROP INDEX IF EXISTS idx_document_chunks_embedding;
    
    -- Update column type
    ALTER TABLE public.document_chunks 
    ALTER COLUMN embedding TYPE vector(1536);
    
    -- Recreate index with new dimension
    CREATE INDEX idx_document_chunks_embedding 
    ON public.document_chunks 
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
    
    RAISE NOTICE 'Embedding dimension updated successfully';
  ELSE
    RAISE NOTICE 'Embedding dimension already correct (1536)';
  END IF;
END $$;

-- Update the match_document_chunks function to use correct dimension
CREATE OR REPLACE FUNCTION public.match_document_chunks(
  p_case_id uuid,
  p_query_embedding vector(1536),  -- Updated dimension
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

COMMENT ON FUNCTION public.match_document_chunks IS 'Semantic search using 1536-dim OpenAI embeddings';