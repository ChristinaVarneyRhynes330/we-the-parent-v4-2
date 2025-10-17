-- Migration 002: Events table for timeline management
-- Stores case timeline events, hearings, deadlines, etc.
-- Created: Phase A, Task 1

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'appointment', -- 'hearing', 'deadline', 'appointment', 'filing', 'other'
  description TEXT,
  location TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  CONSTRAINT event_title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT valid_event_type CHECK (event_type IN ('hearing', 'deadline', 'appointment', 'filing', 'other'))
);

COMMENT ON TABLE public.events IS 'Stores case timeline events including hearings, deadlines, and appointments.';
COMMENT ON COLUMN public.events.event_type IS 'Type of event: hearing, deadline, appointment, filing, or other.';
COMMENT ON COLUMN public.events.event_date IS 'Date and time of the event in UTC.';

-- Enable Row-Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to view and manage events for their own cases
DROP POLICY IF EXISTS "Allow users to manage events for their own cases" ON public.events;
CREATE POLICY "Allow users to manage events for their own cases"
ON public.events
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = events.case_id
    AND cases.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = events.case_id
    AND cases.user_id = auth.uid()
  )
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_case_id ON public.events(case_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_events_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS events_updated_at ON public.events;
CREATE TRIGGER events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION update_events_timestamp();