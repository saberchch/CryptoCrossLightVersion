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
      if (userObj.mustChangePassword) {
        router.push('/dashboard?changePassword=1');
        return;
      }
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
    <div className="login-container">
        <div className="login-mask"></div>
        <div className="login-card">
          <h2 className="login-title">CryptoCross</h2>
          <p className="login-subtitle">Gamified Learning & Certification</p>
        
        <div className="login-tabs">
          <button 
            type="button" 
            onClick={() => setMode('signin')} 
            className={mode === 'signin' ? 'login-tab-active' : 'login-tab'}
          >
            Login
          </button>
          <button 
            type="button" 
            onClick={() => setMode('create')} 
            className={mode === 'create' ? 'login-tab-active' : 'login-tab'}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">{error}</div>
          )}

          {mode === 'create' && (
            <div className="form-input-container">
              <span className="material-symbols-outlined form-input-icon">person</span>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="form-input-container">
            <span className="material-symbols-outlined form-input-icon">mail</span>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-input-container">
            <span className="material-symbols-outlined form-input-icon">lock</span>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {mode === 'signin' && (
            <a className="forgot-password" href="#">
              Forgot Password?
            </a>
          )}

          {mode === 'create' && (
            <div className="form-input-container">
              <span className="material-symbols-outlined form-input-icon">work</span>
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="learner">Student</option>
                <option value="educator">Professor</option>
                <option value="moderator">Institution</option>
              </select>
            </div>
          )}

          <div className="role-buttons">
            <button
              type="submit"
              className="role-button-primary"
            >
              <span className="truncate">Login</span>
            </button>
            
          </div>
        </form>

        <p className="signup-link">
          Don't have an account?{' '}
          <a href="#" onClick={() => setMode('create')}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}


