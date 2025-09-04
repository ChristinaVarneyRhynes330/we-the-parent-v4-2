import './globals.css';
import { Inter } from 'next/font/google';
import { MessageCircle, FileText, Search, Calendar, Gavel, HelpCircle, AlertTriangle, User, Menu, X, Heart } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'We The Parent',
  description: 'AI Legal Assistant for Florida Juvenile Dependency Cases',
  manifest: '/manifest.json',
  themeColor: '#f97316',
};

export default function RootLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const userName = 'Christina';

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Heart },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'research', label: 'Research', icon: Search },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'legal_strategy', label: 'Legal Strategy', icon: Gavel },
    { id: 'pro_se_guide', label: 'Pro Se Guide', icon: HelpCircle },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-slate-700 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">We The Parent™</h1>
                  <p className="text-xs text-slate-600">Protecting Families Through Law</p>
                </div>
              </div>
              <div className="hidden md:flex space-x-8">
                {navLinks.map((nav) => (
                  <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === nav.id ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-700 hover:text-orange-600'}`}>
                    <nav.icon className="h-4 w-4" /><span>{nav.label}</span>
                  </button>
                ))}
              </div>
              <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-slate-400 hover:text-slate-500">
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button onClick={() => setActiveTab('chat')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <MessageCircle className="h-4 w-4" /><span>AI Chat</span>
                </button>
                <button onClick={() => setShowEmergencyMode(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <AlertTriangle className="h-4 w-4" /><span>Emergency</span>
                </button>
                <div className="flex items-center">
                  <div className="bg-slate-700 rounded-full p-2 mr-2"><User className="h-5 w-5 text-white" /></div>
                  <span className="text-sm font-medium text-slate-700">{userName}</span>
                </div>
              </div>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-50">
                {navLinks.map((nav) => (
                  <button key={nav.id} onClick={() => { setActiveTab(nav.id); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${activeTab === nav.id ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                    <nav.icon className="h-5 w-5" /><span>{nav.label}</span>
                  </button>
                ))}
                <button onClick={() => { setShowEmergencyMode(true); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 text-red-700 hover:bg-red-50">
                  <AlertTriangle className="h-5 w-5" /><span>Emergency</span>
                </button>
              </div>
            </div>
          )}
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div><h3 className="font-bold text-slate-800">We The Parent™</h3><p className="text-sm text-slate-600">Empowering families through legal knowledge</p></div>
              <div className="text-sm text-slate-500">Legal assistance platform for self-represented parents</div>
              <div className="text-sm text-slate-500">© 2025 We The Parent. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
