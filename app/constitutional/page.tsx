'use client';

import React from 'react';
import { Scale } from 'lucide-react';
import { usePrecedents } from '@/hooks/usePrecedents';

export default function ConstitutionalPage() {
  const { precedents, isLoading, error } = usePrecedents();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-ivory p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">Constitutional Law</h1>
          <p className="text-slate-gray mt-2">Key constitutional precedents in parental rights cases</p>
        </div>

        <div className="grid gap-6">
          {precedents.map((precedent, index) => (
            <div key={index} className="card">
              <div className="flex items-start gap-4">
                <Scale className="w-6 h-6 text-dusty-mauve mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-charcoal-navy">{precedent.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      precedent.relevance === 'High' ? 'bg-garnet/10 text-garnet' :
                      precedent.relevance === 'Medium' ? 'bg-terracotta/10 text-terracotta' :
                      'bg-slate-gray/10 text-slate-gray'
                    }`}>
                      {precedent.relevance} Relevance
                    </span>
                  </div>
                  <p className="text-slate-gray">{precedent.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}