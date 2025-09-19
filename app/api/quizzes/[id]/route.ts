import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const file = path.join(quizzesDir, `${params.id}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    const quiz = JSON.parse(raw);
    return NextResponse.json(quiz); // full quiz including questions
  } catch (e) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }
}
