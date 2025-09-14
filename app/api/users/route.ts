import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'users.json');
const templatePath = path.join(process.cwd(), 'data', 'user_template.json');

interface User {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'educator' | 'admin' | 'moderator';
  username?: string;
  avatarUrl?: string;
  xp: number;
  history: any[];
  passwordHash?: string;
}

type AnyUser = User & Record<string, any>;

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function writeUsers(users: AnyUser[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
}

async function readTemplate(): Promise<{ base?: Record<string, any>; roles?: Record<string, Record<string, any>> }> {
  try {
    const raw = await fs.readFile(templatePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
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
  const template = await readTemplate();
  // Normalize legacy roles to new model
  const incomingRole = String(body.role || '').toLowerCase();
  const normalizedRole: User['role'] = incomingRole === 'student' ? 'learner'
    : incomingRole === 'professor' ? 'educator'
    : incomingRole === 'organization' ? 'learner' // default people to learner; orgs are entities
    : incomingRole === 'moderator' ? 'moderator'
    : incomingRole === 'admin' ? 'admin'
    : 'learner';
  const selectedRole = normalizedRole;
  const baseDefaults = template.base || {};
  const roleDefaults = (template.roles && template.roles[selectedRole]) || { role: selectedRole };

  if (!body.name || !body.email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  // Generate unique username if not provided
  const baseUsername = (body.username || String(body.name || '')).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || `user${Date.now()}`;
  let username = baseUsername;
  let counter = 1;
  const usernameTaken = (u: any) => u.username && u.username.toLowerCase() === username.toLowerCase();
  while (users.some(usernameTaken)) {
    counter += 1;
    username = `${baseUsername}-${counter}`;
  }

  const user: AnyUser = {
    id: body.id || crypto.randomUUID(),
    ...baseDefaults,
    ...roleDefaults,
    // Explicit fields take precedence over defaults
    name: body.name,
    email: body.email,
    role: selectedRole,
    username,
    avatarUrl: body.avatarUrl ?? baseDefaults.avatarUrl ?? '',
    xp: typeof body.xp === 'number' ? body.xp : (typeof baseDefaults.xp === 'number' ? baseDefaults.xp : 0),
    history: Array.isArray(body.history) ? body.history : (Array.isArray(baseDefaults.history) ? baseDefaults.history : []),
    status: body.status ?? baseDefaults.status ?? 'active',
    emailVerified: body.emailVerified ?? baseDefaults.emailVerified ?? false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null,
    forcePasswordChange: false,
    passwordHash,
  };

  // Remove plaintext password if accidentally included
  delete (user as any).password;

  users.push(user as User);
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


