import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
// Represents a full timeline event object
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

// Represents the data needed to create a new event (omitting the id)
export type NewTimelineEvent = Omit<TimelineEvent, 'id'>;

// --- API HELPER FUNCTIONS ---
// It's good practice to define API calls separately from the hook logic.

const API_BASE_URL = '/api/events';

const fetchEvents = async (caseId: string): Promise<TimelineEvent[]> => {
  const response = await fetch(`${API_BASE_URL}?case_id=${caseId}`);
  if (!response.ok) throw new Error('Failed to fetch events');
  const data = await response.json();
  return data.events; // Assuming the API returns { events: [...] }
};

const createEvent = async (newEvent: NewTimelineEvent): Promise<TimelineEvent> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEvent),
  });
  if (!response.ok) throw new Error('Failed to create event');
  return response.json();
};

const updateEvent = async (updatedEvent: TimelineEvent): Promise<TimelineEvent> => {
  const response = await fetch(`${API_BASE_URL}/${updatedEvent.id}`, {
    method: 'PUT', // or PATCH
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedEvent),
  });
  if (!response.ok) throw new Error('Failed to update event');
  return response.json();
};

const deleteEvent = async (eventId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${eventId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete event');
};


// --- THE CUSTOM HOOK ---

/**
 * Custom hook to manage all data and operations for the timeline feature.
 * It encapsulates TanStack Query logic for fetching, creating, updating, and deleting events.
 */
export function useTimeline(caseId: string) {
  const queryClient = useQueryClient();

  // Query to fetch all events
  const { data: events, isLoading, error } = useQuery<TimelineEvent[]>({ 
    queryKey: ['events', caseId], 
    queryFn: () => fetchEvents(caseId),
    enabled: !!caseId, // Only run the query if caseId is available
  });

  // Mutation to add a new event
  const addEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      // When a new event is added, invalidate the 'events' query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // Mutation to update an existing event
  const updateEventMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // Mutation to delete an event
  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // Return all the state and functions the UI component will need
  return {
    events: events ?? [],
    isLoading,
    error,
    addEvent: addEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    // Expose mutation states for more detailed UI feedback (e.g., disabling buttons)
    isAdding: addEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
  };
}
