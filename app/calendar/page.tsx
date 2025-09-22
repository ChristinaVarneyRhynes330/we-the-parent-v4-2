'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  type: 'hearing' | 'appointment' | 'deadline';
}

export default function CalendarPage() {
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Adjudicatory Hearing',
      date: '2025-03-15',
      time: '2:00 PM',
      location: '5th Judicial Circuit Court',
      type: 'hearing'
    },
    {
      id: '2',
      title: 'Supervised Visitation',
      date: '2025-03-20',
      time: '10:00 AM',
      location: 'Family Visitation Center',
      type: 'appointment'
    }
  ]);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'hearing':
        return 'border-l-garnet bg-garnet/5';
      case 'appointment':
        return 'border-l-dusty-mauve bg-dusty-mauve/5';
      case 'deadline':
        return 'border-l-terracotta bg-terracotta/5';
      default:
        return 'border-l-slate-gray bg-slate-gray/5';
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-header text-charcoal-navy">Calendar</h1>
            <p className="text-slate-gray mt-2">Manage your court dates and appointments</p>
          </div>
          <button className="button-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="section-subheader">Upcoming Events</h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className={`p-4 border-l-4 rounded-r-lg ${getEventColor(event.type)}`}>
                    <h3 className="font-semibold text-charcoal-navy">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-gray">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <h2 className="section-subheader">Quick Stats</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-header text-garnet">1</p>
                  <p className="text-sm text-slate-gray">Upcoming Hearings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-header text-dusty-mauve">1</p>
                  <p className="text-sm text-slate-gray">Appointments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}