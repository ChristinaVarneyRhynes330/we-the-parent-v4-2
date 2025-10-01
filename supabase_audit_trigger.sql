-- Supabase Audit Trail for the 'predicates' table

-- 1. Create the predicates table
-- This table holds the predicate statements for legal cases.
CREATE TABLE IF NOT EXISTS public.predicates (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  case_id BIGINT, -- This would typically reference a 'cases' table
  statement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Create the audit_logs table
-- This table will store the history of changes from the 'predicates' table.
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  table_name TEXT NOT NULL,
  record_id BIGINT, -- Can be NULL if the record is deleted and has no ID
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_record JSONB,
  new_record JSONB,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create the trigger function
-- This function is executed automatically whenever a change occurs in the 'predicates' table.
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

-- 3. Attach the trigger to the 'predicates' table
-- This command tells the database to execute the log_predicate_changes() function
-- after any INSERT, UPDATE, or DELETE on the 'predicates' table.
DROP TRIGGER IF EXISTS predicates_audit_trigger ON public.predicates;
CREATE TRIGGER predicates_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.predicates
FOR EACH ROW EXECUTE FUNCTION public.log_predicate_changes();

-- Enable Row-Level Security for the audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to view their own audit logs.
-- Adjust this policy based on your application's security requirements.
DROP POLICY IF EXISTS "Allow users to view their own audit logs" ON public.audit_logs;
CREATE POLICY "Allow users to view their own audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (auth.uid() = changed_by);

-- Note: You might want to restrict INSERT/UPDATE/DELETE access to the audit_logs table
-- to only be possible via the trigger for data integrity.
