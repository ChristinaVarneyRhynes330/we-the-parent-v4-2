-- Migration 007: RPC function for semantic document search (RAG)
-- Finds document chunks similar to a query embedding
-- Created: Phase A, Task 1

-- Drop and recreate with proper error handling
DROP FUNCTION IF EXISTS public.match_document_chunks(uuid, vector, float, int);

CREATE OR REPLACE FUNCTION public.match_document_chunks(
  p_case_id uuid,
  p_query_embedding vector(384),
  p_match_threshold float DEFAULT 0.7,
  p_match_count int DEFAULT 5
)
RETURNS TABLE (
  id bigint,
  document_id uuid,
  content text,
  similarity float
) AS $$
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
    dc.id,
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
$$ LANGUAGE plpgsql SECURITY INVOKER
  STABLE
  PARALLEL SAFE;

COMMENT ON FUNCTION public.match_document_chunks IS 'Finds document chunks similar to a query embedding using cosine similarity. Used for RAG (Retrieval-Augmented Generation) in the AI chat feature.';