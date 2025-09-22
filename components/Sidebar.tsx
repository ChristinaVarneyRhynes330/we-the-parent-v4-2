'use client';

import React, { useState } from 'react'; // FIX: Add React to the import
import { 
  Home, 
  FileText, 
  Search, 
  Scale, 
  MessageCircle, 
  Upload, 
  BookOpen, 
  Settings,
  Menu,
  X,
  Calendar,
  Users,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', href: '/' },
    { id: 'documents', icon: FileText, label: 'Documents', href: '/documents' },
    { id: 'research', icon: Search, label: 'Legal Research', href: '/research' },
    { id: 'constitutional', icon: Scale, label: 'Constitutional Law', href: '/constitutional' },
    { id: 'chat', icon: MessageCircle, label: 'AI Assistant', href: '/chat' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', href: '/calendar' },
    { id: 'evidence', icon: Upload, label: 'Evidence Manager', href: '/evidence' },
    { id: 'guide', icon: BookOpen, label: 'Pro Se Guide', href: '/guide' },
  ];

  const quickTools = [
    { id: 'emergency', icon: AlertTriangle, label: 'Emergency Motion', href: '/emergency' },
    { id: 'compliance', icon: Clock, label: 'Compliance Check', href: '/compliance' },
    { id: 'children', icon: Users, label: 'Children Info', href: '/children' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    setIsOpen(false); // Close mobile sidebar when item is clicked
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-charcoal-navy text-white rounded-lg shadow-lg"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-80 bg-charcoal-navy text-white z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
          ${className}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center mr-3">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-header text-xl font-bold">We The Parent™</h1>
              <p className="text-white/60 text-sm">Legal Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          {/* Main Navigation */}
          <div className="px-6 mb-8">
            <h2 className="text-white/60 text-xs uppercase font-semibold tracking-wider mb-4">
              Main Navigation
            </h2>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      nav-item w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      flex items-center space-x-3
                      ${isActive 
                        ? 'bg-white/10 text-white shadow-lg' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Tools */}
          <div className="px-6 mb-8">
            <h2 className="text-white/60 text-xs uppercase font-semibold tracking-wider mb-4">
              Quick Tools
            </h2>
            <div className="space-y-2">
              {quickTools.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      nav-item w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      flex items-center space-x-3
                      ${isActive 
                        ? 'bg-white/10 text-white shadow-lg' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Case Information Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Active Case</h3>
            <div className="space-y-1 text-sm">
              <p className="text-white/80">2024-DP-000587-XXDP-BC</p>
              <p className="text-white/60">5th Judicial Circuit</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-olive-emerald rounded-full mr-2"></div>
                <span className="text-white/80 text-xs">Active Status</span>
              </div>
            </div>
          </div>

          {/* Settings Link */}
          <button
            onClick={() => handleItemClick('settings')}
            className={`
              w-full mt-4 px-4 py-3 rounded-lg transition-all duration-200
              flex items-center space-x-3
              ${activeItem === 'settings'
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-white/70 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;