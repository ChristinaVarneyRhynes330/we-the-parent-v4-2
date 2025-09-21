'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { 
  Home, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Search, 
  Scale, 
  Clock,
  Upload,
  Settings
} from 'lucide-react';

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const navItems: NavItemProps[] = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/timeline', label: 'Timeline', icon: Calendar, badge: 3 }, // Example: 3 upcoming events
  { href: '/chat', label: 'AI Assistant', icon: MessageSquare },
  { href: '/research', label: 'Research', icon: Search },
  { href: '/evidence', label: 'Evidence', icon: Upload },
  { href: '/deadlines', label: 'Deadlines', icon: Clock },
  { href: '/legal-tools', label: 'Legal Tools', icon: Scale },
];

const NavItem = ({ href, label, icon: Icon, badge }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`nav-item group relative ${isActive ? 'active' : ''}`}
      title={label}
    >
      <div className="relative">
        <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
        {badge && badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-garnet text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce-soft">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      <span className="text-xs font-medium mt-1 opacity-90">{label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full -ml-3"></div>
      )}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-24 bg-charcoal-navy flex-shrink-0 flex flex-col py-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-navy via-charcoal-navy to-dusty-mauve/20 opacity-50"></div>
      
      {/* Logo section */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2 group hover:bg-white/20 transition-colors cursor-pointer">
          {/* You can replace this with your actual logo */}
          <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-white text-xs font-header font-bold">We The</h1>
          <h2 className="text-white text-xs font-header font-bold -mt-1">Parent</h2>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="relative z-10 flex-1 flex flex-col space-y-2 px-3">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="relative z-10 mt-6 px-3">
        <Link 
          href="/settings" 
          className="nav-item group"
          title="Settings"
        >
          <Settings className="h-6 w-6 transition-transform group-hover:scale-110 group-hover:rotate-90" />
          <span className="text-xs font-medium mt-1 opacity-90">Settings</span>
        </Link>
      </div>

      {/* Bottom branding */}
      <div className="relative z-10 mt-4 px-3">
        <div className="text-center">
          <div className="w-8 h-0.5 bg-white/20 mx-auto mb-2"></div>
          <p className="text-white/50 text-xs font-medium">v1.0.0</p>
          <p className="text-white/40 text-xs">Florida</p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-dusty-mauve/10 to-transparent"></div>
    </aside>
  );
}