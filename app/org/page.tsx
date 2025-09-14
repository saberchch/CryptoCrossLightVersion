'use client';

import React, { useEffect, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import { useAuth } from '../../components/AuthProvider';
import CreatorPanel from '../../components/CreatorPanel';

export default function OrgPage() {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'org-admin' | 'professor' | 'student'>('student');
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/organizations', { cache: 'no-store' });
        const list = await res.json();
        setOrgs(Array.isArray(list) ? list : []);
        if (Array.isArray(list) && list.length > 0 && !activeOrgId) setActiveOrgId(list[0].id);
      } catch {}
    };
    load();
  }, [activeOrgId]);

  useEffect(() => {
    const loadMembers = async () => {
      if (!activeOrgId) return;
      try {
        const res = await fetch(`/api/org-members?organizationId=${encodeURIComponent(activeOrgId)}`, { cache: 'no-store' });
        const list = await res.json();
        setMembers(Array.isArray(list) ? list : []);
      } catch { setMembers([]); }
    };
    loadMembers();
  }, [activeOrgId]);

  useEffect(() => {
    // detect if current user is org-admin of active org
    const check = async () => {
      if (!user?.id || !activeOrgId) { setIsOrgAdmin(false); return; }
      try {
        const res = await fetch(`/api/org-members?organizationId=${encodeURIComponent(activeOrgId)}&userId=${encodeURIComponent(user.id)}`, { cache: 'no-store' });
        const list = await res.json();
        const me = Array.isArray(list) ? list.find((m: any) => m.userId === user.id) : null;
        setIsOrgAdmin(!!me && me.role === 'org-admin');
      } catch { setIsOrgAdmin(false); }
    };
    check();
  }, [user?.id, activeOrgId]);

  return (
    <DashboardShell title="Organization">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Organization:</div>
            <select className="border rounded px-2 py-1" value={activeOrgId || ''} onChange={e => setActiveOrgId(e.target.value)}>
              {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">People</h2>
          {isOrgAdmin && (
          <div className="flex items-center gap-2 mb-3">
            <input className="border rounded px-2 py-1" placeholder="Invite by email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            <select className="border rounded px-2 py-1" value={inviteRole} onChange={e => setInviteRole(e.target.value as any)}>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="org-admin">Org Admin</option>
            </select>
            <button
              className="btn-primary text-sm"
              onClick={async () => {
                if (!inviteEmail || !activeOrgId) return;
                // naive: find existing user by email
                const res = await fetch(`/api/users?email=${encodeURIComponent(inviteEmail)}`);
                const u = await res.json();
                if (!u?.id) { alert('User not found. Ask them to create a profile first.'); return; }
                const add = await fetch('/api/org-members', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ organizationId: activeOrgId, userId: u.id, role: inviteRole })
                });
                if (!add.ok) { const e = await add.json().catch(() => ({})); alert(e.error || 'Failed'); return; }
                setInviteEmail('');
                const refreshed = await fetch(`/api/org-members?organizationId=${encodeURIComponent(activeOrgId)}`);
                setMembers(await refreshed.json());
              }}
            >Invite</button>
          </div>
          )}
          <ul className="divide-y divide-gray-100">
            {members.map(m => (
              <li key={m.id} className="py-2 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{m.userId}</span>
                  <span className="ml-2 text-gray-500">{m.role}</span>
                </div>
                {isOrgAdmin && (
                  <button className="text-sm px-3 py-1 rounded border border-gray-300 hover:bg-gray-50" onClick={async () => {
                    await fetch(`/api/org-members?organizationId=${encodeURIComponent(activeOrgId!)}&userId=${encodeURIComponent(m.userId)}`, { method: 'DELETE' });
                    setMembers(prev => prev.filter(x => x.userId !== m.userId));
                  }}>Remove</button>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quizzes</h2>
          {!activeOrgId ? (
            <p className="text-gray-600">Select an organization to view its quizzes.</p>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">Org-scoped quizzes for <span className="font-medium">{orgs.find(o => o.id === activeOrgId)?.name}</span></div>
              <CreatorPanel orgId={activeOrgId} />
              {React.createElement(require('../../components/QuizzesPanel').default, { orgId: activeOrgId })}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}


