import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const membersPath = path.join(process.cwd(), 'data', 'user_organizations.json');

async function readMembers() {
  try { const raw = await fs.readFile(membersPath, 'utf-8'); return JSON.parse(raw); } catch { return []; }
}
async function writeMembers(list: any[]) {
  await fs.mkdir(path.dirname(membersPath), { recursive: true });
  await fs.writeFile(membersPath, JSON.stringify(list, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId');
  const userId = searchParams.get('userId');
  const all = await readMembers();
  const filtered = all.filter((m: any) => (!orgId || m.organizationId === orgId) && (!userId || m.userId === userId));
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { organizationId, userId, role } = body || {};
  if (!organizationId || !userId || !role) return NextResponse.json({ error: 'organizationId, userId, role required' }, { status: 400 });
  const all = await readMembers();
  const exists = all.find((m: any) => m.organizationId === organizationId && m.userId === userId);
  if (exists) return NextResponse.json({ error: 'already member' }, { status: 409 });
  all.push({ id: `mem-${Date.now()}`, organizationId, userId, role, addedAt: new Date().toISOString() });
  await writeMembers(all);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');
  const userId = searchParams.get('userId');
  if (!organizationId || !userId) return NextResponse.json({ error: 'organizationId and userId required' }, { status: 400 });
  const all = await readMembers();
  const next = all.filter((m: any) => !(m.organizationId === organizationId && m.userId === userId));
  await writeMembers(next);
  return NextResponse.json({ ok: true });
}


