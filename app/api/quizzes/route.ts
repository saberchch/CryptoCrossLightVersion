import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');
const usersPath = path.join(process.cwd(), 'data', 'users.json');
const membersPath = path.join(process.cwd(), 'data', 'user_organizations.json');

async function readJson(p: string, fallback: any) { try { const raw = await fs.readFile(p, 'utf-8'); return JSON.parse(raw); } catch { return fallback; } }

function isMemberOfOrg(members: any[], userId: string, orgId: string) {
  return members.some(m => m.organizationId === orgId && m.userId === userId);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('orgId') || undefined;
  const type = searchParams.get('type') || undefined;
  const status = searchParams.get('status') || undefined;

  const members = await readJson(membersPath, []);

  try {
    await fs.mkdir(quizzesDir, { recursive: true });
    const files = await fs.readdir(quizzesDir);
    const list: any[] = [];
    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      try {
        const q = JSON.parse(await fs.readFile(path.join(quizzesDir, f), 'utf-8'));
        if (orgId) {
          const creatorId = q.creator?.id;
          if (!creatorId || !isMemberOfOrg(members, creatorId, orgId)) continue;
        }
        if (type && String(q.type || '').toLowerCase() !== type.toLowerCase()) continue;
        if (status && String(q.status || '').toLowerCase() !== status.toLowerCase()) continue;
        list.push({ id: q.id, title: q.title, description: q.description, difficulty: q.difficulty, duration: q.duration, passingScore: q.passingScore, creator: q.creator, createdAt: q.createdAt, type: q.type, privacy: q.privacy, status: q.status });
      } catch {}
    }
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to list quizzes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, type, organizationId, creator } = body as any;
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

  const users = await readJson(usersPath, []);
  const members = await readJson(membersPath, []);
  const creatorId = creator?.id || creator?.userId || null;

  if (organizationId && creatorId) {
    const ok = isMemberOfOrg(members, creatorId, organizationId);
    if (!ok) return NextResponse.json({ error: 'creator not in organization' }, { status: 403 });
  }

  try {
    await fs.mkdir(quizzesDir, { recursive: true });
    const cryptoMod = await import('crypto');
    const id = body.id || cryptoMod.randomUUID();
    const now = new Date().toISOString();
    const quiz = {
      id,
      title,
      description: description || '',
      type: (type || 'quiz').toLowerCase(),
      privacy: organizationId ? 'org' : 'public',
      status: 'draft',
      createdAt: now,
      creator: creator || null,
      questions: Array.isArray(body.questions) ? body.questions : [],
    };
    await fs.writeFile(path.join(quizzesDir, `${id}.json`), JSON.stringify(quiz, null, 2));
    return NextResponse.json(quiz, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
