import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'users.json');

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'organization' | 'admin';
  avatarUrl?: string;
  xp: number;
  history: any[];
  passwordHash?: string;
}

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const users = await readUsers();
  if (email) {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return NextResponse.json(user || null);
  }
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const users = await readUsers();
  const exists = users.find(u => u.email.toLowerCase() === String(body.email).toLowerCase());
  if (exists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  if (String(body.role) === 'admin') {
    return NextResponse.json({ error: 'Admin cannot be registered' }, { status: 403 });
  }
  if (!body.password || String(body.password).length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }
  const cryptoMod = await import('crypto');
  const passwordHash = cryptoMod.createHash('sha256').update(String(body.password)).digest('hex');
  const user: User = {
    id: body.id || crypto.randomUUID(),
    name: body.name,
    email: body.email,
    role: body.role || 'student',
    avatarUrl: body.avatarUrl || '',
    xp: Number(body.xp) || 0,
    history: Array.isArray(body.history) ? body.history : [],
    passwordHash,
  };
  users.push(user);
  await writeUsers(users);
  const { passwordHash: _omit, ...safeUser } = user;
  return NextResponse.json(safeUser, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { email, addXp, addHistory, updates } = body as {
    email: string;
    addXp?: number;
    addHistory?: any;
    updates?: Partial<Pick<User, 'name' | 'avatarUrl'>>;
  };
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }
  const users = await readUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const current = users[idx];
  const next: User = {
    ...current,
    xp: typeof addXp === 'number' ? Math.max(0, (current.xp || 0) + addXp) : current.xp,
    history: addHistory ? [addHistory, ...(current.history || [])].slice(0, 50) : current.history,
    ...(updates || {}),
  };
  users[idx] = next;
  await writeUsers(users);
  return NextResponse.json(next);
}


