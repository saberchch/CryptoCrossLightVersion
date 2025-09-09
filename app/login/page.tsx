'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, UserRole } from '../../components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [password, setPassword] = useState('');

  const next = searchParams.get('next') || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || (mode === 'create' && !name)) {
      setError('Please enter required fields.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signin') {
      // Login with email/password; server decides role
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Invalid credentials');
        return;
      }
      const userObj = await res.json();
      login(userObj);
      router.push(userObj.role === 'admin' ? '/admin' : '/dashboard');
      return;
    }
    // Create profile; admin is blocked by API
    const createRes = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, password, xp: 0, history: [] })
    });
    if (!createRes.ok) {
      const e = await createRes.json();
      setError(e.error || 'Failed to create profile');
      return;
    }
    const created = await createRes.json();
    login(created);
    router.push(created.role === 'admin' ? '/admin' : '/dashboard');
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>

      <div className="flex space-x-2 mb-4">
        <button type="button" onClick={() => setMode('signin')} className={`px-3 py-1.5 rounded-md border ${mode==='signin'?'bg-crypto-primary text-white border-crypto-primary':'border-gray-300'}`}>Sign in</button>
        <button type="button" onClick={() => setMode('create')} className={`px-3 py-1.5 rounded-md border ${mode==='create'?'bg-crypto-primary text-white border-crypto-primary':'border-gray-300'}`}>Create profile</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Satoshi Nakamoto"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="satoshi@bitcoin.org"
            required
          />
        </div>

        {mode === 'create' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-primary bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="student">Student / Learner</option>
              <option value="professor">Professor / Individual</option>
              <option value="organization">Private School / Company</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-crypto-primary text-white font-semibold py-2 rounded-md hover:opacity-90"
        >
          Continue
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">No passwords yet; this is a demo login with roles.</p>
    </div>
  );
}


