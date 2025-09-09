'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'student' | 'professor' | 'organization' | 'admin';

export interface QuizHistoryItem {
  quizId: string;
  title: string;
  takenAt: string; // ISO date string
  score?: number;
  type?: 'completed' | 'created';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  xp: number;
  history: QuizHistoryItem[];
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  addHistory: (entry: QuizHistoryItem) => void;
  addXp: (amount: number) => void;
  updateProfile: (updates: Partial<Pick<AuthUser, 'name' | 'avatarUrl'>>) => void;
  replaceUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'cryptocross_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        setUser(parsed);
      }
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const login = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      // ignore
    }
    try {
      // Mirror role to cookie for middleware checks
      document.cookie = `cc_role=${nextUser.role}; path=/; SameSite=Lax`;
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    try {
      document.cookie = 'cc_role=; Max-Age=0; path=/; SameSite=Lax';
    } catch {
      // ignore
    }
    router.push('/');
  }, [router]);

  const addHistory = useCallback((entry: QuizHistoryItem) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, history: [entry, ...prev.history].slice(0, 50) };
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, xp: Math.max(0, (prev.xp || 0) + amount) };
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<AuthUser, 'name' | 'avatarUrl'>>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    addHistory,
    addXp,
    updateProfile,
    replaceUser: (u: AuthUser) => {
      setUser(u);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch {}
      try { document.cookie = `cc_role=${u.role}; path=/; SameSite=Lax`; } catch {}
    },
  }), [user, login, logout, addHistory, addXp, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireRole({ role, children }: { role: UserRole | UserRole[]; children: React.ReactNode }) {
  const { user } = useAuth();
  const roles = Array.isArray(role) ? role : [role];
  if (!user || !roles.includes(user.role)) return null;
  return <>{children}</>;
}


