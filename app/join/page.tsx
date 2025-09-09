'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JoinPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initial = sp.get('code') || '';
  const [code, setCode] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!code) { setError('Enter a join code'); return; }
    try {
      const res = await fetch(`/api/sessions?code=${encodeURIComponent(code)}`, { cache: 'no-store' });
      const list = await res.json();
      if (!Array.isArray(list) || list.length === 0) { setError('Invalid or expired code'); return; }
      const sess = list[0];
      if (sess.status !== 'live') { setError('Session is not live'); return; }
      router.push(`/quiz/${sess.quizId}?session=${sess.id}`);
    } catch {
      setError('Failed to join');
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Join a Quiz</h1>
      <form onSubmit={handleJoin} className="bg-white shadow rounded-lg p-6 space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="w-full border rounded-md px-3 py-2" placeholder="ABC123" />
        </div>
        <button type="submit" className="w-full bg-crypto-primary text-white font-semibold py-2 rounded-md">Join</button>
      </form>
    </div>
  );
}


