'use client';

import React, { useEffect, useState } from 'react';
import { Card, Empty } from '../widgets';
import { useAuth } from '../../AuthProvider';

export default function PeoplePanel() {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'learner'|'educator'>('learner');
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const orgId = 'org-1'; // TODO: derive active org

  const loadInvites = async () => {
    const res = await fetch(`/api/invitations?organizationId=${encodeURIComponent(orgId)}`, { cache: 'no-store' });
    setInvitations(await res.json());
  };

  useEffect(() => { loadInvites(); }, []);

  return (
    <div className="space-y-6">
      <Card title="Invite People" actions={null}>
        <div className="flex flex-col md:flex-row gap-3">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Full name" value={inviteName} onChange={e => setInviteName(e.target.value)} />
          <input className="border rounded px-3 py-2 flex-1" placeholder="Email (optional)" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
          <select className="border rounded px-3 py-2" value={inviteRole} onChange={e => setInviteRole(e.target.value as any)}>
            <option value="learner">Learner</option>
            <option value="educator">Educator</option>
          </select>
          <button className="btn-primary" disabled={loading || !inviteName}
            onClick={async () => {
              setLoading(true);
              try {
                const res = await fetch('/api/invitations/issue', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ organizationId: orgId, users: [{ name: inviteName, email: inviteEmail || undefined, role: inviteRole }] })
                });
                const data = await res.json();
                if (!res.ok) { alert(data.error || 'Failed'); }
                setInviteName(''); setInviteEmail('');
                await loadInvites();
              } finally {
                setLoading(false);
              }
            }}>Invite</button>
        </div>
        <div className="mt-4 border-t pt-4">
          <div className="text-sm text-gray-600 mb-2">Bulk upload CSV (headers: name,email,role)</div>
          <form onSubmit={async (e) => { e.preventDefault(); }}>
            <input type="file" accept=".csv" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const form = new FormData();
              form.append('organizationId', orgId);
              form.append('file', file);
              setLoading(true);
              try {
                const res = await fetch('/api/invitations/upload', { method: 'POST', body: form });
                const data = await res.json();
                if (!res.ok) { alert(data.error || 'Upload failed'); }
                await loadInvites();
              } finally {
                setLoading(false);
                e.currentTarget.reset();
              }
            }} />
          </form>
        </div>
      </Card>

      <Card title="Recent Invitations" actions={<button className="btn-secondary text-sm" onClick={loadInvites}>Refresh</button>}>
        {invitations.length === 0 ? <Empty message="No invitations yet." /> : (
          <ul className="divide-y divide-gray-100">
            {invitations.slice(0, 20).map((inv: any) => (
              <li key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{inv.emailIssuedTo}</div>
                  <div className="text-sm text-gray-500">{inv.role} · {new Date(inv.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a className="text-crypto-primary underline text-sm" href={`/api/invitations/${inv.id}`} target="_blank" rel="noreferrer">Print credentials</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}


