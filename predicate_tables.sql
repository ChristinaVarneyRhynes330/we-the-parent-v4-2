-- Drop tables to ensure a clean slate, handling dependencies.
DROP TABLE IF EXISTS public.predicate_evidence_links CASCADE;
DROP TABLE IF EXISTS public.predicates CASCADE;
DROP TABLE IF EXISTS public.transcription_jobs CASCADE;

-- 1. Create the predicates table
CREATE TABLE public.predicates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.predicates IS 'Stores the foundational predicates for a legal case.';

-- 2. Create the predicate_evidence_links table
CREATE TABLE public.predicate_evidence_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  predicate_id UUID NOT NULL REFERENCES public.predicates(id) ON DELETE CASCADE,
  evidence_id UUID NOT NULL REFERENCES public.evidence(id) ON DELETE CASCADE, -- Assuming an evidence table exists
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(predicate_id, evidence_id)
);
COMMENT ON TABLE public.predicate_evidence_links IS 'Links predicates to supporting evidence.';

-- 3. Create the transcription_jobs table
CREATE TABLE public.transcription_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- e.g., pending, processing, completed, failed
  transcript TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.transcription_jobs IS 'Stores audio transcription jobs and their results.';

-- 4. Enable Row-Level Security (RLS)
ALTER TABLE public.predicates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predicate_evidence_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcription_jobs ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies (Idempotent)
DROP POLICY IF EXISTS "Allow users to manage their own predicates" ON public.predicates;
CREATE POLICY "Allow users to manage their own predicates"
ON public.predicates
FOR ALL
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Allow users to manage their own predicate evidence links" ON public.predicate_evidence_links;
CREATE POLICY "Allow users to manage their own predicate evidence links"
ON public.predicate_evidence_links
FOR ALL
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Allow users to manage their own transcription jobs" ON public.transcription_jobs;
CREATE POLICY "Allow users to manage their own transcription jobs"
ON public.transcription_jobs
FOR ALL
USING (auth.uid() = created_by);
