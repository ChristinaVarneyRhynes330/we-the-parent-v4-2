export default function StrategyPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-serif text-navy">Strategy</h1>

      <div className="card p-4">
        <p className="text-navy/80">
          Living plan of action. Track themes, motions to file, and upcoming asks.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card-muted p-4">
            <h2 className="font-medium text-navy">Open items</h2>
            <ul className="mt-2 list-disc pl-5 text-navy/80">
              <li className="opacity-70">None yet. Add your first timeline event to see suggestions.</li>
            </ul>
          </div>
          <div className="card-muted p-4">
            <h2 className="font-medium text-navy">Notes</h2>
            <p className="mt-2 text-navy/80">Keep short strategic notes here.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
