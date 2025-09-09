'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import Link from 'next/link';

interface SessionRec {
  id: string;
  code: string;
  quizId: string;
  ownerId: string;
  status: 'live' | 'ended';
  privacy: 'public' | 'private';
  createdAt: string;
  expiresAt: string;
  joinUrl?: string;
}

export default function CreatorSessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsMap, setResultsMap] = useState<Record<string, any[]>>({});
  const [ending, setEnding] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/sessions', { cache: 'no-store' });
        const all = await res.json();
        const mine = (Array.isArray(all) ? all : []).filter((s: any) => s.ownerId === user.id);
        setSessions(mine.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        // Prefetch results for live sessions
        const map: Record<string, any[]> = {};
        await Promise.all(mine.map(async (s: any) => {
          const rr = await fetch(`/api/session-results?sessionId=${encodeURIComponent(s.id)}`, { cache: 'no-store' });
          map[s.id] = await rr.json();
        }));
        setResultsMap(map);
      } catch (e) {
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const live = useMemo(() => sessions.filter(s => s.status === 'live'), [sessions]);
  const past = useMemo(() => sessions.filter(s => s.status !== 'live'), [sessions]);

  async function endSession(id: string) {
    setEnding(id);
    try {
      const res = await fetch('/api/sessions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'ended' }) });
      if (res.ok) {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'ended' } : s));
      }
    } finally {
      setEnding(null);
    }
  }

  if (!user || user.role !== 'professor') return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
        <p className="text-gray-600">Manage published sessions and view participant results.</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading sessions...</div>
      ) : error ? (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
      ) : (
        <>
          <Section title="Live Sessions">
            {live.length === 0 ? (
              <Empty text="No live sessions" />
            ) : (
              <div className="space-y-4">
                {live.map(s => (
                  <SessionCard key={s.id} s={s} results={resultsMap[s.id] || []} onEnd={() => endSession(s.id)} ending={ending === s.id} />
                ))}
              </div>
            )}
          </Section>

          <Section title="Past Sessions">
            {past.length === 0 ? (
              <Empty text="No past sessions" />
            ) : (
              <div className="space-y-4">
                {past.map(s => (
                  <SessionCard key={s.id} s={s} results={resultsMap[s.id] || []} />
                ))}
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-gray-600">{text}</div>;
}

function SessionCard({ s, results, onEnd, ending }: { s: SessionRec; results: any[]; onEnd?: () => void; ending?: boolean }) {
  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{s.quizId}</div>
          <div className="text-sm text-gray-500">Code: {s.code} · Status: {s.status}</div>
          <div className="text-xs text-gray-400">Created: {new Date(s.createdAt).toLocaleString()} · Expires: {new Date(s.expiresAt).toLocaleString()}</div>
        </div>
        <div className="flex items-center gap-2">
          {s.joinUrl && (
            <a className="btn-secondary text-sm" href={s.joinUrl} target="_blank" rel="noreferrer">Open Link</a>
          )}
          {onEnd && s.status === 'live' && (
            <button onClick={onEnd} disabled={ending} className="btn-primary text-sm">{ending ? 'Ending...' : 'End Session'}</button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-medium mb-2">Participants ({results.length})</div>
        {results.length === 0 ? (
          <div className="text-sm text-gray-500">No submissions yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {results.map((r: any) => (
              <li key={r.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{r.studentName || r.studentEmail}</div>
                  <div className="text-xs text-gray-500">{new Date(r.completedAt).toLocaleString()}</div>
                </div>
                <div className="text-sm">{typeof r.score === 'number' ? `Score: ${r.score}%` : ''}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


