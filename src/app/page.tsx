// src/app/page.tsx

'use client';

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="text-center">
        <h1 className="text-5xl font-header text-dusty-mauve mb-4">
          Welcome to We The Parent™
        </h1>
        <p className="text-lg font-body text-slate-gray max-w-2xl mx-auto">
          Your trauma-informed legal companion. Track your case, upload documents, generate strategy, and respond to objections—all in one emotionally attuned dashboard.
        </p>
      </div>

      <div className="flex justify-center gap-6">
        <a href="/dashboard" className="button-primary">
          Go to Dashboard
        </a>
        <a href="/documents" className="button-secondary">
          Upload Documents
        </a>
        <a href="/strategy" className="button-danger">
          Generate Strategy
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="card bg-warm-ivory border border-dusty-mauve p-6">
          <h3 className="text-xl font-header text-charcoal-navy mb-2">Case Overview</h3>
          <p className="text-slate-gray text-sm">
            Track your ongoing case progress with clarity and confidence.
          </p>
        </div>
        <div className="card bg-warm-ivory border border-dusty-mauve p-6">
          <h3 className="text-xl font-header text-charcoal-navy mb-2">Documents</h3>
          <p className="text-slate-gray text-sm">
            Upload and review case files securely, with emotional tone indicators.
          </p>
        </div>
        <div className="card bg-warm-ivory border border-dusty-mauve p-6">
          <h3 className="text-xl font-header text-charcoal-navy mb-2">Strategy</h3>
          <p className="text-slate-gray text-sm">
            Plan your next legal moves with AI-powered insight and trauma-informed guidance.
          </p>
        </div>
      </div>
    </section>
  );
}