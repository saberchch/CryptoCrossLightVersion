import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const resultsPath = path.join(process.cwd(), 'data', 'session_results.json');

async function readAll() { try { const raw = await fs.readFile(resultsPath, 'utf-8'); return JSON.parse(raw); } catch { return []; } }
async function writeAll(arr: any[]) { await fs.mkdir(path.dirname(resultsPath), { recursive: true }); await fs.writeFile(resultsPath, JSON.stringify(arr, null, 2)); }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const email = searchParams.get('email');
  const all = await readAll();
  const filtered = all.filter((r: any) => (!sessionId || r.sessionId === sessionId) && (!email || r.studentEmail?.toLowerCase() === email.toLowerCase()));
  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, quizId, studentName, studentEmail, score, passed, completedAt } = body || {};
  if (!sessionId || !quizId || !studentEmail) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  const all = await readAll();
  const id = `sres-${Date.now()}`;
  const rec = { id, sessionId, quizId, studentName, studentEmail, score, passed, completedAt: completedAt || new Date().toISOString() };
  all.push(rec);
  await writeAll(all);
  return NextResponse.json(rec, { status: 201 });
}


