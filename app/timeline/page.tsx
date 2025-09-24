'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, MapPin, FileText, AlertTriangle, Scale, Users, BookOpen, Edit, Trash2 } from 'lucide-react';
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
  created_at: string;
}

interface TimelineStats {
  totalEvents: number;
  upcomingEvents: number;
  completedTasks: number;
  daysToNextHearing: number;
}

export default function TimelinePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [narrative, setNarrative] = useState('');
  const [generatingNarrative, setGeneratingNarrative] = useState(false);
  const [stats, setStats] = useState<TimelineStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    completedTasks: 0,
    daysToNextHearing: 0
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [events]);

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

  const calculateStats = () => {
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.event_date) > now);
    const nextHearing = events
      .filter(event => event.event_type.toLowerCase() === 'hearing' && new Date(event.event_date) > now)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())[0];
    
    const daysToNext = nextHearing 
      ? Math.ceil((new Date(nextHearing.event_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    setStats({
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,
      completedTasks: events.filter(event => event.event_type.toLowerCase() === 'filing').length,
      daysToNextHearing: daysToNext
    });
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

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchEvents(); // Refresh the list
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const getEventTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hearing':
        return { icon: Scale, color: 'garnet', bg: 'bg-garnet/10', border: 'border-garnet' };
      case 'deadline':
        return { icon: AlertTriangle, color: 'terracotta', bg: 'bg-terracotta/10', border: 'border-terracotta' };
      case 'appointment':
        return { icon: Users, color: 'dusty-mauve', bg: 'bg-dusty-mauve/10', border: 'border-dusty-mauve' };
      case 'filing':
        return { icon: FileText, color: 'olive-emerald', bg: 'bg-olive-emerald/10', border: 'border-olive-emerald' };
      default:
        return { icon: Calendar, color: 'slate-gray', bg: 'bg-slate-gray/10', border: 'border-slate-gray' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isEventUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const isEventSoon = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7 && diffDays > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded"></div>)}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-gray">Total Events</p>
                  <p className="text-2xl font-header text-charcoal-navy">{stats.totalEvents}</p>
                </div>
                <Calendar className="w-8 h-8 text-dusty-mauve" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-gray">Upcoming Events</p>
                  <p className="text-2xl font-header text-charcoal-navy">{stats.upcomingEvents}</p>
                </div>
                <Clock className="w-8 h-8 text-terracotta" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-gray">Documents Filed</p>
                  <p className="text-2xl font-header text-charcoal-navy">{stats.completedTasks}</p>
                </div>
                <FileText className="w-8 h-8 text-olive-emerald" />
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-gray">Days to Next Hearing</p>
                  <p className={`text-2xl font-header ${stats.daysToNextHearing <= 7 ? 'text-garnet' : 'text-charcoal-navy'}`}>
                    {stats.daysToNextHearing || '--'}
                  </p>
                </div>
                <Scale className="w-8 h-8 text-garnet" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="section-subheader">Event Timeline</h2>
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No events found for this case.</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Add Event" to start building your timeline.</p>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-dusty-mauve/20 pl-8 space-y-8">
                    {events
                      .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
                      .map((event) => {
                        const { icon: Icon, color, bg, border } = getEventTypeStyle(event.event_type);
                        const upcoming = isEventUpcoming(event.event_date);
                        const soon = isEventSoon(event.event_date);
                        
                        return (
                          <div key={event.id} className="relative group">
                            <div className={`absolute -left-11 top-1 w-6 h-6 ${bg} rounded-full flex items-center justify-center border-2 ${border}`}>
                              <Icon className={`w-4 h-4 text-${color}`} />
                            </div>
                            
                            <div className={`bg-white rounded-lg border p-4 hover:shadow-brand transition-all duration-200 ${
                              soon ? 'border-terracotta bg-terracotta/5' : 
                              upcoming ? 'border-dusty-mauve/30' : 'border-gray-200'
                            }`}>
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className={`text-sm font-semibold ${upcoming ? 'text-dusty-mauve' : 'text-slate-gray'}`}>
                                      {formatDate(event.event_date)}
                                    </p>
                                    {soon && (
                                      <span className="px-2 py-1 text-xs bg-terracotta/10 text-terracotta rounded-full">
                                        Coming Soon
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="font-header text-lg text-charcoal-navy mb-1">{event.title}</h3>
                                </div>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    className="p-1 text-dusty-mauve hover:bg-dusty-mauve/10 rounded"
                                    title="Edit event"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteEvent(event.id)}
                                    className="p-1 text-garnet hover:bg-garnet/10 rounded"
                                    title="Delete event"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {event.description && (
                                <p className="text-slate-gray text-sm mb-2">{event.description}</p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-slate-gray">
                                <span className={`px-2 py-1 rounded-full ${bg} text-${color}`}>
                                  {event.event_type}
                                </span>
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events Quick View */}
              <div className="card">
                <h3 className="font-semibold text-charcoal-navy mb-4">Next 30 Days</h3>
                <div className="space-y-3">
                  {events
                    .filter(event => {
                      const eventDate = new Date(event.event_date);
                      const now = new Date();
                      const diffTime = eventDate.getTime() - now.getTime();
                      const diffDays = diffTime / (1000 * 60 * 60 * 24);
                      return diffDays > 0 && diffDays <= 30;
                    })
                    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                    .slice(0, 5)
                    .map((event) => {
                      const { icon: Icon, color } = getEventTypeStyle(event.event_type);
                      return (
                        <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <Icon className={`w-4 h-4 text-${color} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-charcoal-navy text-sm truncate">{event.title}</p>
                            <p className="text-xs text-slate-gray">{formatDateShort(event.event_date)}</p>
                          </div>
                        </div>
                      );
                    })}
                  {events.filter(event => {
                    const eventDate = new Date(event.event_date);
                    const now = new Date();
                    const diffTime = eventDate.getTime() - now.getTime();
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);
                    return diffDays > 0 && diffDays <= 30;
                  }).length === 0 && (
                    <p className="text-sm text-slate-gray">No upcoming events in the next 30 days</p>
                  )}
                </div>
              </div>

              {/* Narrative Panel */}
              <div className="card">
                <h3 className="font-semibold text-charcoal-navy mb-4">Your Story</h3>
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(narrative)}
                        className="button-secondary text-sm flex-1"
                      >
                        Copy Narrative
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([narrative], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `case_narrative_${new Date().toISOString().split('T')[0]}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="button-secondary text-sm flex-1"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}