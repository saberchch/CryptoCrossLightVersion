'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import DashboardShell from '../../components/DashboardShell';

export default function AdminLanding() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login?next=/admin');
    } else if (user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <DashboardShell title="Admin">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-2">System Overview</h2>
            <p className="text-sm text-gray-600">Users, quizzes, attempts (placeholder)</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-2">Content Moderation</h2>
            <p className="text-sm text-gray-600">Approve or remove content (placeholder)</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-2">Settings</h2>
            <p className="text-sm text-gray-600">Platform settings (placeholder)</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
