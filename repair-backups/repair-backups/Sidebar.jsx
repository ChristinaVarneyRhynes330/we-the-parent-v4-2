'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, FolderKanban, Calendar, FileText } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: BarChart2 },
  { href: '/documents', label: 'Documents', icon: FolderKanban },
  { href: '/timeline', label: 'Timeline', icon: Calendar },
  { href: '/strategy', label: 'Strategy', icon: FileText },
];

const NavItem = ({ href, label, icon: Icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex flex-col items-center space-y-1 w-full py-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-24 bg-brand-accent flex-shrink-0 flex flex-col items-center py-6 space-y-4">
      <div className="w-12 h-12 bg-white rounded-full mb-6"></div> {/* Logo Placeholder */}
      {navItems.map((item) => (
        <NavItem key={item.label} {...item} />
      ))}
    </aside>
  );
}