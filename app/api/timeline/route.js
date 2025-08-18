import { NextResponse } from 'next/server';

// Mock database for storing timeline events
let timelineEvents = [
  { id: 1, title: 'Adjudicatory Hearing', date: '2025-03-15', daysRemaining: 3, type: 'critical' },
  { id: 2, title: 'Case Plan Review', date: '2025-03-25', daysRemaining: 13, type: 'important' },
  { id: 3, title: 'Judicial Review Hearing', date: '2025-04-10', daysRemaining: 29, type: 'important' }
];

const calculateDaysRemaining = (eventDate) => {
  const today = new Date();
  const date = new Date(eventDate);
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Mock function to simulate automatic deadline calculation based on Florida rules
const calculateDeadlines = (event) => {
  const eventDate = new Date(event.date);
  const deadlines = [];

  // Example: Motion to Rehear must be filed within 15 days of the hearing.
  const motionDeadlineDate = new Date(eventDate);
  motionDeadlineDate.setDate(motionDeadlineDate.getDate() + 15);
  deadlines.push({
    title: `Deadline for Motion to Rehear (${event.title})`,
    date: motionDeadlineDate.toISOString().split('T')[0],
    daysRemaining: calculateDaysRemaining(motionDeadlineDate),
    type: 'warning',
  });

  return deadlines;
};

export async function GET() {
  // Recalculate days remaining for all events
  const updatedEvents = timelineEvents.map(event => ({
    ...event,
    daysRemaining: calculateDaysRemaining(event.date),
  }));

  return NextResponse.json(updatedEvents);
}

export async function POST(request) {
  const { title, date, type } = await request.json();

  if (!title || !date || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newEvent = {
    id: timelineEvents.length + 1,
    title,
    date,
    daysRemaining: calculateDaysRemaining(date),
    type,
  };
  timelineEvents.push(newEvent);

  // Automatically calculate and add associated deadlines
  const associatedDeadlines = calculateDeadlines(newEvent);
  timelineEvents.push(...associatedDeadlines);
  
  return NextResponse.json(newEvent, { status: 201 });
}