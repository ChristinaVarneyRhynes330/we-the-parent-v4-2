'use client';
import { useState, useEffect } from 'react';
import { useTimeline, TimelineEvent, NewTimelineEvent } from '@/hooks/useTimeline';
import EventForm from '@/components/EventForm';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle } from 'lucide-react';

import { useCase } from '@/contexts/CaseContext';

const TimelinePage = () => {
  // Local UI state for managing the form modal
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { activeCase } = useCase();

  // Use the custom hook to get all timeline data and actions
  const { 
    events, 
    isLoading, 
    error, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    isDeleting 
  } = useTimeline(activeCase?.id, { enabled: !!activeCase });

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // --- Event Handlers ---

  const handleShowAddForm = () => {
    setEditingEvent(null);
    setIsFormVisible(true);
  };

  const handleShowEditForm = (event: TimelineEvent) => {
    setEditingEvent(event);
    setIsFormVisible(true);
  };

  const handleFormSubmit = (eventData: NewTimelineEvent) => {
    if (!activeCase) return;
    const eventWithCaseId = { ...eventData, case_id: activeCase.id };

    if (editingEvent) {
      // If we are editing, call the updateEvent mutation
      updateEvent({ ...eventWithCaseId, id: editingEvent.id }, {
        onSuccess: () => setSuccessMessage('Event updated successfully'),
        onError: (error) => {
          console.error('Update event error:', error);
        }
      });
    } else {
      // Otherwise, call the addEvent mutation
      addEvent(eventWithCaseId, {
        onSuccess: () => setSuccessMessage('Event created successfully'),
        onError: (error) => {
          console.error('Create event error:', error);
        }
      });
    }
    // Close the form after submission
    setIsFormVisible(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id, {
        onSuccess: () => setSuccessMessage('Event deleted successfully'),
        onError: (error) => {
          console.error('Delete event error:', error);
        }
      });
    }
  };

  // --- Render Logic ---

  if (isLoading) {
    return <div className="p-6">Loading timeline...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading timeline: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Case Timeline</h1>
        <div data-testid="total-events-stat">Total Number of Events: {events.length}</div>
        <Button onClick={handleShowAddForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Event
        </Button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <div className="flex">
            <div className="py-1"><CheckCircle className="h-5 w-5 text-green-500 mr-3" /></div>
            <div>
              <p className="font-bold">Success</p>
              <p>{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {isFormVisible && (
        <EventForm
          event={editingEvent}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormVisible(false)}
        />
      )}

      <div className="space-y-8">
        {events.map((event) => (
          <div key={event.id} className="flex items-start event-item">
            <div className="flex flex-col items-center mr-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <div className="w-px h-full bg-gray-300" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md w-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{event.title}</p>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="mt-2 text-gray-700">{event.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleShowEditForm(event)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
            <div className="text-center text-gray-500 py-10">
                <p>No events on the timeline yet.</p>
                <p>Click &quot;Add New Event&quot; to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
