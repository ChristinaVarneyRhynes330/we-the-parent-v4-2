'use client';

import React, { useState } from 'react';
import { FileText, Wand2, Clipboard, Download } from 'lucide-react';

export default function DraftPage() {
  const [documentType, setDocumentType] = useState('Motion');
  const [reason, setReason] = useState('');
  const [outcome, setOutcome] = useState('');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setDraft('');

    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType, reason, outcome }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate draft.');
      }
      setDraft(data.draft);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Draft a Document</h1>
          <p className="text-slate-gray mt-2">Use AI to generate legal document drafts based on your facts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card">
            <h2 className="section-subheader mb-4">1. Provide Details</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Document Type</label>
                <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="form-input">
                  <option>Motion</option>
                  <option>Affidavit</option>
                  <option>Objection</option>
                </select>
              </div>
              <div>
                <label className="form-label">Facts & Reasons</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                  className="form-input"
                  placeholder="e.g., I have completed my parenting classes, secured a full-time job, and have a stable, two-bedroom apartment."
                />
              </div>
              <div>
                <label className="form-label">Desired Outcome</label>
                <textarea
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  rows={3}
                  className="form-input"
                  placeholder="e.g., I am requesting the court to grant overnight visitation with my child."
                />
              </div>
              <button onClick={handleGenerate} disabled={isGenerating} className="button-primary w-full flex items-center justify-center gap-2">
                <Wand2 className="w-5 h-5" />
                {isGenerating ? 'Generating...' : 'Generate Draft'}
              </button>
              {error && <p className="form-error mt-2">{error}</p>}
            </div>
          </div>

          {/* Output Display */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="section-subheader">2. Review & Finalize</h2>
              {draft && (
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(draft)} className="p-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors" title="Copy">
                    <Clipboard className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors" title="Download">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="prose prose-sm max-w-none bg-white p-4 rounded-lg border h-96 overflow-y-auto">
              {isGenerating ? <p>Generating your document...</p> : draft || <p>Your generated document will appear here.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}