'use client';

import React from 'react';
import Link from 'next/link';
import { UserRole, roleConfig, bottomItems, SidebarItem } from '@/lib/roleConfig';

interface DashboardSidebarProps {
  role: UserRole;
  collapsed: boolean;
  toggleCollapse: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function DashboardSidebar({
  role,
  collapsed,
  toggleCollapse,
  activeItem,
  setActiveItem,
}: DashboardSidebarProps) {
  const navItems: SidebarItem[] = roleConfig[role]?.sidebar ?? roleConfig['learner'].sidebar;

  const handleClick = (id: string) => setActiveItem(id);

  return (
    <aside
      className={`dashboard-sidebar flex flex-col bg-gray-900 text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="self-end m-2 p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        {collapsed ? '>' : '<'}
      </button>

      {/* Main Navigation */}
      <nav className="flex flex-col flex-1 gap-2 p-2 overflow-auto">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.id === 'dashboard' ? '/dashboard' : `/dashboard#${item.id}`}
            onClick={() => handleClick(item.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
              activeItem === item.id
                ? 'bg-yellow-500 text-black shadow-[0_0_12px_rgba(255,255,0,0.6)]'
                : 'hover:bg-gray-800'
            }`}
          >
            <svg
              fill="currentColor"
              height="20"
              width="20"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={item.icon}></path>
            </svg>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="flex flex-col gap-2 p-2 mt-auto">
        {bottomItems.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard#${item.id}`}
            onClick={() => handleClick(item.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
              activeItem === item.id
                ? 'bg-yellow-500 text-black shadow-[0_0_12px_rgba(255,255,0,0.6)]'
                : 'hover:bg-gray-800'
            }`}
          >
            <svg
              fill="currentColor"
              height="20"
              width="20"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={item.icon}></path>
            </svg>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}
