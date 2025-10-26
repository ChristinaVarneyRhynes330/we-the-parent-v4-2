'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin } from 'lucide-react';
import { useTimeline } from '@/hooks/useTimeline';
import { useCase } from '@/contexts/CaseContext';
import EventForm from '@/components/EventForm';

export default function CalendarPage() {
  const { activeCase } = useCase();
  const { events, isLoading, error, addEvent } = useTimeline(activeCase?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddEvent = async (eventData: any) => {
    if (!activeCase) return;
    await addEvent({ ...eventData, case_id: activeCase.id });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-header text-charcoal-navy">Calendar</h1>
              <p className="text-slate-gray mt-2">Manage your court dates and appointments</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="button-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Event
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="section-subheader">Upcoming Events</h2>
                {isLoading && <p>Loading events...</p>}
                {error && <p className="text-red-500">Error: {error.message}</p>}
                <div className="space-y-4">
                  {!isLoading && !error && events.map((event) => (
                    <div key={event.id} className={`p-4 border-l-4 rounded-r-lg ${getEventColor(event.event_type)}`}>
                      <h3 className="font-semibold text-charcoal-navy">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-gray">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(event.date).toLocaleTimeString()}
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
                    <p className="text-2xl font-header text-garnet">{events.filter(e => e.event_type === 'hearing').length}</p>
                    <p className="text-sm text-slate-gray">Upcoming Hearings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-header text-dusty-mauve">{events.filter(e => e.event_type === 'appointment').length}</p>
                    <p className="text-sm text-slate-gray">Appointments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FIX: Conditionally render EventForm instead of using isOpen prop */}
      {isModalOpen && (
        <EventForm 
          event={null} 
          onSubmit={handleAddEvent} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}