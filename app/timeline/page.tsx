'use client';
import { useState } from 'react';
import { useTimeline, TimelineEvent, NewTimelineEvent } from '@/hooks/useTimeline';
import EventForm from '@/components/EventForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const TimelinePage = () => {
  // Local UI state for managing the form modal
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  // Use the custom hook to get all timeline data and actions
  const { 
    events, 
    isLoading, 
    error, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    isDeleting 
  } = useTimeline();

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
    if (editingEvent) {
      // If we are editing, call the updateEvent mutation
      updateEvent({ ...eventData, id: editingEvent.id });
    } else {
      // Otherwise, call the addEvent mutation
      addEvent(eventData);
    }
    // Close the form after submission
    setIsFormVisible(false);
    setEditingEvent(null);
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
        <Button onClick={handleShowAddForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {isFormVisible && (
        <EventForm
          event={editingEvent}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormVisible(false)}
        />
      )}

      <div className="space-y-8">
        {events.map((event) => (
          <div key={event.id} className="flex items-start">
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
                  <Button variant="destructive" size="sm" onClick={() => deleteEvent(event.id)} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </A_SECOND_ONE>
                </div>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
            <div className="text-center text-gray-500 py-10">
                <p>No events on the timeline yet.</p>
                <p>Click "Add Event" to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
