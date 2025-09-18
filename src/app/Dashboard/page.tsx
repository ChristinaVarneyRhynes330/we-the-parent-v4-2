// src/app/dashboard/page.tsx

'use client';

export default function DashboardPage() {
  return (
    <section className="space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-header text-dusty-mauve mb-2">
          Your Advocacy Dashboard
        </h1>
        <p className="text-lg font-body text-slate-gray max-w-2xl mx-auto">
          Welcome back. Here’s where you track your case, manage documents, and plan your next legal moves with clarity and confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-warm-ivory border border-dusty-mauve p-6 shadow-sm">
          <h3 className="text-xl font-header text-charcoal-navy mb-2">Case Progress</h3>
          <p className="text-slate-gray text-sm mb-4">
            View your current status, upcoming deadlines, and emotional tone indicators.
          </p>
          <a href="/cases" className="button-secondary">View Case</a>
        </div>

        <div className="card bg-warm-ivory border border-dusty-mauve p-6 shadow-sm">
          <h3 className="text-xl font-header text-charcoal-navy mb-2">Documents</h3>
          <p className="text-slate-gray text-sm mb-4">
            Upload, organize, and export your legal documents securely.
          </p>
          <a href="/documents" className="button-secondary">Manage Files</a>
        </div>

        <div className="card bg-warm-ivory border border-dusty-mauve p-6 shadow-sm">
          <h3 className="text-xl font-header text-charcoal-navy mb-2">Strategy Generator</h3>
          <p className="text-slate-gray text-sm mb-4">
            Generate trauma-informed legal strategies tailored to your case facts.
          </p>
          <a href="/strategy" className="button-danger">Generate Strategy</a>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-slate-gray">
          Need help navigating? You’re not alone. Every module is designed to support you emotionally and legally.
        </p>
      </div>
    </section>
  );
}