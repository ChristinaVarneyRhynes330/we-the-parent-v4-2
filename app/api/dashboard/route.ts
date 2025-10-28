import { createSSRClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSSRClient();

  try {
    // Fetch all cases for the user
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id, name, case_number, status')
      .order('created_at', { ascending: false });

    if (casesError) throw casesError;

    // If no cases exist, return empty dashboard
    if (!cases || cases.length === 0) {
      return NextResponse.json({ dashboardData: null });
    }

    const activeCase = cases[0]; // Use the most recent case

    // Fetch upcoming events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('title, event_date')
      .eq('case_id', activeCase.id)
      .gte('event_date', new Date().toISOString()) // Only future events
      .order('event_date', { ascending: true })
      .limit(5);

    if (eventsError) throw eventsError;

    // Fetch compliance tasks
    const { data: complianceTasks, error: complianceError } = await supabase
      .from('compliance_tasks')
      .select('task_name, status, progress_percent')
      .eq('case_id', activeCase.id)
      .order('created_at', { ascending: false });

    if (complianceError) throw complianceError;

    // Calculate next hearing date and days remaining
    const nextHearing = events && events.length > 0 ? events[0] : null;
    const daysRemaining = nextHearing 
      ? Math.ceil((new Date(nextHearing.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate overall progress from compliance tasks
    const totalProgress = complianceTasks && complianceTasks.length > 0
      ? Math.round(complianceTasks.reduce((acc, task) => acc + (task.progress_percent || 0), 0) / complianceTasks.length)
      : 0;

    const dashboardData = {
      currentCase: {
        number: activeCase.case_number || 'No case number',
        nextHearing: nextHearing ? new Date(nextHearing.event_date).toLocaleDateString() : 'N/A',
        circuit: '5th Judicial Circuit', // You can add this to cases table if needed
        progress: totalProgress,
        daysRemaining: daysRemaining,
        status: activeCase.status || 'active',
      },
      caseProgress: (complianceTasks || []).map(task => ({
        task: task.task_name,
        status: task.status,
        progress: task.progress_percent || 0,
      })),
      upcomingEvents: (events || []).map(event => ({
        title: event.title,
        date: new Date(event.event_date).toLocaleString(),
        daysRemaining: Math.ceil((new Date(event.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        type: 'routine', // You can add event priority to events table if needed
      })),
    };

    return NextResponse.json({ dashboardData });

  } catch (error: any) {
    console.error('[Dashboard API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}