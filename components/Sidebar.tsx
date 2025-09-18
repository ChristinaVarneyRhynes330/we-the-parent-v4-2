import React from 'react';
import Link from 'next/link';

type SidebarItemProps = {
  href: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function SidebarItem({ href, label, Icon }: SidebarItemProps) {
  return (
    <Link href={href} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}

type SidebarProps = {
  items: SidebarItemProps[];
};

export default