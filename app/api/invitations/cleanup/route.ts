import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const invitationsPath = path.join(process.cwd(), 'data', 'invitations.json');

async function readJson(p: string, fallback: any) { try { const raw = await fs.readFile(p, 'utf-8'); return JSON.parse(raw); } catch { return fallback; } }
async function writeJson(p: string, data: any) { await fs.mkdir(path.dirname(p), { recursive: true }); await fs.writeFile(p, JSON.stringify(data, null, 2)); }

export async function POST(request: Request) {
  const { invitationId, organizationId } = await request.json().catch(() => ({}));
  const invites = await readJson(invitationsPath, []);
  let updated = 0;
  const next = invites.map((inv: any) => {
    if ((invitationId && inv.id === invitationId) || (organizationId && inv.organizationId === organizationId) || (!invitationId && !organizationId)) {
      if (inv.tempPassword) { updated++; }
      return { ...inv, tempPassword: undefined, hasTempPassword: false, status: inv.status === 'created' ? 'redacted' : inv.status };
    }
    return inv;
  });
  await writeJson(invitationsPath, next);
  return NextResponse.json({ ok: true, updated });
}
