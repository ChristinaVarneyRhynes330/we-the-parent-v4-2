import type { Metadata } from 'next';
import { DM_Serif_Display, Work_Sans } from 'next/font/google';
import '../styles/globals.css';
import AppClientLayout from '@/components/AppClientLayout'; // Import the new component
import Providers from '@/components/Providers';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-header',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: 'We The Parent™',
    template: '%s | We The Parent™'
  },
  description: 'AI-Augmented Self-Litigation Ecosystem for Pro Se Parental Defenders in Florida Juvenile Dependency Cases',
  keywords: ['Florida', 'juvenile dependency', 'pro se', 'legal assistant', 'parental rights', 'family law'],
  authors: [{ name: 'We The Parent Team' }],
  creator: 'We The Parent',
  publisher: 'We The Parent',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wetheparent.com',
    siteName: 'We The Parent™',
    title: 'We The Parent™ - AI Legal Assistant for Parents',
    description: 'ZERO COST AI-Augmented Self-Litigation Ecosystem for Pro Se Parental Defenders in Florida Juvenile Dependency Cases',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'We The Parent - AI Legal Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'We The Parent™ - AI Legal Assistant for Parents',
    description: 'ZERO COST AI-Augmented Self-Litigation Ecosystem for Pro Se Parental Defenders in Florida',
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${workSans.variable}`}>
      <Providers>
        <AppClientLayout>{children}</AppClientLayout>
      </Providers>
    </html>
  );
}