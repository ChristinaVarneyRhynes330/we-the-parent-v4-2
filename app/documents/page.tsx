export default function DocumentsPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-serif text-navy">Documents</h1>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <p className="text-navy/80">Upload files, photos, or audio. Everything becomes searchable and linkable.</p>
          <button className="btn-primary">Upload</button>
        </div>

        <div className="mt-6 rounded-md border border-dashed border-navy/20 bg-rust/5 p-10 text-center text-navy/70">
          Drag & drop files here or click Upload.
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold heading">Recent</h2>
          <p className="mt-2 text-navy/60">No documents yet.</p>
        </div>
      </div>
    </main>
  );
}
