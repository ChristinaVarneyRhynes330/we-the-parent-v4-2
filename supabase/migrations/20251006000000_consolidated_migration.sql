-- This is a consolidated, idempotent migration script.

-- Cases Table
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  case_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.cases IS 'Stores legal cases associated with a user.';
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own cases" ON public.cases;
CREATE POLICY "Allow users to manage their own cases" ON public.cases FOR ALL USING (auth.uid() = user_id);

-- Chat Tables
CREATE TABLE IF NOT EXISTS public.chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES public.chat_threads(id),
    content TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Narrative Table
CREATE TABLE IF NOT EXISTS public.narrative_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_type TEXT,
    description TEXT,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.events IS 'Stores all timeline events for a case.';
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own events" ON public.events;
CREATE POLICY "Allow users to manage their own events" ON public.events FOR ALL USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = events.case_id AND cases.user_id = auth.uid()));

-- Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    storage_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.documents IS 'Stores documents related to a case.';
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own documents" ON public.documents;
CREATE POLICY "Allow users to manage their own documents" ON public.documents FOR ALL USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = documents.case_id AND cases.user_id = auth.uid()));

-- Document Chunks Table
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    content TEXT,
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.document_chunks IS 'Stores chunks of text from documents for embeddings.';
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own document chunks" ON public.document_chunks;
CREATE POLICY "Allow users to manage their own document chunks" ON public.document_chunks FOR ALL USING (EXISTS (SELECT 1 FROM public.documents d JOIN public.cases c ON d.case_id = c.id WHERE d.id = document_chunks.document_id AND c.user_id = auth.uid()));

-- Evidence Table
CREATE TABLE IF NOT EXISTS public.evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.evidence IS 'Stores evidence related to a case.';
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own evidence" ON public.evidence;
CREATE POLICY "Allow users to manage their own evidence" ON public.evidence FOR ALL USING (EXISTS (SELECT 1 FROM public.cases WHERE cases.id = evidence.case_id AND cases.user_id = auth.uid()));

-- Predicate Tables
CREATE TABLE IF NOT EXISTS public.predicates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.predicates IS 'Stores the foundational predicates for a legal case.';
ALTER TABLE public.predicates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own predicates" ON public.predicates;
CREATE POLICY "Allow users to manage their own predicates" ON public.predicates FOR ALL USING (auth.uid() = created_by);

CREATE TABLE IF NOT EXISTS public.predicate_evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  predicate_id UUID NOT NULL REFERENCES public.predicates(id) ON DELETE CASCADE,
  evidence_id UUID NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(predicate_id, evidence_id)
);
COMMENT ON TABLE public.predicate_evidence_links IS 'Links predicates to supporting evidence.';
ALTER TABLE public.predicate_evidence_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own predicate evidence links" ON public.predicate_evidence_links;
CREATE POLICY "Allow users to manage their own predicate evidence links" ON public.predicate_evidence_links FOR ALL USING (auth.uid() = created_by);

CREATE TABLE IF NOT EXISTS public.transcription_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  transcript TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.transcription_jobs IS 'Stores audio transcription jobs and their results.';
ALTER TABLE public.transcription_jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own transcription jobs" ON public.transcription_jobs;
CREATE POLICY "Allow users to manage their own transcription jobs" ON public.transcription_jobs FOR ALL USING (auth.uid() = created_by);

-- Research Tables
CREATE TABLE IF NOT EXISTS public.research_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  summary TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.research_results IS 'Stores user research queries and the AI-generated summaries.';
ALTER TABLE public.research_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own research results" ON public.research_results;
CREATE POLICY "Allow users to manage their own research results" ON public.research_results FOR ALL USING (auth.uid() = created_by);

CREATE TABLE IF NOT EXISTS public.citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_result_id UUID NOT NULL REFERENCES public.research_results(id) ON DELETE CASCADE,
  document_chunk_id UUID NOT NULL REFERENCES public.document_chunks(id) ON DELETE CASCADE,
  formatted_citation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.citations IS 'Links research results to the specific source document chunks used as citations.';
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to view citations for their own research" ON public.citations;
CREATE POLICY "Allow users to view citations for their own research" ON public.citations FOR SELECT USING (EXISTS (SELECT 1 FROM public.research_results WHERE research_results.id = citations.research_result_id AND research_results.created_by = auth.uid()));

-- RPC Functions
CREATE OR REPLACE FUNCTION match_document_chunks (
  p_case_id uuid,
  p_query_embedding vector(384),
  p_match_threshold float,
  p_match_count int
)
RETURNS TABLE (
  id uuid,
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

-- Audit Trail
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  table_name TEXT NOT NULL,
  record_id UUID, -- Can be NULL if the record is deleted and has no ID
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_record JSONB,
  new_record JSONB,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE OR REPLACE FUNCTION public.log_predicate_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- For INSERT operations, log the new record.
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (table_name, record_id, operation, new_record, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), auth.uid());
    RETURN NEW;

  -- For UPDATE operations, log both the old and new records.
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_logs (table_name, record_id, operation, old_record, new_record, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;

  -- For DELETE operations, log the old record.
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (table_name, record_id, operation, old_record, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
    RETURN OLD;

  END IF;
  RETURN NULL; -- The result is ignored since this is an AFTER trigger
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS predicates_audit_trigger ON public.predicates;
CREATE TRIGGER predicates_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.predicates
FOR EACH ROW EXECUTE FUNCTION public.log_predicate_changes();

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their own audit logs" ON public.audit_logs;
CREATE POLICY "Allow users to view their own audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (auth.uid() = changed_by);
