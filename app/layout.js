import Image from 'next/image';
import Sidebar from '../components/Sidebar'; // Import the new sidebar
import './globals.css';

export const metadata = {
  title: 'We The Parent',
  description: 'AI-Powered Legal Toolkit',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header style={{ 
            padding: '1rem', 
            backgroundColor: '#ffffff', 
            borderBottom: '1px solid #dee2e6',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Image 
              src="/logo.png" 
              alt="We The Parent Logo" 
              width={150} 
              height={50}
              style={{ objectFit: 'contain' }}
            />
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}