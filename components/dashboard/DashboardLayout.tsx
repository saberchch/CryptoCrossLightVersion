'use client';

import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardMain from './DashboardMain';
import DashboardRightPanel from './DashboardRightPanel';

interface DashboardLayoutProps {
  user?: {
    name?: string;
    avatarUrl?: string;
  } | null;
  activeSidebarItem?: string;
  walletBalance?: string;
  subscriptionName?: string;
  subscriptionPlan?: string;
  children?: React.ReactNode;
}

export default function DashboardLayout({ 
  user,
  activeSidebarItem = 'quizzes',
  walletBalance,
  subscriptionName,
  subscriptionPlan,
  children
}: DashboardLayoutProps) {
  return (
    <div className="dashboard-container" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="dashboard-layout">
        <DashboardHeader user={user} />
        
        <div className="dashboard-main">
          <DashboardSidebar activeItem={activeSidebarItem} />
          
          {children || (
            <DashboardMain userName={user?.name} />
          )}
          
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
