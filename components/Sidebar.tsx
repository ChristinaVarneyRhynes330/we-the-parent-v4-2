'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, FileText, Users, Calendar, MessageSquare, BookOpen, 
  Search, Scale, Upload, AlertTriangle, CheckCircle, Menu, X
} from 'lucide-react';
import { useCase } from '@/contexts/CaseContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Documents', href: '/documents', icon: Upload },
  { name: 'Timeline', href: '/timeline', icon: Calendar },
  { name: 'Children', href: '/children', icon: Users },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Draft', href: '/draft', icon: FileText },
  { name: 'Guide', href: '/guide', icon: BookOpen },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'Emergency', href: '/emergency', icon: AlertTriangle },
  { name: 'Compliance', href: '/compliance', icon: CheckCircle },
  { name: 'Constitutional', href: '/constitutional', icon: Scale },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const pathname = usePathname();
  const { cases, activeCase, setActiveCase, loading } = useCase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
        </div>
        <h1 className="ml-3 text-xl font-header text-white">We The Parent™</h1>
      </div>

      {/* Case Selector */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="bg-white/5 rounded-lg p-3">
          <label htmlFor="case-selector" className="text-xs text-warm-ivory/70 mb-1 block">
            Current Case
          </label>
          {loading ? (
            <div className="text-sm text-white font-medium">Loading...</div>
          ) : cases.length > 0 ? (
            <select
              id="case-selector"
              className="w-full bg-transparent text-sm text-white font-medium border-none focus:ring-0 cursor-pointer"
              value={activeCase?.id || ''}
              onChange={(e) => setActiveCase(e.target.value)}
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id} className="bg-charcoal-navy text-white">
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-white font-medium">No cases</div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={classNames(
                isActive
                  ? 'bg-dusty-mauve text-white'
                  : 'text-warm-ivory hover:bg-white/10 hover:text-white',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
              )}
            >
              <Icon
                className={classNames(
                  isActive ? 'text-white' : 'text-warm-ivory/70 group-hover:text-white',
                  'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-white/10">
        <p className="text-xs text-warm-ivory/50 text-center">
          We The Parent™ v1.0
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-charcoal-navy text-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-charcoal-navy">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={classNames(
          'lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-charcoal-navy transform transition-transform duration-300 ease-in-out',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}