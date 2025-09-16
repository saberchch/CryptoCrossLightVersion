'use client';

import React, { ReactNode } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardRightPanel from './DashboardRightPanel';

export interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
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
  role,
  walletBalance = '$0.00',
  subscriptionName = '',
  subscriptionPlan = '',
  collapsed,
  toggleSidebar,
  activeItem,
  setActiveItem,
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout flex min-h-screen bg-[var(--dark-bg)] text-white relative">

      {/* Sidebar */}
      <DashboardSidebar
        role={role}
        collapsed={collapsed}
        toggleCollapse={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50">
          <DashboardHeader 
            rightPanelVisible={true} 
            onToggleRightPanel={() => {}} 
          />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>

      {/* Right Panel */}
      <DashboardRightPanel
        walletBalance={walletBalance}
        subscriptionName={subscriptionName}
        subscriptionPlan={subscriptionPlan}
      />
    </div>
  );
}
