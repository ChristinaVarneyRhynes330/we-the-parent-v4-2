export default function EvidencePage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-serif text-navy">Evidence Binder</h1>

      <div className="card p-4">
        <p className="text-navy/80">
          Store files, photos, audio, and notes. Everything becomes searchable and can be linked to your timeline.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-navy">Upload</h2>
            <div className="mt-3 rounded-md border border-dashed border-navy/20 bg-rust/5 p-10 text-center text-navy/70">
              Drag & drop evidence or click the button.
            </div>
            <div className="mt-3">
              <button className="btn-primary">Upload evidence</button>
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-lg font-semibold text-navy">Recent items</h2>
            <p className="mt-2 text-navy/60">No evidence yet.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
