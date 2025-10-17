'use client';

import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { useResearch } from '@/hooks/useResearch';

export default function ResearchPage() {
  const { performSearch, isSearching, data, error } = useResearch();
  const [query, setQuery] = useState('');
  const [database, setDatabase] = useState('google_scholar');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    performSearch({ query, database });
  };

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Legal Research</h1>
          <p className="text-slate-gray mt-2">Search for relevant case law and statutes</p>
        </div>

        {/* Search Form */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="form-label">Search Query</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-input w-full"
                placeholder="Enter legal terms, case names, or statutes..."
              />
            </div>
            <div>
              <label className="form-label">Database</label>
              <select
                value={database}
                onChange={(e) => setDatabase(e.target.value)}
                className="form-input"
              >
                <option value="google_scholar">Google Scholar</option>
                <option value="justia">Justia</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="button-primary flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="section-subheader">Search Results</h2>
              <div className="space-y-4">
                {data.results.map((result, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-charcoal-navy mb-2">{result.title}</h3>
                    <p className="text-sm text-slate-gray mb-2">{result.snippet}</p>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dusty-mauve hover:text-garnet text-sm flex items-center gap-1"
                    >
                      View Source <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="section-subheader">Bluebook Citations</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{data.citations}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}