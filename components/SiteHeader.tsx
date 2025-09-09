'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Hide global header on dashboard-like pages that have their own shell
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin') || pathname?.startsWith('/creator')) {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-white to-yellow-50 shadow-lg border-b border-crypto-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-crypto-primary bg-gradient-to-r from-crypto-primary to-crypto-secondary bg-clip-text text-transparent">
              CryptoCross
            </a>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-crypto-primary transition-colors">Home</a>
            <a href="/dashboard" className="text-gray-700 hover:text-crypto-primary transition-colors">Dashboard</a>
            {!user ? (
              <a href="/login" className="px-3 py-1.5 rounded-md border border-crypto-accent text-crypto-primary hover:bg-yellow-50">Login</a>
            ) : (
              <button onClick={logout} className="px-3 py-1.5 rounded-md bg-crypto-primary text-white hover:opacity-90">Logout</button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}


