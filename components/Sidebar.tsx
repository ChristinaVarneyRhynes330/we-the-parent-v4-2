'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Users, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  Search, 
  Scale, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Settings,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { useCase } from '@/contexts/CaseContext'; // Import the hook

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  current?: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Draft Documents', href: '/draft', icon: FileText },
  { name: 'Documents', href: '/documents', icon: Upload },
  { name: 'Children', href: '/children', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'AI Assistant', href: '/chat', icon: MessageSquare },
  { name: 'Pro Se Guide', href: '/guide', icon: BookOpen },
  { name: 'Legal Research', href: '/research', icon: Search },
  { name: 'Constitutional Law', href: '/constitutional', icon: Scale },
  { name: 'Evidence', href: '/evidence', icon: Upload },
  { name: 'Emergency Motion', href: '/emergency', icon: AlertTriangle },
  { name: 'Compliance Check', href: '/compliance', icon: CheckCircle },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const pathname = usePathname();
  const { cases, activeCase, setActiveCase, loading } = useCase(); // Use the context

  return (
    <div className="flex flex-col w-64 bg-charcoal-navy">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
          </div>
          <h1 className="ml-3 text-xl font-header text-white">We The Parent™</h1>
        </div>

        {/* Case Info / Selector */}
        <div className="mt-6 px-4">
          <div className="bg-white/5 rounded-lg p-3">
            <label htmlFor="case-selector" className="text-xs text-warm-ivory/70 mb-1 block">Current Case</label>
            {loading ? (
              <div className="text-sm text-white font-medium">Loading...</div>
            ) : (
              <select
                id="case-selector"
                className="w-full bg-transparent text-sm text-white font-medium border-none focus:ring-0"
                value={activeCase?.id || ''}
                onChange={(e) => setActiveCase(e.target.value)}
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id} className="bg-charcoal-navy">
                    {c.name} ({c.case_number})
                  </option>
                ))}
              </select>
            )}
             <button className="mt-2 w-full flex items-center justify-center py-1 px-2 text-xs text-white bg-white/10 hover:bg-white/20 rounded">
                <PlusCircle className="w-4 h-4 mr-1" />
                New Case
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isActive
                    ? 'bg-dusty-mauve text-white'
                    : 'text-warm-ivory hover:bg-white/10 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={classNames(
                    isActive ? 'text-white' : 'text-warm-ivory/70 group-hover:text-white',
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
