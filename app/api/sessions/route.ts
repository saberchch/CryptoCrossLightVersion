import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const sessionsPath = path.join(process.cwd(), 'data', 'sessions.json');

async function readSessions() {
  try { const raw = await fs.readFile(sessionsPath, 'utf-8'); return JSON.parse(raw); } catch { return []; }
}
async function writeSessions(sessions: any[]) {
  await fs.mkdir(path.dirname(sessionsPath), { recursive: true });
  await fs.writeFile(sessionsPath, JSON.stringify(sessions, null, 2));
}

function genCode(length = 6) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const id = searchParams.get('id');
  const quizId = searchParams.get('quizId');
  const all = await readSessions();
  const filtered = all.filter((s: any) =>
    (!code || s.code === code) && (!id || s.id === id) && (!quizId || s.quizId === quizId)
  );
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { quizId, ownerId, privacy = 'private', durationMinutes = 30, expiresAt } = body;
  if (!quizId || !ownerId) return NextResponse.json({ error: 'quizId and ownerId required' }, { status: 400 });
  const all = await readSessions();
  const id = `sess-${Date.now()}`;
  const code = genCode(6);
  const now = new Date();
  const exp = expiresAt ? new Date(expiresAt) : new Date(now.getTime() + durationMinutes * 60000);
  const session = { id, code, quizId, ownerId, status: 'live', privacy, createdAt: now.toISOString(), expiresAt: exp.toISOString() };
  all.push(session);
  await writeSessions(all);
  const baseUrl = process.env.NODE_ENV === 'production' ? (process.env.RENDER_EXTERNAL_URL || '') : 'http://localhost:3000';
  const joinUrl = `${baseUrl}/join?code=${code}`;
  return NextResponse.json({ ...session, joinUrl });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const all = await readSessions();
  const idx = all.findIndex((s: any) => s.id === id);
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (status) all[idx].status = status;
  await writeSessions(all);
  return NextResponse.json(all[idx]);
}


