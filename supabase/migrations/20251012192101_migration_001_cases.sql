-- Migration 001: Initialize cases table
-- This is the foundation table for all case management
-- Created: Phase A, Task 1

CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  case_number TEXT UNIQUE,
  circuit TEXT, -- e.g., "5th Judicial Circuit"
  county TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'closed', 'archived'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  CONSTRAINT case_name_not_empty CHECK (length(trim(name)) > 0)
);

COMMENT ON TABLE public.cases IS 'Stores legal cases associated with a user.';
COMMENT ON COLUMN public.cases.user_id IS 'Foreign key to auth.users, ensures case ownership.';
COMMENT ON COLUMN public.cases.case_number IS 'Unique case number (e.g., 2024-DP-000587-XXDP-BC).';
COMMENT ON COLUMN public.cases.status IS 'Current status: active, closed, or archived.';

-- Enable Row-Level Security (RLS)
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to manage their own cases
DROP POLICY IF EXISTS "Allow users to manage their own cases" ON public.cases;
CREATE POLICY "Allow users to manage their own cases"
ON public.cases
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON public.cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_cases_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cases_updated_at ON public.cases;
CREATE TRIGGER cases_updated_at
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION update_cases_timestamp();