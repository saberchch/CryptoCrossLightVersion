'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import Link from 'next/link';
import CreatorPanel from '../../components/CreatorPanel';
import QuizzesPanel from '../../components/QuizzesPanel';
import RoleDashboard from '../../components/dashboard/RoleDashboard';
import { usePathname, useSearchParams } from 'next/navigation';
import PeoplePanel from '../../components/dashboard/moderator/PeoplePanel';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

export default function DashboardPage() {
  const { user, replaceUser } = useAuth() as any;
  const [results, setResults] = useState<any[]>([]);
  const [activityFilter, setActivityFilter] = useState<'all' | 'created' | 'completed' | 'passed' | 'failed'>('all');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<string>('');
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmittingChange, setIsSubmittingChange] = useState<boolean>(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState<string | null>(null);

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
    const cp = searchParams.get('changePassword');
    if (cp === '1') setShowChangePassword(true);
    // Enforce if user is pending or never updated password
    if (user && (String((user as any).status||'').toLowerCase() === 'pending' || !(user as any).passwordUpdatedAt)) {
      setShowChangePassword(true);
    }
  }, [searchParams, user]);
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
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Please log in to view your dashboard.</h1>
            <Link href="/login" className="btn-primary">Login</Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      user={user}
      activeSidebarItem="quizzes"
      walletBalance="$1,234.56"
      subscriptionName="CryptoCross Pro"
      subscriptionPlan="Premium Plan"
    >
      {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative bg-white rounded-lg shadow-xl border border-yellow-200 w-full max-w-md mx-4 p-6">
              <h2 className="text-lg font-semibold mb-2">Set a new password</h2>
              <p className="text-sm text-gray-600 mb-4">For security, you must change your temporary password before continuing.</p>
              {changeError && <div className="p-2 mb-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">{changeError}</div>}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setChangeError(null);
                  setChangeSuccess(null);
                  if (newPassword !== confirmPassword) {
                    setChangeError('Passwords do not match');
                    return;
                  }
                  setIsSubmittingChange(true);
                  try {
                    const res = await fetch('/api/change-password', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: user?.email, newPassword })
                    });
                    if (!res.ok) {
                      const err = await res.json().catch(() => ({}));
                      setChangeError(err.error || 'Failed to change password');
                      setIsSubmittingChange(false);
                      return;
                    }
                    const updated = await res.json();
                    try { replaceUser && replaceUser(updated); } catch {}
                    setChangeSuccess('Password updated.');
                    setShowChangePassword(false);
                    setIsSubmittingChange(false);
                    if (typeof window !== 'undefined') {
                      const url = new URL(window.location.href);
                      url.searchParams.delete('changePassword');
                      window.history.replaceState(null, '', url.toString());
                    }
                  } catch {
                    setChangeError('Failed to change password');
                    setIsSubmittingChange(false);
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                  <input type="password" className="border rounded px-3 py-2 w-full" placeholder="Enter new password"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                  <input type="password" className="border rounded px-3 py-2 w-full" placeholder="Re-enter new password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
                </div>
                <button type="submit" disabled={isSubmittingChange || newPassword.length < 6 || newPassword !== confirmPassword}
                  className={`w-full ${isSubmittingChange || newPassword.length < 6 || newPassword !== confirmPassword ? 'bg-gray-300 cursor-not-allowed' : 'bg-crypto-primary hover:opacity-90'} text-white font-semibold py-2 rounded-md`}>
                  {isSubmittingChange ? 'Saving…' : 'Save password'}
                </button>
              </form>
            </div>
          </div>
        )}
        {!activeSection && (<RoleDashboard />)}

        {(user.role === 'educator' || user.role === 'admin' || user.role === 'moderator') && activeSection === '#creator' && (
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

        {activeSection === '#people' && (
          <div className="bg-white rounded-lg shadow p-6" id="people">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">People</h2>
              <button
                onClick={() => { if (typeof window !== 'undefined') { history.replaceState(null, '', '/dashboard'); setActiveSection(''); } }}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
              >Close</button>
            </div>
            <PeoplePanel />
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
    </DashboardLayout>
  );
}


