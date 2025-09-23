'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, MapPin, FileText, AlertTriangle, Scale, Users, BookOpen } from 'lucide-react';
import EventForm from '@/components/EventForm';

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9'; 

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_type: string;
  description: string | null;
  location: string | null;
  notes: string | null;
}

export default function TimelinePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [narrative, setNarrative] = useState('');
  const [generatingNarrative, setGeneratingNarrative] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events?case_id=${CASE_ID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNarrative = async () => {
    setGeneratingNarrative(true);
    try {
      const response = await fetch('/api/narrative/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: CASE_ID })
      });

      const data = await response.json();
      if (response.ok) {
        setNarrative(data.narrative);
      } else {
        alert('Failed to generate narrative: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating narrative:', error);
      alert('Failed to generate narrative');
    } finally {
      setGeneratingNarrative(false);
    }
  };

  const getEventTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hearing':
        return { icon: Scale, color: 'garnet', bg: 'bg-garnet/10' };
      case 'deadline':
        return { icon: AlertTriangle, color: 'terracotta', bg: 'bg-terracotta/10' };
      case 'appointment':
        return { icon: Users, color: 'dusty-mauve', bg: 'bg-dusty-mauve/10' };
      case 'filing':
        return { icon: FileText, color: 'olive-emerald', bg: 'bg-olive-emerald/10' };
      default:
        return { icon: Calendar, color: 'slate-gray', bg: 'bg-slate-gray/10' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-8">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <EventForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventAdded={fetchEvents}
      />
      
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-header text-charcoal-navy">Case Timeline</h1>
              <p className="text-slate-gray mt-2">A chronological record of all your case events</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={generateNarrative}
                disabled={generatingNarrative}
                className="button-secondary flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                {generatingNarrative ? 'Generating...' : 'Generate Story'}
              </button>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="button-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Event
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <div className="relative border-l-2 border-dusty-mauve/20 pl-8 space-y-12">
                {events.length === 0 ? (
                  <div className="card text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No events found for this case.</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Add Event" to start building your timeline.</p>
                  </div>
                ) : (
                  events.map((event) => {
                    const { icon: Icon, color, bg } = getEventTypeStyle(event.event_type);
                    
                    return (
                      <div key={event.id} className="relative">
                        <div className={`absolute -left-11 top-1 w-6 h-6 ${bg} rounded-full flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 text-${color}`} />
                        </div>
                        <div className="card hover:shadow-brand transition-shadow">
                          <p className="text-sm font-semibold text-dusty-mauve mb-2">{formatDate(event.event_date)}</p>
                          <h3 className="font-header text-xl text-charcoal-navy mb-2">{event.title}</h3>
                          {event.description && <p className="text-slate-gray text-sm mb-2">{event.description}</p>}
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-gray">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Narrative Panel */}
            <div className="card">
              <h2 className="section-subheader">Your Story</h2>
              {narrative ? (
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {narrative}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-2">No narrative generated</p>
                  <p className="text-xs text-gray-400">Click "Generate Story" to create a narrative from your timeline</p>
                </div>
              )}
              
              {narrative && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigator.clipboard.writeText(narrative)}
                    className="button-secondary text-sm w-full"
                  >
                    Copy Narrative
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}