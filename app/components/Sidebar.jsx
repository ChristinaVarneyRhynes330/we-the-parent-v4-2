import Link from 'next/link';
import { LayoutDashboard, MessageSquare, FolderKanban } from 'lucide-react';

const Sidebar = () => {
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Chat', href: '/', icon: <MessageSquare size={20} /> },
    { name: 'My Cases', href: '/cases', icon: <FolderKanban size={20} />, comingSoon: true },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-100 p-4 border-r">
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.comingSoon ? '#' : link.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
              link.comingSoon
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
            {link.comingSoon && (
               <span className="text-xs text-gray-400">(Soon)</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;