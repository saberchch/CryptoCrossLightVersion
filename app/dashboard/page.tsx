'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';
import DashboardShell from '../../components/DashboardShell';

export default function DashboardPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(`/api/results?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' });
        const list = await res.json();
        setResults(Array.isArray(list) ? list.reverse() : []);
      } catch {
        setResults([]);
      }
    };
    load();
  }, [user?.email]);

  if (!user) {
    return (
      <DashboardShell title="Dashboard">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="mb-4">Please log in to view your dashboard.</p>
            <Link href="/login" className="px-4 py-2 rounded-md bg-crypto-primary text-white">Login</Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xl">
          {user.avatarUrl ? (<img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />) : (user.name[0])}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600">{user.email} · {user.role}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-crypto-primary font-semibold">XP: {user.xp}</div>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {results.length === 0 ? (
              <p className="text-gray-600">No activity yet. Create or complete a quiz to see history.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {results.map((r, i) => (
                  <li key={i} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.quizId}</div>
                      <div className="text-xs uppercase tracking-wide text-gray-400">{r.type === 'created' ? 'Created' : 'Completed'}</div>
                      <div className="text-sm text-gray-500">{new Date(r.completedAt || r.takenAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {r.type !== 'created' && (
                        <>
                          <div className="text-sm">Score: {r.score}%</div>
                          <Link href={`/quiz/${r.quizId}/result`} className="text-crypto-primary underline text-sm">View</Link>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6" id="wallet">
            <h2 className="text-lg font-semibold mb-4">Wallet</h2>
            <p className="text-gray-600">Coming soon.</p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}


