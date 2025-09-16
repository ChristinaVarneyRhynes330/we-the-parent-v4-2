import Link from 'next/link';
import { LayoutDashboard, MessageSquare, FolderKanban } from 'lucide-react';

const Sidebar = () => {
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Chat', href: '/', icon: <MessageSquare size={20} /> },
    { name: 'My Cases', href: '/cases', icon: <FolderKanban size={20} />, comingSoon: true },
  ];

  return (
    // Updated styling to match the dark theme mockup
    <aside className="w-64 flex-shrink-0 bg-darkNavy p-4 border-r border-gray-700">
      <div className="mb-8 text-center">
        {/* Placeholder for a logo */}
        <h1 className="text-2xl font-bold text-white">WeTheParent</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.comingSoon ? '#' : link.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
              link.comingSoon
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-300 hover:bg-sapphire hover:text-white'
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
            {link.comingSoon && (
              <span className="ml-auto text-xs text-gray-400">(Soon)</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;