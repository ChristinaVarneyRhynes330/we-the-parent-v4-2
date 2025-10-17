'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

export default function AppClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <body className="font-body antialiased bg-warm-ivory text-charcoal-navy">
      {loading && (
        <div className="fixed inset-0 bg-charcoal-navy z-50 flex items-center justify-center transition-opacity duration-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mb-4 animate-bounce-soft mx-auto">
              <div className="w-8 h-8 bg-white rounded-full opacity-90"></div>
            </div>
            <h1 className="text-white font-header text-xl mb-2">We The Parent™</h1>
            <div className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-brand rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen w-full">
        <Sidebar />
        
        {/* Main Content - Mobile Optimized */}
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="min-h-full pt-16 lg:pt-0">
            {children}
          </div>
        </main>
      </div>

      {/* Development Breakpoint Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-charcoal-navy text-white px-2 py-1 rounded text-xs font-mono z-50 shadow-lg">
          <span className="sm:hidden">xs</span>
          <span className="hidden sm:inline md:hidden">sm</span>
          <span className="hidden md:inline lg:hidden">md</span>
          <span className="hidden lg:inline xl:hidden">lg</span>
          <span className="hidden xl:inline 2xl:hidden">xl</span>
          <span className="hidden 2xl:inline">2xl</span>
        </div>
      )}
    </body>
  );
}