'use client';

import React, { ReactNode } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardRightPanel from './DashboardRightPanel';
import { useAuth } from '@/components/AuthProvider';
import { UserRole } from '@/lib/roleConfig';

export interface DashboardLayoutProps {
  children: ReactNode;
  walletBalance?: string;
  subscriptionName?: string;
  subscriptionPlan?: string;
  collapsed: boolean;
  toggleSidebar: () => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function DashboardLayout({
  children,
  walletBalance = '$0.00',
  subscriptionName = '',
  subscriptionPlan = '',
  collapsed,
  toggleSidebar,
  activeItem,
  setActiveItem,
}: DashboardLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading dashboard...
      </div>
    );
  }

  const role = user.role as UserRole;
  const headerHeight = 64; // px
  const sidebarWidth = collapsed ? 64 : 240;
  const rightPanelWidth = 256;

  return (
    <div className="dashboard-layout min-h-screen bg-[var(--dark-bg)] text-white">

      {/* HEADER FIXED */}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ height: headerHeight }}
      >
        <DashboardHeader
          user={user}
          rightPanelVisible={true}
          onToggleRightPanel={() => {}}
        />
      </div>

      <div className="flex" style={{ paddingTop: headerHeight }}>
        {/* SIDEBAR FIXED */}
        <div
          className="fixed top-[64px] left-0 bottom-0 overflow-auto"
          style={{ width: sidebarWidth }}
        >
          <DashboardSidebar
            role={role}
            collapsed={collapsed}
            toggleCollapse={toggleSidebar}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        </div>

        {/* MAIN CONTENT */}
        <main
          className="flex-1 overflow-auto transition-all duration-300"
          style={{
            marginLeft: collapsed ? 64 : 240, // sidebar width
            marginRight: rightPanelWidth,      // right panel width (fixed)
            minHeight: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          {children}
        </main>

        {/* RIGHT PANEL FIXED */}
        <div
          className="fixed top-[64px] right-0 bottom-0 overflow-auto"
          style={{ width: rightPanelWidth }}
        >
          <DashboardRightPanel
            walletBalance={walletBalance}
            subscriptionName={subscriptionName}
            subscriptionPlan={subscriptionPlan}
          />
        </div>
      </div>
    </div>
  );
}
