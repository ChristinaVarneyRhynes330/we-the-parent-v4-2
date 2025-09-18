// components/Sidebar.tsx
'use client';

import Link from 'next/link';

export default function Sidebar() {
  const nav = [
    { href: '/', label: 'Home' },
    { href: '/documents', label: 'Documents' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/cases', label: 'Cases' },
  ];

  return (
    <aside className="w-full md:w-64 bg-warm-ivory border-r border-gray-200 p-4">
      <h2 className="text-xl font-header mb-4">We The Parent</h2>
      <nav>
        <ul className="space-y-2">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-3 py-2 rounded hover:bg-gray-100 text-slate-gray"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}