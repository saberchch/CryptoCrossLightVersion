import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const quizzesDir = path.join(process.cwd(), 'data', 'quizzes');
const usersPath = path.join(process.cwd(), 'data', 'users.json');

function readUsersSafe(): any[] {
  try { return JSON.parse(fs.readFileSync(usersPath, 'utf8')); } catch { return []; }
}

export async function POST() {
  try {
    if (!fs.existsSync(quizzesDir)) {
      return NextResponse.json({ updated: 0, note: 'No quizzes directory' });
    }
    const users = readUsersSafe();
    const defaultCreator = users.find(u => u.role === 'professor') || users.find(u => u.role === 'admin') || {
      id: 'system-migration', name: 'Imported', email: '', role: 'professor'
    };

    const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith('.json'));
    let updated = 0;
    for (const file of files) {
      const filePath = path.join(quizzesDir, file);
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const q = JSON.parse(raw);
        let changed = false;
        if (!q.creator) { q.creator = { id: defaultCreator.id, name: defaultCreator.name, email: defaultCreator.email, role: defaultCreator.role }; changed = true; }
        if (!q.createdAt) { q.createdAt = new Date().toISOString(); changed = true; }
        if (!q.type) { q.type = 'certificate'; changed = true; }
        if (!q.privacy) { q.privacy = 'public'; changed = true; }
        if (!q.status) { q.status = 'published'; changed = true; }
        if (changed) {
          fs.writeFileSync(filePath, JSON.stringify(q, null, 2));
          updated++;
        }
      } catch (e) {
        // skip invalid file
      }
    }
    return NextResponse.json({ updated, total: files.length });
  } catch (e) {
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}


