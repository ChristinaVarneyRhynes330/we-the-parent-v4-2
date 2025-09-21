'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Home, FileText, Calendar, MessageSquare } from 'lucide-react';

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItemProps[] = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/timeline', label: 'Timeline', icon: Calendar },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
];

const NavItem = ({ href, label, icon: Icon }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`flex flex-col items-center space-y-1 w-full py-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10'}`}>
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-24 bg-charcoal-navy flex-shrink-0 flex flex-col items-center py-6 space-y-4">
      <div className="mb-6">
        <Image src="/logo.png" alt="We The Parent Logo" width={48} height={48} className="rounded-full" />
      </div>
      {navItems.map((item) => (
        <NavItem key={item.label} {...item} />
      ))}
    </aside>
  );
}