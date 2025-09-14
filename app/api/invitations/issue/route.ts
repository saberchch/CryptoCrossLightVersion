import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const usersPath = path.join(process.cwd(), 'data', 'users.json');
const membersPath = path.join(process.cwd(), 'data', 'user_organizations.json');
const invitationsPath = path.join(process.cwd(), 'data', 'invitations.json');

async function readJson(p: string, fallback: any) { try { const raw = await fs.readFile(p, 'utf-8'); return JSON.parse(raw); } catch { return fallback; } }
async function writeJson(p: string, data: any) { await fs.mkdir(path.dirname(p), { recursive: true }); await fs.writeFile(p, JSON.stringify(data, null, 2)); }

function randomPassword(len = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function makeBaseUsername(name: string) {
  const base = (name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
  return base || `user${Date.now()}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { organizationId, users } = body as { organizationId: string; users: Array<{ name: string; email?: string; role: 'learner'|'educator' }>; };
  if (!organizationId || !Array.isArray(users) || users.length === 0) return NextResponse.json({ error: 'organizationId and users required' }, { status: 400 });

  const [allUsers, allMembers, allInvites] = await Promise.all([
    readJson(usersPath, []),
    readJson(membersPath, []),
    readJson(invitationsPath, []),
  ]);

  const results: any[] = [];
  for (const u of users) {
    const email = (u.email || '').trim();
    let user = email ? allUsers.find((x: any) => x.email?.toLowerCase() === email.toLowerCase()) : undefined;

    let created = false;
    let tempPassword: string | undefined;
    if (!user) {
      const cryptoMod = await import('crypto');
      const id = cryptoMod.randomUUID();
      // unique username
      const base = makeBaseUsername(u.name || email || id);
      let username = base; let counter = 1;
      while (allUsers.some((x: any) => (x.username || '').toLowerCase() === username.toLowerCase())) { counter += 1; username = `${base}-${counter}`; }
      tempPassword = randomPassword();
      const passwordHash = cryptoMod.createHash('sha256').update(tempPassword).digest('hex');
      user = {
        id,
        name: u.name || username,
        email: email || `${id}+${organizationId}@cryptocross.local`,
        role: u.role,
        username,
        avatarUrl: '',
        xp: 0,
        history: [],
        status: 'active',
        forcePasswordChange: true,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null,
        passwordHash,
      };
      allUsers.push(user);
      created = true;
    }

    // add membership if not present
    if (!allMembers.find((m: any) => m.organizationId === organizationId && m.userId === user!.id)) {
      allMembers.push({ id: `mem-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, organizationId, userId: user!.id, role: u.role, addedAt: new Date().toISOString() });
    }

    const invitation = {
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      userId: user!.id,
      organizationId,
      role: u.role,
      emailIssuedTo: user!.email,
      createdAt: new Date().toISOString(),
      delivery: 'download',
      status: 'created',
      hasTempPassword: !!tempPassword,
      tempPassword: tempPassword || undefined,
    };
    allInvites.push(invitation);

    results.push({
      invitationId: invitation.id,
      userId: user!.id,
      name: user!.name,
      email: user!.email,
      username: (user as any).username,
      tempPassword,
      existingUser: !created,
    });
  }

  await Promise.all([
    writeJson(usersPath, allUsers),
    writeJson(membersPath, allMembers),
    writeJson(invitationsPath, allInvites),
  ]);

  return NextResponse.json({ ok: true, results });
}
