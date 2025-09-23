'use client';

import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, Download, Copy, Check } from 'lucide-react';

const CASE_ID = 'bf45b3cd-652c-43db-b535-38ab89877ff9';

export default function NarrativePage() {
  const [narrative, setNarrative] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateNarrative = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/narrative/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: CASE_ID })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNarrative(data.narrative);
      } else {
        throw new Error(data.error || 'Failed to generate narrative');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!narrative) return;
    
    try {
      await navigator.clipboard.writeText(narrative);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    if (!narrative) return;
    
    const blob = new Blob([narrative], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `case_narrative_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Case Narrative Generator</h1>
          <p className="text-slate-gray mt-2">Generate a compelling narrative from your case timeline events</p>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-subheader mb-2">Generate Your Story</h2>
              <p className="text-slate-gray text-sm">
                This tool will analyze your case timeline and create a professional narrative 
                highlighting your progress and compliance with court orders.
              </p>
            </div>
            <button
              onClick={generateNarrative}
              disabled={loading}
              className="button-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Generate Narrative
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-garnet/10 border border-garnet/20 rounded-lg p-4 mb-6">
            <p className="text-garnet">{error}</p>
          </div>
        )}

        {/* Generated Narrative */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-subheader">Your Case Narrative</h2>
            {narrative && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 text-dusty-mauve hover:bg-dusty-mauve/10 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-2 text-olive-emerald hover:bg-olive-emerald/10 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            )}
          </div>

          {narrative ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {narrative}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No narrative generated yet</p>
              <p className="text-sm text-gray-400">
                Click "Generate Narrative" to create your case story based on timeline events
              </p>
            </div>
          )}

          {/* Usage Tips */}
          {narrative && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-charcoal-navy mb-3">Usage Tips</h3>
              <ul className="text-sm text-slate-gray space-y-2">
                <li>• Review the narrative for accuracy and completeness</li>
                <li>• Use this as a foundation for court documents and statements</li>
                <li>• Highlight your progress and commitment to your children</li>
                <li>• Consider adding specific dates and achievements</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}