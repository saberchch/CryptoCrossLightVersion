import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const usersPath = path.join(process.cwd(), 'data', 'users.json');
const invitationsPath = path.join(process.cwd(), 'data', 'invitations.json');

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function POST(request: Request) {
  const { email, currentPassword, newPassword } = await request.json();
  if (!email || !newPassword) {
    return NextResponse.json({ error: 'email and newPassword required' }, { status: 400 });
  }
  if (String(newPassword).length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }
  try {
    const raw = await fs.readFile(usersPath, 'utf-8');
    const users = JSON.parse(raw) as any[];
    const idx = users.findIndex(u => u.email?.toLowerCase() === String(email).toLowerCase());
    if (idx === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const user = users[idx];
    if (currentPassword) {
      const ok = user.passwordHash && sha256(currentPassword) === user.passwordHash;
      if (!ok) return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
    }
    users[idx] = {
      ...user,
      passwordHash: sha256(newPassword),
      status: 'active',
      forcePasswordChange: false,
      passwordUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

    // Remove any outstanding invitations for this user
    try {
      const invRaw = await fs.readFile(invitationsPath, 'utf-8').catch(() => '[]');
      const invites = JSON.parse(invRaw || '[]');
      const nextInvites = Array.isArray(invites) ? invites.filter((i: any) => i.userId !== users[idx].id) : invites;
      await fs.writeFile(invitationsPath, JSON.stringify(nextInvites, null, 2));
    } catch {}
    const { passwordHash, ...safe } = users[idx];
    return NextResponse.json(safe);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
