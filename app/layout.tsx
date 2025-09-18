import { DM_Serif_Display, Work_Sans } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-header',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
});

export const metadata = {
  title: 'We The Parent',
  description: 'AI legal assistant for Florida juvenile dependency cases',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${workSans.variable} font-body bg-warm-ivory text-charcoal-navy`}>
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