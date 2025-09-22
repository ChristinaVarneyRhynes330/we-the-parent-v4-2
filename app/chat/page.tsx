'use client';

import React from 'react';
import WeTheParentChat from '@/components/WeTheParentChat';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-warm-ivory p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-header text-charcoal-navy">AI Legal Assistant</h1>
          <p className="text-slate-gray mt-2">Get help with your case questions and document analysis</p>
        </div>

        {/* Chat Component */}
        <div className="h-[calc(100vh-200px)]">
          <WeTheParentChat />
        </div>
      </div>
    </div>
  );
}