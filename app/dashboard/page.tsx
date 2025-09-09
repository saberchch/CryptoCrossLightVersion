'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';
import DashboardShell from '../../components/DashboardShell';
import CreatorPanel from '../../components/CreatorPanel';
import QuizzesPanel from '../../components/QuizzesPanel';
import { usePathname, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [activityFilter, setActivityFilter] = useState<'all' | 'created' | 'completed' | 'passed' | 'failed'>('all');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<string>('');

  // Toggle creator by hash (#creator)
  useEffect(() => {
    const checkHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      setActiveSection(hash);
    };
    checkHash();
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', checkHash);
      return () => window.removeEventListener('hashchange', checkHash);
    }
  }, [pathname, searchParams]);
  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;
      try {
        const [resResults, resUser] = await Promise.all([
          fetch(`/api/results?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' }),
          fetch(`/api/users?email=${encodeURIComponent(user.email)}`, { cache: 'no-store' })
        ]);
        const list = await resResults.json();
        const userObj = await resUser.json();

        const completed = (Array.isArray(list) ? list : []).map((r: any) => ({
          ...r,
          type: r.type || 'completed',
          date: r.completedAt || r.takenAt
        }));
        const created = (Array.isArray(userObj?.history) ? userObj.history : [])
          .filter((h: any) => h && (h.type === 'created' || h.type === 'session' || h.type === 'published'))
          .map((h: any) => ({
            id: h.id || `created-${h.takenAt || h.date || ''}-${h.quizId || ''}`,
            quizId: h.quizId,
            title: h.title,
            type: h.type || 'created',
            passed: undefined,
            score: undefined,
            totalQuestions: undefined,
            correctAnswers: undefined,
            completedAt: undefined,
            takenAt: h.takenAt || h.date,
            date: h.takenAt || h.date
          }));

        const merged = [...completed, ...created]
          .filter((x: any) => x && x.quizId)
          .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

        setResults(merged);
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
      {!activeSection && (
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
      )}

        {!activeSection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <div className="text-sm flex items-center gap-2">
                  <span className="text-gray-600">Filter:</span>
                  <select className="border rounded px-2 py-1" value={activityFilter} onChange={e => setActivityFilter(e.target.value as any)}>
                    <option value="all">All</option>
                    <option value="created">Created</option>
                    <option value="completed">Completed</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              {results.length === 0 ? (
                <p className="text-gray-600">No activity yet. Create or complete a quiz to see history.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {results
                    .filter(r => {
                      if (activityFilter === 'all') return true;
                      if (activityFilter === 'created') return r.type === 'created';
                      if (activityFilter === 'completed') return r.type !== 'created';
                      if (activityFilter === 'passed') return r.passed === true;
                      if (activityFilter === 'failed') return r.passed === false;
                      return true;
                    })
                    .map((r, i) => (
                    <li key={i} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.quizId}</div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">{r.type === 'created' ? 'Created' : (r.passed === true ? 'Completed · Passed' : r.passed === false ? 'Completed · Failed' : 'Completed')}</div>
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
        )}

        {user.role === 'professor' && activeSection === '#creator' && (
          <div className="bg-white rounded-lg shadow p-6" id="creator">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Creator Tools</h2>
              <button
                onClick={() => { if (typeof window !== 'undefined') { history.replaceState(null, '', '/dashboard'); setActiveSection(''); } }}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
              >Close</button>
            </div>
            <CreatorPanel />
          </div>
        )}

        {activeSection === '#quizzes' && (
          <div className="bg-white rounded-lg shadow p-6" id="quizzes">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Quizzes</h2>
              <button
                onClick={() => { if (typeof window !== 'undefined') { history.replaceState(null, '', '/dashboard'); setActiveSection(''); } }}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
              >Close</button>
            </div>
            <QuizzesPanel />
          </div>
        )}

        {activeSection === '#certificates' && (
          <div className="bg-white rounded-lg shadow p-6" id="certificates">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Certificates</h2>
              <button
                onClick={() => { if (typeof window !== 'undefined') { history.replaceState(null, '', '/dashboard'); setActiveSection(''); } }}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
              >Close</button>
            </div>
            <p className="text-gray-600">Coming soon.</p>
          </div>
        )}

        {activeSection === '#wallet' && (
          <div className="bg-white rounded-lg shadow p-6" id="wallet">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Wallet</h2>
              <button
                onClick={() => { if (typeof window !== 'undefined') { history.replaceState(null, '', '/dashboard'); setActiveSection(''); } }}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
              >Close</button>
            </div>
            <p className="text-gray-600">Coming soon.</p>
          </div>
        )}

        {activeSection === '#leaderboard' && (
          <div className="bg-white rounded-lg shadow p-6" id="leaderboard">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Leaderboards</h2>
              <button
                onClick={() => { if (typeof window !== 'undefined') { history.replaceState(null, '', '/dashboard'); setActiveSection(''); } }}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
              >Close</button>
            </div>
            <p className="text-gray-600">Coming soon.</p>
          </div>
        )}

        {activeSection === '#analytics' && (
          <div className="bg-white rounded-lg shadow p-6" id="analytics">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Analytics</h2>
              <button
                onClick={() => { if (typeof window !== 'undefined') { history.replaceState(null, '', '/dashboard'); setActiveSection(''); } }}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
              >Close</button>
            </div>
            <p className="text-gray-600">Coming soon.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}


