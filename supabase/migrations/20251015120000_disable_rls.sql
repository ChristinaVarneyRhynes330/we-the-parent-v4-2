-- Disable RLS temporarily for single-user mode
ALTER TABLE public.cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.children DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.narrative_entries DISABLE ROW LEVEL SECURITY;

-- Note: When you want to enable multi-user later, you can re-enable these
