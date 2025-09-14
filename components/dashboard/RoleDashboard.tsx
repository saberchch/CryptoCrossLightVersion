'use client';

import React from 'react';
import { useAuth } from '../AuthProvider';
import LearnerDashboard from './learner/LearnerDashboard';
import EducatorDashboard from './educator/EducatorDashboard';
import ModeratorDashboard from './moderator/ModeratorDashboard';

export default function RoleDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="mb-2">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (user.role === 'educator') return <EducatorDashboard />;
  if (user.role === 'moderator') return <ModeratorDashboard />;
  if (user.role === 'admin') return <ModeratorDashboard />; // admins share moderation overview for now

  return <LearnerDashboard />;
}


