import caseProgress from '@/app/data/caseProgress.json';
import currentCase from '@/app/data/currentCase.json';
import documentTypes from '@/app/data/documentTypes.json';

// Function to fetch events from our new API route
async function getEvents() {
  // We use localhost for development. In production, this will be your Vercel URL.
  const res = await fetch('http://localhost:3000/api/events', { cache: 'no-store' });
  if (!res.ok) {
    console.error('Failed to fetch events');
    return [];
  }
  const data = await res.json();
  return data.events;
}

export default async function Dashboard() {
  const upcomingEvents = await getEvents(); // Fetch live data

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Case Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Current Case Status Widget */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Current Case Status</h2>
          <p className="text-sm text-gray-500">{currentCase.caseNumber}</p>
          <div className="mt-2">
            <p><strong>Status:</strong> {currentCase.status}</p>
            <p><strong>Next Hearing:</strong> {currentCase.nextHearing}</p>
          </div>
        </div>

        {/* Case Progress Widget */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Case Progress</h2>
          <div className="space-y-2 mt-2">
            {caseProgress.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm">
                  <span>{item.stage}</span>
                  <span>{item.status}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Widget - NOW DYNAMIC */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Upcoming Events</h2>
          <ul className="mt-2 space-y-2">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <li key={event.id} className="text-sm text-gray-600">
                  <strong>{new Date(event.starts_at).toLocaleDateString()}:</strong> {event.title}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming events.</p>
            )}
          </ul>
        </div>

        {/* Document Types Widget */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-700">Document Types</h2>
          <ul className="mt-2 space-y-1">
            {documentTypes.map((doc, index) => (
              <li key={index} className="flex justify-between text-sm text-gray-600">
                <span>{doc.type}</span>
                <span>{doc.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}