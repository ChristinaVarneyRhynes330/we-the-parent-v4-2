-- 1. Create the cases table
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  case_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.cases IS 'Stores legal cases associated with a user.';

-- 2. Enable Row-Level Security (RLS)
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies (Idempotent)
DROP POLICY IF EXISTS "Allow users to manage their own cases" ON public.cases;
CREATE POLICY "Allow users to manage their own cases"
ON public.cases
FOR ALL
USING (auth.uid() = user_id);