// /components/dashboard/DashboardMain.tsx
'use client';

import React from 'react';

export interface DashboardMainProps {
  activeItem: string;             // the sidebar button currently active
  userName: string;               // user display name
  walletBalance?: string;         // optional wallet info
  subscriptionName?: string;      // optional subscription name
  subscriptionPlan?: string;      // optional subscription plan
}

export default function DashboardMain({
  activeItem,
  userName,
  walletBalance = '$0.00',
  subscriptionName = '',
  subscriptionPlan = '',
}: DashboardMainProps) {
  // here you can render different content based on activeItem
  return (
    <main className="dashboard-content p-6 flex-1 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {userName}</h1>

      {activeItem === 'quizzes' && <p>Here are your quizzes...</p>}
      {activeItem === 'creator' && <p>Creator tools go here...</p>}
      {activeItem === 'people' && <p>People panel content...</p>}

      <div className="mt-6">
        <p>Wallet: {walletBalance}</p>
        <p>Subscription: {subscriptionName} ({subscriptionPlan})</p>
      </div>
    </main>
  );
}
