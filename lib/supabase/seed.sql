-- Seed script to create demo case and sample data
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql

-- Create a demo case (adjust user_id to your actual auth user ID)
INSERT INTO public.cases (id, user_id, name, case_number, circuit, county, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  auth.uid(), -- Uses currently logged-in user
  'Doe Family Dependency Case',
  '2024-DP-000587-XXDP-BC',
  '5th Judicial Circuit',
  'Seminole County',
  'active'
);

-- Add sample upcoming events
INSERT INTO public.events (case_id, title, event_date, event_type, description, location)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Adjudicatory Hearing', NOW() + INTERVAL '3 days', 'hearing', 'Court hearing to determine facts', 'Courtroom 3B'),
  ('00000000-0000-0000-0000-000000000001', 'Supervised Visitation', NOW() + INTERVAL '8 days', 'appointment', 'Scheduled visit with children', 'DCF Office'),
  ('00000000-0000-0000-0000-000000000001', 'Case Plan Review', NOW() + INTERVAL '13 days', 'hearing', 'Review compliance progress', 'Courtroom 3B');

-- Add sample compliance tasks
INSERT INTO public.compliance_tasks (case_id, task_name, task_category, status, progress_percent, due_date)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Parenting Classes', 'Classes', 'completed', 100, NOW() - INTERVAL '10 days'),
  ('00000000-0000-0000-0000-000000000001', 'Housing Stability', 'Housing', 'in_progress', 75, NOW() + INTERVAL '20 days'),
  ('00000000-0000-0000-0000-000000000001', 'Substance Abuse Program', 'Treatment', 'in_progress', 60, NOW() + INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000001', 'Mental Health Evaluation', 'Treatment', 'pending', 0, NOW() + INTERVAL '40 days');

-- Add a sample child
INSERT INTO public.children (case_id, name, date_of_birth, placement_type, placement_address)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Jane Doe', '2018-05-15', 'Relative Caregiver', '123 Main St, Seminole, FL');

-- Verify the data was created
SELECT 'Cases:' as table_name, COUNT(*) as count FROM public.cases
UNION ALL
SELECT 'Events:', COUNT(*) FROM public.events
UNION ALL
SELECT 'Compliance Tasks:', COUNT(*) FROM public.compliance_tasks
UNION ALL
SELECT 'Children:', COUNT(*) FROM public.children;