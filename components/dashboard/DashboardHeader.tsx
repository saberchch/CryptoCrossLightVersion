'use client';

import React from 'react';
import { useAuth } from '../AuthProvider';

export interface DashboardHeaderProps {
  user?: {
    name?: string;
    avatarUrl?: string;
  } | null;
  rightPanelVisible: boolean;
  onToggleRightPanel: () => void;
}

export default function DashboardHeader({
  user,
  rightPanelVisible = true,
  onToggleRightPanel = () => {},
}: DashboardHeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="dashboard-header flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md">
      {/* Logo Section */}
      <div className="dashboard-logo flex items-center gap-2">
        <svg
          className="dashboard-logo-icon w-8 h-8"
          fill="none"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Add actual logo paths here */}
        </svg>
        <h2 className="dashboard-logo-text font-bold text-xl">CryptoCross</h2>
      </div>

      {/* Controls Section */}
      <div className="dashboard-controls flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            className="search-input rounded-md px-3 py-1.5 bg-gray-800 text-white placeholder-gray-400"
            placeholder="Search"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-md hover:bg-white-800 transition-colors">
          <svg fill="currentColor" height="24" width="24" viewBox="0 0 256 256">
            {/* Bell icon */}
          </svg>
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        

        {/* User Avatar */}
        {user && (
          <div
            className="user-avatar w-10 h-10 rounded-full bg-gray-700 bg-cover bg-center"
            style={{ backgroundImage: user.avatarUrl ? `url("${user.avatarUrl}")` : undefined }}
          />
        )}

        {/* Logout */}
        {user && (
          <button
            onClick={logout}
            className="px-4 py-2 rounded-md border border-yellow-500/50 text-yellow-400 hover:bg-yellow-400/20 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
