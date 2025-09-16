'use client';

import React, { useState } from 'react';

interface DashboardRightPanelProps {
  walletBalance?: string;
  subscriptionName?: string;
  subscriptionPlan?: string;
}

export default function DashboardRightPanel({
  walletBalance = '$1,234.56',
  subscriptionName = 'CryptoCross Pro',
  subscriptionPlan = 'Premium Plan'
}: DashboardRightPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`dashboard-right-panel flex flex-col bg-gray-900 text-white shadow-md transition-width duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="self-end m-2 p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        {collapsed ? '>' : '<'}
      </button>

      {/* Full Content */}
      {!collapsed && (
        <div className="flex flex-col gap-6 p-4 flex-1 overflow-auto">
          {/* Wallet Section */}
          <div className="wallet-section">
            <h3 className="text-lg font-bold mb-1">Wallet Balance</h3>
            <p className="text-xl font-semibold">{walletBalance}</p>
          </div>

          {/* Subscription */}
          <div className="subscription-card flex items-center gap-2 p-3 bg-gray-800 rounded-md">
            <svg
              fill="currentColor"
              height="28px"
              viewBox="0 0 256 256"
              width="28px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z" />
            </svg>
            <div className="flex flex-col">
              <p className="subscription-name">{subscriptionName}</p>
              <p className="subscription-plan text-sm text-gray-300">{subscriptionPlan}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions flex flex-col gap-2">
            <button className="quick-action-button bg-yellow-500 text-black py-2 rounded-md hover:opacity-90">
              Start Quiz
            </button>
            <button className="quick-action-button bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600">
              View Certificates
            </button>
          </div>
        </div>
      )}

      {/* Collapsed Icons */}
      {collapsed && (
        <div className="flex flex-col gap-4 p-2 items-center">
          <svg
            fill="currentColor"
            height="28px"
            width="28px"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z" />
          </svg>
          <svg
            fill="currentColor"
            height="28px"
            width="28px"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,168a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" />
          </svg>
        </div>
      )}
    </aside>
  );
}
