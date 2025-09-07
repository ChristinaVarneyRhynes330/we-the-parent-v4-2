import Image from 'next/image';
import './globals.css';

export const metadata = {
  title: 'We The Parent',
  description: 'AI-Powered Legal Toolkit',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Image 
            src="/logo.png" 
            alt="We The Parent Logo" 
            width={150} 
            height={50} 
          />
        </header>
        <main style={{ padding: '1rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}