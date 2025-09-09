import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function readQuizSafe(quizId: string) {
  const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');
  const filePath = path.join(quizzesDir, `${quizId}.json`);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET(_request: Request, ctx: { params: { id: string } }) {
  const quizId = ctx.params.id;
  const quiz = readQuizSafe(quizId);
  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  // Access control
  // Headers mirrored from client auth
  // x-user-id, x-user-role
  const requesterId = _request.headers.get('x-user-id');
  const requesterRole = _request.headers.get('x-user-role');

  const isOwner = requesterId && quiz.creator && quiz.creator.id === requesterId;
  const isAdmin = requesterRole === 'admin';
  const isProfessor = requesterRole === 'professor';
  const isPublished = quiz.status !== 'draft';
  const isPublic = quiz.privacy !== 'private';

  // Rules:
  // - Admin: full access
  // - Owner professor: full access
  // - Others: only if published AND public
  const allowed = isAdmin || isOwner || (isPublished && isPublic);
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(quiz);
}

export async function PATCH(request: Request, ctx: { params: { id: string } }) {
  const quizId = ctx.params.id;
  const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');
  const filePath = path.join(quizzesDir, `${quizId}.json`);
  const existing = readQuizSafe(quizId);
  if (!existing) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

  const requesterId = request.headers.get('x-user-id');
  const requesterRole = request.headers.get('x-user-role');
  const isOwner = requesterId && existing.creator && existing.creator.id === requesterId;
  const isAdmin = requesterRole === 'admin';
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const updates = await request.json();
    // Prevent id/file rename via PATCH
    const { id: _omit, creator: creatorUpdate, ...rest } = updates || {};
    const next = {
      ...existing,
      ...(rest || {}),
    };
    // Optionally allow updating creator fields only for admin
    if (creatorUpdate && isAdmin) {
      next.creator = { ...existing.creator, ...creatorUpdate };
    }
    fs.writeFileSync(filePath, JSON.stringify(next, null, 2));
    return NextResponse.json(next);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}

export async function DELETE(request: Request, ctx: { params: { id: string } }) {
  const quizId = ctx.params.id;
  const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');
  const filePath = path.join(quizzesDir, `${quizId}.json`);
  const existing = readQuizSafe(quizId);
  if (!existing) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

  const requesterId = request.headers.get('x-user-id');
  const requesterRole = request.headers.get('x-user-role');
  const isOwner = requesterId && existing.creator && existing.creator.id === requesterId;
  const isAdmin = requesterRole === 'admin';
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}


