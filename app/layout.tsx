import type { Metadata } from 'next';
import { DM_Serif_Display, Work_Sans } from 'next/font/google';
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';

// Setup font variables
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-header', // This name matches the CSS
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body', // This name matches the CSS
});

export const metadata: Metadata = {
  title: 'We The Parent',
  description: 'AI legal assistant for Florida juvenile dependency cases',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font variables to the body tag */}
      <body className={`${dmSerif.variable} ${workSans.variable}`}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}