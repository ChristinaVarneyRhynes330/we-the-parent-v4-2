// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import type { Document } from '@/hooks/useDocuments';
import type { TimelineEvent } from '@/hooks/useTimeline';
import type { NarrativeEntry } from '@/hooks/useNarrative';

// In-memory "database"
let mockDocuments: Document[] = [];
let mockTimelineEvents: TimelineEvent[] = [];
let mockNarrativeEntries: NarrativeEntry[] = [];

// Helper to reset the state
export const resetDb = () => {
  mockDocuments = [];
  mockTimelineEvents = [];
  mockNarrativeEntries = [];
};

export const handlers = [
  // --- Documents ---
  http.get('**/api/documents', () => {
    return HttpResponse.json({ documents: mockDocuments });
  }),
  http.post('**/api/upload', async () => {
    const newDoc: Document = {
      id: `mock-doc-${Date.now()}`,
      case_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      file_name: 'mock-file.txt',
      file_path: '/mock/path',
      storage_path: '/mock/path',
      file_type: 'text/plain',
      file_size: 123,
      document_type: 'File',
      summary: 'A mock document.',
      created_at: new Date().toISOString(),
    };
    mockDocuments.push(newDoc);
    return HttpResponse.json({ document: newDoc });
  }),
  http.delete('**/api/documents/:id', ({ params }) => {
    mockDocuments = mockDocuments.filter(doc => doc.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- Timeline ---
  http.get('**/api/events', () => {
    return HttpResponse.json({ events: mockTimelineEvents });
  }),
  http.post('**/api/events', async ({ request }) => {
    const newEventData = await request.json() as Omit<TimelineEvent, 'id'>;
    const newEvent: TimelineEvent = { id: `mock-event-${Date.now()}`, ...newEventData };
    mockTimelineEvents.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // --- Narrative ---
  http.get('**/api/narrative', () => {
    return HttpResponse.json({ entries: mockNarrativeEntries });
  }),
  http.post('**/api/narrative', async ({ request }) => {
    const postData = await request.json() as Omit<NarrativeEntry, 'id' | 'created_at'>;
    const newEntry: NarrativeEntry = {
        id: `mock-entry-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...postData
    };
    mockNarrativeEntries.push(newEntry);
    return HttpResponse.json(newEntry, { status: 201 });
  }),
];