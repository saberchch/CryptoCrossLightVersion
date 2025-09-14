'use client';

import React, { useEffect, useState } from 'react';
import { Card, Empty } from '../widgets';

export default function ModeratorDashboard() {
  const [tab, setTab] = useState<'publish' | 'report'>('publish');
  const [data, setData] = useState<{ publishRequests: any[]; reports: any[] }>({ publishRequests: [], reports: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/moderation?type=${tab}`);
        const json = await res.json();
        setData(json);
      } catch {
        setData({ publishRequests: [], reports: [] });
      }
    };
    load();
  }, [tab]);

  return (
    <div className="space-y-6">
      <Card title="Moderation Queue" actions={(
        <div className="flex gap-2">
          <button className={`px-3 py-1.5 rounded text-sm border ${tab==='publish'?'bg-crypto-primary text-white border-crypto-primary':'border-gray-300'}`} onClick={() => setTab('publish')}>Publish Requests</button>
          <button className={`px-3 py-1.5 rounded text-sm border ${tab==='report'?'bg-crypto-primary text-white border-crypto-primary':'border-gray-300'}`} onClick={() => setTab('report')}>Reports</button>
        </div>
      )}>
        {tab === 'publish' ? (
          data.publishRequests.length === 0 ? <Empty message="No publish requests." /> : (
            <ul className="divide-y divide-gray-100">
              {data.publishRequests.map((it, idx) => (
                <li key={idx} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{it.title || it.quizId || 'Untitled'}</div>
                    <div className="text-sm text-gray-500">Requested by {it.requestedBy || 'unknown'} · {new Date(it.createdAt || Date.now()).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={async () => {
                      await fetch('/api/moderation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve', id: it.id, type: 'publish' }) });
                      const res = await fetch('/api/moderation?type=publish'); setData(await res.json());
                    }}>Approve</button>
                    <button className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={async () => {
                      const reason = prompt('Reason for rejection?') || '';
                      await fetch('/api/moderation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject', id: it.id, type: 'publish', reason }) });
                      const res = await fetch('/api/moderation?type=publish'); setData(await res.json());
                    }}>Reject</button>
                    <button className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={async () => {
                      const reason = prompt('Request changes note?') || '';
                      await fetch('/api/moderation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'request_changes', id: it.id, type: 'publish', reason }) });
                      const res = await fetch('/api/moderation?type=publish'); setData(await res.json());
                    }}>Request changes</button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : (
          data.reports.length === 0 ? <Empty message="No reports." /> : (
            <ul className="divide-y divide-gray-100">
              {data.reports.map((it, idx) => (
                <li key={idx} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{it.reason || 'Report'}</div>
                    <div className="text-sm text-gray-500">Target: {it.quizId || it.userId || 'unknown'} · {new Date(it.createdAt || Date.now()).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={async () => {
                      await fetch('/api/moderation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve', id: it.id, type: 'report' }) });
                      const res = await fetch('/api/moderation?type=report'); setData(await res.json());
                    }}>Approve</button>
                    <button className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={async () => {
                      const reason = prompt('Reason for rejection?') || '';
                      await fetch('/api/moderation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject', id: it.id, type: 'report', reason }) });
                      const res = await fetch('/api/moderation?type=report'); setData(await res.json());
                    }}>Reject</button>
                    <button className="px-2 py-1 text-sm border border-gray-300 rounded" onClick={async () => {
                      const reason = prompt('Request changes note?') || '';
                      await fetch('/api/moderation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'request_changes', id: it.id, type: 'report', reason }) });
                      const res = await fetch('/api/moderation?type=report'); setData(await res.json());
                    }}>Request changes</button>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Actions</h2>
          <p className="text-gray-600">No actions yet.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Guidelines</h2>
          <p className="text-gray-600">Link your internal moderation guidelines here.</p>
        </div>
      </div>
    </div>
  );
}


