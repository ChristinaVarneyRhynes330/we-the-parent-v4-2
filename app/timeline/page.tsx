export default function TimelinePage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-serif text-navy">Timeline & Deadlines</h1>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-navy/80">
            Add events and we’ll compute rule-based deadlines. Your next hearing shows on the dashboard.
          </p>
          <button className="btn-secondary">Add event</button>
        </div>

        <ul className="mt-6 space-y-4">
          <li className="card-muted p-4">
            <p className="text-sm text-navy/70">No events yet.</p>
            <p className="text-sm text-navy/60">Tip: add “Shelter Review” and its date to start.</p>
          </li>
        </ul>
      </div>
    </main>
  );
}
