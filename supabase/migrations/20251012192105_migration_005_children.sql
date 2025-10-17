-- Migration 005: Children information for case management
-- Stores information about children involved in dependency cases
-- Created: Phase A, Task 1

CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  placement_type TEXT, -- 'Relative Caregiver', 'Non-Relative Caregiver', 'Foster Home', 'Group Home', 'Other'
  placement_address TEXT,
  placement_contact_name TEXT,
  placement_contact_phone TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  CONSTRAINT child_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT valid_placement_type CHECK (
    placement_type IS NULL 
    OR placement_type IN (
      'Relative Caregiver', 
      'Non-Relative Caregiver', 
      'Foster Home', 
      'Group Home', 
      'Other'
    )
  )
);

COMMENT ON TABLE public.children IS 'Stores information about children in dependency cases.';
COMMENT ON COLUMN public.children.placement_type IS 'Current placement: Relative Caregiver, Non-Relative Caregiver, Foster Home, Group Home, or Other.';
COMMENT ON COLUMN public.children.date_of_birth IS 'Child birthdate in YYYY-MM-DD format.';

-- Enable Row-Level Security (RLS)
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to manage children for their own cases
DROP POLICY IF EXISTS "Allow users to manage children" ON public.children;
CREATE POLICY "Allow users to manage children"
ON public.children
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = children.case_id
    AND cases.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = children.case_id
    AND cases.user_id = auth.uid()
  )
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_children_case_id ON public.children(case_id);
CREATE INDEX IF NOT EXISTS idx_children_date_of_birth ON public.children(date_of_birth);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_children_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS children_updated_at ON public.children;
CREATE TRIGGER children_updated_at
BEFORE UPDATE ON public.children
FOR EACH ROW
EXECUTE FUNCTION update_children_timestamp();