CREATE OR REPLACE FUNCTION match_document_chunks (
  p_case_id uuid,
  p_query_embedding vector(384),
  p_match_threshold float,
  p_match_count int
)
RETURNS TABLE (
  id bigint,
  document_id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.content,
    1 - (dc.embedding <=> p_query_embedding) AS similarity
  FROM document_chunks AS dc
  JOIN documents AS d ON dc.document_id = d.id
  WHERE d.case_id = p_case_id AND 1 - (dc.embedding <=> p_query_embedding) > p_match_threshold
  ORDER BY similarity DESC
  LIMIT p_match_count;
END;
$$;