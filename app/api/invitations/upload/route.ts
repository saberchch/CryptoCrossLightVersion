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

function parseCsv(text: string): Array<{ name: string; email?: string; role: 'learner'|'educator'|'moderator' }> {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const idxName = header.indexOf('name');
  const idxEmail = header.indexOf('email');
  const idxRole = header.indexOf('role');
  const rows: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    const name = idxName >= 0 ? cols[idxName] : '';
    const email = idxEmail >= 0 ? cols[idxEmail] : '';
    const role = (idxRole >= 0 ? cols[idxRole] : 'learner').toLowerCase();
    if (!name) continue;
    const normalizedRole = role === 'educator' ? 'educator' : role === 'moderator' ? 'moderator' : 'learner';
    rows.push({ name, email, role: normalizedRole });
  }
  return rows;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const orgId = String(form.get('organizationId') || '');
  const file = form.get('file') as unknown as File;
  if (!orgId) return NextResponse.json({ error: 'organizationId required' }, { status: 400 });
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });
  const text = await file.text();
  const entries = parseCsv(text);
  if (entries.length === 0) return NextResponse.json({ error: 'No valid rows found' }, { status: 400 });

  const [allUsers, allMembers, allInvites] = await Promise.all([
    readJson(usersPath, []),
    readJson(membersPath, []),
    readJson(invitationsPath, []),
  ]);

  const results: any[] = [];
  for (const u of entries) {
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
        email: email || `${id}+${orgId}@cryptocross.local`,
        role: u.role === 'educator' ? 'educator' : (u.role === 'moderator' ? 'moderator' : 'learner'),
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
    if (!allMembers.find((m: any) => m.organizationId === orgId && m.userId === user!.id)) {
      allMembers.push({ id: `mem-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, organizationId: orgId, userId: user!.id, role: u.role, addedAt: new Date().toISOString() });
    }

    const invitation = {
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      userId: user!.id,
      organizationId: orgId,
      role: u.role,
      emailIssuedTo: user!.email,
      createdAt: new Date().toISOString(),
      delivery: 'download',
      status: 'created',
      hasTempPassword: !!tempPassword,
      tempPassword: tempPassword || undefined,
    };
    allInvites.push(invitation);

    results.push({ invitationId: invitation.id, userId: user!.id, name: user!.name, email: user!.email, username: (user as any).username, tempPassword, existingUser: !created });
  }

  await Promise.all([
    writeJson(usersPath, allUsers),
    writeJson(membersPath, allMembers),
    writeJson(invitationsPath, allInvites),
  ]);

  return NextResponse.json({ ok: true, created: results.length, results });
}
