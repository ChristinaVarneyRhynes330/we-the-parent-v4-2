// File: app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { CaseProvider } from '@/contexts/CaseContext';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'We The Parent™ | AI Litigation Assistant',
  description: 'AI-Augmented Self-Litigation Ecosystem for Pro Se Parental Defenders in Florida Juvenile Dependency Cases',
  // --- PWA/Accessibility Metadata (Feature 13) ---
  applicationName: 'We The Parent',
  themeColor: '#4c51bf', // Indigo/Blue color theme
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX: Added 'lang' attribute for screen reader compliance (Accessibility)
    <html lang="en"> 
      <body className={inter.className}>
        <Providers>
          <CaseProvider>
            {children}
          </CaseProvider>
        </Providers>
      </body>
    </html>
  );
}