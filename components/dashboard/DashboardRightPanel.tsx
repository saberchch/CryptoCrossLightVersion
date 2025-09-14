'use client';

import React from 'react';

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
  return (
    <aside className="dashboard-right-panel">
      <div>
        <h3 className="text-lg font-bold mb-4">Wallet Balance</h3>
        <div className="wallet-section">
          <p className="wallet-label">Total Balance</p>
          <p className="wallet-amount">{walletBalance}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-bold mb-4">Active Subscriptions</h3>
        <div className="subscription-card">
          <div className="subscription-icon">
            <svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg">
              <path d="M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM128,224h0L32,128,128,32,224,128Z"></path>
            </svg>
          </div>
          <div>
            <p className="subscription-name">{subscriptionName}</p>
            <p className="subscription-plan">{subscriptionPlan}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="quick-actions">
          <button className="quick-action-button quick-action-primary">
            Start Quiz
          </button>
          <button className="quick-action-button quick-action-secondary">
            View Certificates
          </button>
        </div>
      </div>
    </aside>
  );
}
