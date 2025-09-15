import './globals.css'
import Sidebar from '@/components/Sidebar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'We The Parent',
  description: 'Legal AI Assistant for Juvenile Dependency Cases',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0B1A2A] text-[#F5F5F5]`}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}