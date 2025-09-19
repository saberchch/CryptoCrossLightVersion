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
  const [role, setRole] = useState<UserRole>('learner');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'create'>('signin');

  const next = searchParams.get('next') || '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || (mode === 'create' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      if (mode === 'signin') {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const err = await res.json();
          setError(err.error || 'Invalid credentials.');
          return;
        }

        const userObj = await res.json();
        login(userObj);

        if (userObj.mustChangePassword) {
          router.push('/dashboard?changePassword=1');
          return;
        }

        router.push(userObj.role === 'admin' ? '/admin' : '/dashboard');
        return;
      }

      // Sign up mode
      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password, xp: 0, history: [] }),
      });

      if (!createRes.ok) {
        const e = await createRes.json();
        setError(e.error || 'Failed to create profile.');
        return;
      }

      const created = await createRes.json();
      login(created);
      router.push(created.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f15] px-4">
      <div className="relative w-full max-w-md bg-[#1a1a23] rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">CryptoCross</h1>
          <p className="text-gray-400 mt-1">Gamified Learning & Certification</p>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => setMode('signin')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              mode === 'signin' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('create')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              mode === 'create' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'create' && (
            <div className="flex items-center bg-[#14141c] rounded-lg px-3 py-2">
              <span className="material-symbols-outlined text-gray-400 mr-2">person</span>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
                required
              />
            </div>
          )}

          <div className="flex items-center bg-[#14141c] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-gray-400 mr-2">mail</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          <div className="flex items-center bg-[#14141c] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-gray-400 mr-2">lock</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none text-white w-full"
              required
            />
          </div>

          {mode === 'create' && (
            <div className="flex items-center bg-[#14141c] rounded-lg px-3 py-2">
              <span className="material-symbols-outlined text-gray-400 mr-2">work</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-[#14141c] outline-none text-white w-full"
              >
                <option value="learner">Student</option>
                <option value="educator">Professor</option>
                <option value="moderator">Institution</option>
              </select>
            </div>
          )}

          {mode === 'signin' && (
            <div className="text-right">
              <a href="#" className="text-yellow-500 hover:underline text-sm">
                Forgot Password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            {mode === 'signin' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setMode(mode === 'signin' ? 'create' : 'signin')}
            className="text-yellow-500 font-semibold hover:underline"
          >
            {mode === 'signin' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
