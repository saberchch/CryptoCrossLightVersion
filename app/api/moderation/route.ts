import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'moderation.json');

async function readStore() {
  try { const raw = await fs.readFile(dataPath, 'utf-8'); return JSON.parse(raw); } catch { return { publishRequests: [], reports: [] }; }
}

async function writeStore(store: any) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(store, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  const store = await readStore();
  let data = store;
  if (type === 'publish') data = { publishRequests: store.publishRequests, reports: [] };
  if (type === 'report') data = { publishRequests: [], reports: store.reports };
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body as { action: 'approve' | 'reject' | 'request_changes' | 'enqueue'; } as any;
  const store = await readStore();

  // Basic item schema
  // { id, orgId, type: 'publish'|'report', title, requestedBy, createdAt, status?, reason? }

  if (action === 'enqueue') {
    const { id, orgId, type, title, requestedBy } = body;
    if (!id || !type) return NextResponse.json({ error: 'id and type required' }, { status: 400 });
    const item = { id, orgId: orgId || null, type, title: title || '', requestedBy: requestedBy || '', createdAt: new Date().toISOString(), status: 'pending' };
    if (type === 'publish') store.publishRequests = [item, ...(store.publishRequests || [])].slice(0, 500);
    else if (type === 'report') store.reports = [item, ...(store.reports || [])].slice(0, 500);
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    await writeStore(store);
    return NextResponse.json({ ok: true, item });
  }

  const { id, type, reason } = body as { id: string; type: 'publish' | 'report'; reason?: string };
  if (!id || !type) return NextResponse.json({ error: 'id and type required' }, { status: 400 });

  const listKey = type === 'publish' ? 'publishRequests' : 'reports';
  const list: any[] = store[listKey] || [];
  const idx = list.findIndex(it => it.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  const current = list[idx];
  if (action === 'approve') {
    list[idx] = { ...current, status: 'approved', decidedAt: new Date().toISOString() };
  } else if (action === 'reject') {
    list[idx] = { ...current, status: 'rejected', reason: reason || '', decidedAt: new Date().toISOString() };
  } else if (action === 'request_changes') {
    list[idx] = { ...current, status: 'changes_requested', reason: reason || '', decidedAt: new Date().toISOString() };
  } else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  store[listKey] = list;
  await writeStore(store);
  return NextResponse.json({ ok: true, item: list[idx] });
}
