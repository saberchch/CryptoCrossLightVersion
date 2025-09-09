import { NextResponse } from 'next/server';
import { QuizResult } from '@/lib/quiz';
import { promises as fs } from 'fs';
import path from 'path';

const resultsPath = path.join(process.cwd(), 'data', 'results.json');
async function readResults() {
  try { const raw = await fs.readFile(resultsPath, 'utf-8'); return JSON.parse(raw); } catch { return []; }
}
async function writeResults(results: any[]) {
  await fs.mkdir(path.dirname(resultsPath), { recursive: true });
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
}

export async function POST(request: Request) {
  try {
    const result: QuizResult = await request.json();
    
    // Validate required fields
    if (!result.quizId || !result.studentName || result.score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const id = `result-${Date.now()}`;
    const toSave = { id, ...result };
    const all = await readResults();
    all.push(toSave);
    await writeResults(all);
    return NextResponse.json({ message: 'Result saved successfully', resultId: id }, { status: 201 });
  } catch (error) {
    console.error('Error saving result:', error);
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const quizId = searchParams.get('quizId');
    const all = await readResults();
    const filtered = all.filter((r: any) =>
      (!email || r.studentEmail?.toLowerCase() === email.toLowerCase()) &&
      (!quizId || r.quizId === quizId)
    );
    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
