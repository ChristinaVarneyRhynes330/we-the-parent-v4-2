// app/layout.js
import './globals.css'

export const metadata = {
  title: 'We The Parent',
  description: 'Your case dashboard and portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream text-navy font-sans min-h-screen">
        <div className="flex flex-col min-h-screen">
          <header className="bg-sapphire text-cream p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">We The Parent</h1>
              <nav>
                <ul className="flex space-x-4">
                  <li><a href="#" className="hover:text-rose-gold transition-colors">Dashboard</a></li>
                  <li><a href="#" className="hover:text-rose-gold transition-colors">Documents</a></li>
                  <li><a href="#" className="hover:text-rose-gold transition-colors">Timeline</a></li>
                  <li><a href="#" className="hover:text-rose-gold transition-colors">Strategy</a></li>
                </ul>
              </nav>
            </div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto w-full p-4">
            {children}
          </main>

          <footer className="bg-navy text-cream p-4 mt-auto">
            <div className="max-w-7xl mx-auto text-center text-sm">
              &copy; {new Date().getFullYear()} We The Parent. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
