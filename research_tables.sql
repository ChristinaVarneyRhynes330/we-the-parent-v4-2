-- 1. Create the research_results table
-- This table stores the high-level summary and query for each research task.
CREATE TABLE public.research_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  summary TEXT, -- The AI-generated summary of findings
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.research_results IS 'Stores user research queries and the AI-generated summaries.';

-- 2. Create the citations table
-- This table links each research result to the specific document chunks that support it.
CREATE TABLE public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_result_id UUID NOT NULL REFERENCES public.research_results(id) ON DELETE CASCADE,
  document_chunk_id UUID NOT NULL REFERENCES public.document_chunks(id) ON DELETE CASCADE, -- Assuming you have a document_chunks table
  formatted_citation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.citations IS 'Links research results to the specific source document chunks used as citations.';

-- 3. Enable Row-Level Security (RLS)
-- Ensures users can only access their own research data.
ALTER TABLE public.research_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Define rules for who can access or modify the data.
CREATE POLICY "Allow users to manage their own research results" 
ON public.research_results
FOR ALL
USING (auth.uid() = created_by);

CREATE POLICY "Allow users to view citations for their own research" 
ON public.citations
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.research_results
    WHERE research_results.id = citations.research_result_id
      AND research_results.created_by = auth.uid()
  )
);