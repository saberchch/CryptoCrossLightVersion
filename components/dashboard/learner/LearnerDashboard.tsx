'use client';

import React from 'react';
import { useAuth } from '../../AuthProvider';

export default function LearnerDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xl">
          {user?.avatarUrl ? (<img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />) : (user?.name?.[0] || '?')}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-600">{user?.email} · {user?.role}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-crypto-primary font-semibold">XP: {user?.xp ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
          <p className="text-gray-600">No in-progress quizzes yet.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Results</h2>
          <p className="text-gray-600">No results yet.</p>
        </div>
      </div>
    </div>
  );
}


