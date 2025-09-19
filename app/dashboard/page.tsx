'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardMain from '../../components/dashboard/DashboardMain';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import { useAuth } from '../../components/AuthProvider';

export default function DashboardPage() {
  const { user, replaceUser } = useAuth() as any;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Sync activeItem with URL hash
  useEffect(() => {
    const updateHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
      setActiveItem(hash || 'dashboard');
    };
    updateHash();
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', updateHash);
      return () => window.removeEventListener('hashchange', updateHash);
    }
  }, [pathname, searchParams]);

  // Show password modal if required
  useEffect(() => {
    const cp = searchParams.get('changePassword');
    if (cp === '1') setShowChangePassword(true);
    if (user && (!user.passwordUpdatedAt || user.status?.toLowerCase() === 'pending')) {
      setShowChangePassword(true);
    }
  }, [searchParams, user]);

  if (!user) {
    return (
      <DashboardLayout
        
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        walletBalance="$0.00"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Please log in to view your dashboard.
            </h1>
            <Link href="/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      
      collapsed={sidebarCollapsed}
      toggleSidebar={toggleSidebar}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      walletBalance={user.walletBalance ?? '$0.00'}
      subscriptionName={user.subscription?.name ?? ''}
      subscriptionPlan={user.subscription?.plan ?? ''}
    >
      {/* Password Change Modal */}
      <PasswordChangeModal
        user={user}
        replaceUser={replaceUser}
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      {/* Main dashboard content */}
      <DashboardMain
        activeItem={activeItem}
        userName={user.name ?? 'User'}
        walletBalance={user.walletBalance ?? '$0.00'}
        subscriptionName={user.subscription?.name ?? ''}
        subscriptionPlan={user.subscription?.plan ?? ''}
      />
    </DashboardLayout>
  );
}
