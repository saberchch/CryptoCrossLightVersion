import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const file = path.join(quizzesDir, `${params.id}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    const quiz = JSON.parse(raw);
    const next = { ...quiz, ...(body || {}), updatedAt: new Date().toISOString() };
    await fs.writeFile(file, JSON.stringify(next, null, 2));
    return NextResponse.json(next);
  } catch (e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const file = path.join(quizzesDir, `${params.id}.json`);
  try {
    await fs.unlink(file);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}


