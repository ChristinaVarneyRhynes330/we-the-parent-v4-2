-- Migration 006: Compliance tracking for case plan requirements
-- Stores case plan tasks and compliance progress
-- Created: Phase A, Task 1

CREATE TABLE IF NOT EXISTS public.compliance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_category TEXT, -- 'Classes', 'Housing', 'Employment', 'Treatment', 'Other'
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'not_applicable'
  progress_percent INTEGER DEFAULT 0, -- 0-100
  due_date DATE,
  completed_date DATE,
  notes TEXT,
  evidence_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  CONSTRAINT task_name_not_empty CHECK (length(trim(task_name)) > 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'not_applicable')),
  CONSTRAINT valid_progress CHECK (progress_percent >= 0 AND progress_percent <= 100),
  CONSTRAINT valid_task_category CHECK (
    task_category IS NULL
    OR task_category IN ('Classes', 'Housing', 'Employment', 'Treatment', 'Other')
  )
);

COMMENT ON TABLE public.compliance_tasks IS 'Stores case plan tasks and tracks compliance progress.';
COMMENT ON COLUMN public.compliance_tasks.progress_percent IS 'Percentage completion (0-100).';
COMMENT ON COLUMN public.compliance_tasks.evidence_document_id IS 'Link to supporting evidence document if applicable.';

-- Enable Row-Level Security (RLS)
ALTER TABLE public.compliance_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to manage compliance tasks for their own cases
DROP POLICY IF EXISTS "Allow users to manage compliance tasks" ON public.compliance_tasks;
CREATE POLICY "Allow users to manage compliance tasks"
ON public.compliance_tasks
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = compliance_tasks.case_id
    AND cases.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = compliance_tasks.case_id
    AND cases.user_id = auth.uid()
  )
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_case_id ON public.compliance_tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_status ON public.compliance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_task_category ON public.compliance_tasks(task_category);
CREATE INDEX IF NOT EXISTS idx_compliance_tasks_due_date ON public.compliance_tasks(due_date);

-- Add trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_compliance_tasks_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS compliance_tasks_updated_at ON public.compliance_tasks;
CREATE TRIGGER compliance_tasks_updated_at
BEFORE UPDATE ON public.compliance_tasks
FOR EACH ROW
EXECUTE FUNCTION update_compliance_tasks_timestamp();