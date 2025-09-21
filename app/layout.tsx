import type { Metadata } from 'next';
import { DM_Serif_Display, Work_Sans } from 'next/font/google';
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';

// Setup font variables with proper fallbacks
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
  manifest: '/site.webmanifest',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${workSans.variable}`}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/dm-serif-display-v13-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/work-sans-v19-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1E1F2F" />
        <meta name="msapplication-TileColor" content="#1E1F2F" />
      </head>
      <body className="font-body antialiased bg-warm-ivory text-charcoal-navy overflow-hidden">
        {/* Loading state */}
        <div id="loading-screen" className="fixed inset-0 bg-charcoal-navy z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mb-4 animate-bounce-soft">
              <div className="w-8 h-8 bg-white rounded-full opacity-90"></div>
            </div>
            <h1 className="text-white font-header text-xl mb-2">We The Parent™</h1>
            <div className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-brand rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main app layout */}
        <div className="flex h-screen w-full">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">
            <div className="min-h-full">
              {children}
            </div>
          </main>
        </div>

        {/* Screen size indicator (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-charcoal-navy text-white px-2 py-1 rounded text-xs font-mono z-50">
            <span className="sm:hidden">xs</span>
            <span className="hidden sm:inline md:hidden">sm</span>
            <span className="hidden md:inline lg:hidden">md</span>
            <span className="hidden lg:inline xl:hidden">lg</span>
            <span className="hidden xl:inline 2xl:hidden">xl</span>
            <span className="hidden 2xl:inline">2xl</span>
          </div>
        )}

        {/* Hide loading screen after page loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                  const loadingScreen = document.getElementById('loading-screen');
                  if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.transition = 'opacity 0.5s ease-out';
                    setTimeout(function() {
                      loadingScreen.style.display = 'none';
                    }, 500);
                  }
                }, 800);
              });
            `,
          }}
        />
      </body>
    </html>
  );
}