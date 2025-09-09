'use client';

import React, { ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface DashboardShellProps {
  title?: string;
  children: ReactNode;
}

export default function DashboardShell({ title, children }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = useMemo(() => {
    const base = [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/', label: 'Quizzes' },
      { href: '/dashboard#certificates', label: 'Certificates' },
      { href: '/dashboard#wallet', label: 'Wallet' },
      { href: '/dashboard#leaderboard', label: 'Leaderboards' },
      { href: '/dashboard#analytics', label: 'Analytics' },
    ];
    if (user?.role === 'professor') base.splice(2, 0, { href: '/creator', label: 'Creator' });
    if (user?.role === 'admin') base.push({ href: '/admin', label: 'Admin' });
    return base;
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`transition-all duration-200 ${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-b from-white to-yellow-50 border-r border-crypto-accent shadow-sm`}>
          <div className="h-16 flex items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold text-crypto-primary">CryptoCross</Link>
            <button aria-label="Toggle sidebar" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-crypto-primary">
              {sidebarOpen ? '⟨' : '⟩'}
            </button>
          </div>
          <nav className="px-2 py-2 space-y-1">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}
                className={`block px-3 py-2 rounded-md text-sm ${pathname === item.href ? 'bg-yellow-100 text-crypto-primary' : 'text-gray-700 hover:bg-yellow-50'}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4 hidden md:block">
            {user && (
              <div className="flex items-center space-x-3 p-3 bg-white border rounded-md">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" /> : user.name[0]}
                </div>
                {sidebarOpen && (
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-16 bg-gradient-to-r from-white to-yellow-50 border-b border-crypto-accent flex items-center px-4 gap-4">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">{title || 'Dashboard'}</h1>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {user?.role === 'professor' && (
                <Link href="/creator" className="btn-primary text-sm">Create Quiz</Link>
              )}
              {!user ? (
                <Link href="/login" className="btn-secondary text-sm">Login</Link>
              ) : (
                <button onClick={logout} className="btn-secondary text-sm">Logout</button>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>

          <footer className="bg-gradient-to-r from-yellow-50 to-white border-t border-crypto-accent mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-600">
              © 2025 CryptoCross
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}


