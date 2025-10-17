import { createSSRClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createSSRClient();

  try {
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id, name, case_number, status')
      .order('created_at', { ascending: false });

    if (casesError) throw casesError;

    const activeCase = cases[0];

    if (!activeCase) {
      return NextResponse.json({ dashboardData: null });
    }

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('title, event_date')
      .eq('case_id', activeCase.id)
      .order('event_date', { ascending: true })
      .limit(5);

    if (eventsError) throw eventsError;

    const { data: complianceTasks, error: complianceError } = await supabase
      .from('compliance_tasks')
      .select('task_name, status, progress_percent')
      .eq('case_id', activeCase.id)
      .order('created_at', { ascending: false });

    if (complianceError) throw complianceError;

    const dashboardData = {
      currentCase: {
        number: activeCase.case_number,
        nextHearing: events.length > 0 ? new Date(events[0].event_date).toLocaleDateString() : 'N/A',
        circuit: '5th Judicial Circuit', // This is hardcoded, consider adding to cases table
        progress: complianceTasks.length > 0 ? Math.round(complianceTasks.reduce((acc, task) => acc + task.progress_percent, 0) / complianceTasks.length) : 0,
        daysRemaining: events.length > 0 ? Math.ceil((new Date(events[0].event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
        status: activeCase.status,
      },
      caseProgress: complianceTasks.map(task => ({
        task: task.task_name,
        status: task.status,
        progress: task.progress_percent,
      })),
      upcomingEvents: events.map(event => ({
        title: event.title,
        date: new Date(event.event_date).toLocaleString(),
        daysRemaining: Math.ceil((new Date(event.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        type: 'routine', // This is hardcoded, consider adding to events table
      })),
    };

    return NextResponse.json({ dashboardData });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
