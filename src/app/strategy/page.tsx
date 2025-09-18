// src/app/strategy/page.tsx

'use client';

import { useState } from 'react';

export default function StrategyPage() {
  const [caseFacts, setCaseFacts] = useState('');
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateStrategy = async () => {
    setLoading(true);
    setError('');
    setStrategy('');

    try {
      const response = await fetch('/api/legal-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseFacts }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStrategy(data.strategy);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-warm-ivory text-charcoal-navy font-body min-h-screen px-6 py-10 space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-header text-dusty-mauve mb-2">Strategy Generator</h1>
        <p className="text-slate-gray text-lg max-w-2xl mx-auto">
          Describe your case facts below. Our trauma-informed AI will generate a legal strategy tailored to your situation.
        </p>
      </header>

      <section className="max-w-3xl mx-auto space-y-6">
        <textarea
          value={caseFacts}
          onChange={(e) => setCaseFacts(e.target.value)}
          placeholder="Enter your case facts here..."
          className="w-full h-40 p-4 border border-dusty-mauve rounded-md bg-white text-charcoal-navy resize-none"
        />

        <button
          onClick={handleGenerateStrategy}
          disabled={loading || !caseFacts.trim()}
          className="button-danger w-full"
        >
          {loading ? 'Generating...' : 'Generate Strategy'}
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}

        {strategy && (
          <div className="mt-8 p-6 bg-white border border-dusty-mauve rounded-md shadow-sm">
            <h2 className="text-xl font-header text-charcoal-navy mb-2">Suggested Strategy</h2>
            <p className="text-slate-gray whitespace-pre-line">{strategy}</p>
          </div>
        )}
      </section>

      <footer className="text-center text-sm text-slate-gray mt-12">
        Strategies are generated with compassion and clarity. You’re not just preparing a case—you’re reclaiming your voice.
      </footer>
    </main>
  );
}