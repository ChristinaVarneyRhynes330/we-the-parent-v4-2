// FILE: app/api/dashboard/route.ts
// COMPLETE REPLACEMENT

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get user's first case
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('*')
      .limit(1)
      .single();

    if (casesError || !cases) {
      return NextResponse.json({
        dashboardData: {
          currentCase: null,
          caseProgress: [],
          upcomingEvents: [],
        },
      });
    }

    const caseId = cases.id;

    // Get compliance tasks for progress
    const { data: complianceTasks } = await supabase
      .from('compliance_tasks')
      .select('*')
      .eq('case_id', caseId)
      .limit(5);

    // Get upcoming events
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('case_id', caseId)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(5);

    // Calculate days remaining to next hearing
    const nextEvent = events?.[0];
    const daysRemaining = nextEvent
      ? Math.ceil(
          (new Date(nextEvent.event_date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    // Calculate overall progress
    const totalTasks = complianceTasks?.length || 1;
    const completedTasks = complianceTasks?.filter(
      (t) => t.status === 'completed'
    ).length || 0;
    const progress = Math.round((completedTasks / totalTasks) * 100);

    const dashboardData = {
      currentCase: {
        number: cases.case_number || 'No case number',
        nextHearing: nextEvent?.title || 'No upcoming hearings',
        circuit: '5th Judicial Circuit',
        progress,
        daysRemaining,
        status: 'Active',
      },
      caseProgress: (complianceTasks || []).map((task) => ({
        task: task.task_name,
        status: task.status,
        progress: task.progress_percent || 0,
      })),
      upcomingEvents: (events || []).map((event) => {
        const eventDaysRemaining = Math.ceil(
          (new Date(event.event_date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        
        return {
          title: event.title,
          date: new Date(event.event_date).toLocaleDateString(),
          daysRemaining: eventDaysRemaining,
          type: eventDaysRemaining <= 3 ? 'critical' : 
                eventDaysRemaining <= 7 ? 'important' : 'routine' as 'critical' | 'important' | 'routine',
        };
      }),
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}