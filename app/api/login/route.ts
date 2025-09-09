import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const dataPath = path.join(process.cwd(), 'data', 'users.json');

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Admin login path: validated against env, not database registration
  if (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
    }
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // Return minimal admin profile; if DB has admin record use it, else synthesize
    try {
      const raw = await fs.readFile(dataPath, 'utf-8');
      const users = JSON.parse(raw) as any[];
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      const adminUser = existing || {
        id: 'admin-virtual',
        name: 'Admin',
        email,
        role: 'admin',
        avatarUrl: '',
        xp: 0,
        history: [],
      };
      return NextResponse.json(adminUser);
    } catch {
      return NextResponse.json({ id: 'admin-virtual', name: 'Admin', email, role: 'admin', avatarUrl: '', xp: 0, history: [] });
    }
  }

  // Normal user login: check JSON store
  try {
    const raw = await fs.readFile(dataPath, 'utf-8');
    const users = JSON.parse(raw) as any[];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const hash = sha256(password);
    if (hash !== user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // Do not return passwordHash to client
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (e) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}


