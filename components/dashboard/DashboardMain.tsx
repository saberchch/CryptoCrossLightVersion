'use client';

import React, { ReactNode } from 'react';

export interface DashboardMainProps {
  children?: ReactNode;
  activeItem: string;
  userName: string;
  walletBalance: string;
  subscriptionName: string;
  subscriptionPlan: string;
}

export default function DashboardMain({
  activeItem,
  userName,
  walletBalance,
  subscriptionName,
  subscriptionPlan,
  children
}: DashboardMainProps) {
  return (
    <main className="dashboard-main p-6 flex-1">
      <h1 className="text-2xl font-bold mb-4">Welcome, {userName}</h1>

      <div className="mb-4">
        <p><strong>Wallet Balance:</strong> {walletBalance}</p>
        <p><strong>Subscription:</strong> {subscriptionName} ({subscriptionPlan})</p>
        <p><strong>Current Section:</strong> {activeItem}</p>
      </div>

      {/* Dynamic content can be passed as children */}
      {children}
    </main>
  );
}
