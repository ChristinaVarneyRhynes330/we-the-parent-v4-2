-- Migration 004: Narrative entries for case narrative builder
-- Stores chronological narrative points that build the case story
-- Created: Phase A, Task 1

CREATE TABLE IF NOT EXISTS public.narrative_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sequence INTEGER, -- Display order in narrative
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

COMMENT ON TABLE public.narrative_entries IS 'Stores narrative points that build the chronological case story.';
COMMENT ON COLUMN public.narrative_entries.sequence IS 'Order in which narrative points appear in the final narrative.';
COMMENT ON COLUMN public.narrative_entries.content IS 'The narrative text for this entry.';

-- Enable Row-Level Security (RLS)
ALTER TABLE public.narrative_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to manage narrative entries for their own cases
DROP POLICY IF EXISTS "Allow users to manage narrative entries" ON public.narrative_entries;
CREATE POLICY "Allow users to manage narrative entries"
ON public.narrative_entries
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = narrative_entries.case_id
    AND cases.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = narrative_entries.case_id
    AND cases.user_id = auth.uid()
  )
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_narrative_entries_case_id ON public.narrative_entries(case_id);
CREATE INDEX IF NOT EXISTS idx_narrative_entries_sequence ON public.narrative_entries(sequence);
CREATE INDEX IF NOT EXISTS idx_narrative_entries_created_at ON public.narrative_entries(created_at);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_narrative_entries_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS narrative_entries_updated_at ON public.narrative_entries;
CREATE TRIGGER narrative_entries_updated_at
BEFORE UPDATE ON public.narrative_entries
FOR EACH ROW
EXECUTE FUNCTION update_narrative_entries_timestamp();