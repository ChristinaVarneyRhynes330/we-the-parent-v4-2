// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-warm-ivory text-charcoal-navy font-body">
        <header className="bg-dusty-mauve text-white px-6 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-2xl font-header tracking-wide">We The Parent™</h1>
          <nav className="space-x-6 text-sm font-medium">
            <a href="/dashboard" className="hover:underline">Dashboard</a>
            <a href="/documents" className="hover:underline">Documents</a>
            <a href="/strategy" className="hover:underline">Strategy</a>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
        <footer className="text-center text-slate-gray text-sm py-6">
          © 2025 We The Parent. All rights reserved.
        </footer>
      </body>
    </html>
  );
}