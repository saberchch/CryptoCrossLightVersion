'use client';

import React from 'react';
import CreatorPanel from '../../CreatorPanel';

export default function EducatorDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Creator Tools</h2>
        </div>
        <CreatorPanel />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">My Quizzes</h2>
          <p className="text-gray-600">No quizzes yet.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
          <p className="text-gray-600">No submissions yet.</p>
        </div>
      </div>
    </div>
  );
}


