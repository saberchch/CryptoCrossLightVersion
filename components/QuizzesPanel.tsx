'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import Card from './ui/Card';

interface QuizSummary {
  id: string;
  title: string;
  description?: string;
  difficulty?: string;
  duration?: number;
  passingScore?: number;
  creator?: { id: string; name: string; email: string; role: string };
  createdAt?: string;
  type?: string;
  privacy?: 'public' | 'private';
  status?: 'draft' | 'published';
}

export default function QuizzesPanel({ orgId }: { orgId?: string }) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'mine' | 'public' | 'private' | 'drafts' | 'published'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/quizzes', {
          cache: 'no-store',
          headers: {
            ...(user?.id ? { 'x-user-id': user.id } : {}),
            ...(user?.role ? { 'x-user-role': user.role } : {}),
            ...(orgId ? { 'x-org-id': orgId } : {}),
          }
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error || 'Failed to load quizzes');
        }
        const data = await res.json();
        if (mounted) setQuizzes(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load quizzes');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user?.id, user?.role, orgId]);

  const visible = useMemo(() => {
    return quizzes.filter(q => {
      if (filter === 'all') return true;
      if (filter === 'mine') return user?.id && q.creator?.id === user.id;
      if (filter === 'public') return q.privacy !== 'private';
      if (filter === 'private') return q.privacy === 'private';
      if (filter === 'drafts') return q.status === 'draft';
      if (filter === 'published') return q.status === 'published';
      return true;
    });
  }, [quizzes, filter, user?.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Filter:</span>
          <select
            className="border rounded px-2 py-1"
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            {user?.role === 'educator' && <option value="mine">My quizzes</option>}
            <option value="public">Public</option>
            <option value="private">Private</option>
            {user?.role === 'educator' && <option value="drafts">Drafts</option>}
            <option value="published">Published</option>
          </select>
        </div>
        {user?.role === 'educator' && (
          <Link href="/dashboard#creator" className="btn-primary text-sm">Create New</Link>
        )}
      </div>

      {loading && (
        <div className="card">Loading quizzes…</div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.length === 0 && (
            <div className="col-span-full card text-gray-600">No quizzes found.</div>
          )}
          {visible.map(q => (
            <Card
              key={q.id}
              className="hover:-translate-y-0.5"
              header={(
                <>
                  <div className="text-lg font-semibold text-gray-900">{q.title}</div>
                  <div className="text-xs text-gray-500 text-right">
                    <div className="capitalize">{q.difficulty || ''}</div>
                    <div>{q.duration ? `${q.duration} min` : ''}</div>
                  </div>
                </>
              )}
              footer={(
                <div className="flex items-center gap-3">
                  <Link href={`/quiz/${q.id}`} className="btn-primary text-sm">Open</Link>
                  {(user?.role === 'admin' || (user?.role === 'educator' && q.creator?.id === user.id)) && (
                    <>
                      <button
                        onClick={async () => {
                          setBusyId(q.id);
                          try {
                            await fetch(`/api/quizzes/${encodeURIComponent(q.id)}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json', ...(user?.id ? { 'x-user-id': user.id } : {}), ...(user?.role ? { 'x-user-role': user.role } : {}), ...(orgId ? { 'x-org-id': orgId } : {}) },
                              body: JSON.stringify({ status: q.status === 'draft' ? 'published' : 'draft' })
                            });
                            const res = await fetch('/api/quizzes', { cache: 'no-store', headers: { ...(user?.id ? { 'x-user-id': user.id } : {}), ...(user?.role ? { 'x-user-role': user.role } : {}), ...(orgId ? { 'x-org-id': orgId } : {}) } });
                            const data = await res.json();
                            setQuizzes(Array.isArray(data) ? data : []);
                          } finally { setBusyId(null); }
                        }}
                        className="text-sm px-3 py-1 rounded border gold-border hover:bg-amber-50"
                        disabled={busyId === q.id}
                      >{q.status === 'draft' ? 'Publish' : 'Unpublish'}</button>
                      <button
                        onClick={async () => {
                          if (!confirm('Delete this quiz?')) return;
                          setBusyId(q.id);
                          try {
                            await fetch(`/api/quizzes/${encodeURIComponent(q.id)}`, {
                              method: 'DELETE',
                              headers: { ...(user?.id ? { 'x-user-id': user.id } : {}), ...(user?.role ? { 'x-user-role': user.role } : {}), ...(orgId ? { 'x-org-id': orgId } : {}) }
                            });
                            setQuizzes(prev => prev.filter(x => x.id !== q.id));
                          } finally { setBusyId(null); }
                        }}
                        className="text-sm px-3 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50"
                        disabled={busyId === q.id}
                      >Delete</button>
                    </>
                  )}
                </div>
              )}
            >
              {q.description && <div className="text-sm text-gray-700 line-clamp-2">{q.description}</div>}
              <div className="mt-2 flex items-center gap-2 text-xs">
                {q.status && (
                  <span className={`px-2 py-0.5 rounded border ${q.status==='published'?'border-green-300 text-green-700 bg-green-50':'border-gray-300 text-gray-700 bg-gray-50'}`}>{q.status}</span>
                )}
                {q.privacy && (
                  <span className={`px-2 py-0.5 rounded border ${q.privacy==='private'?'border-yellow-300 text-yellow-700 bg-yellow-50':'border-blue-300 text-blue-700 bg-blue-50'}`}>{q.privacy}</span>
                )}
                {q.type && (
                  <span className="px-2 py-0.5 rounded border border-gray-300 text-gray-700 bg-gray-50">{q.type}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


