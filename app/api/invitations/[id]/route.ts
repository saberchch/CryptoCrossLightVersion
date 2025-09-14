import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const invitationsPath = path.join(process.cwd(), 'data', 'invitations.json');
const usersPath = path.join(process.cwd(), 'data', 'users.json');

async function readJson(p: string, fallback: any) { try { const raw = await fs.readFile(p, 'utf-8'); return JSON.parse(raw); } catch { return fallback; } }

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const invites = await readJson(invitationsPath, []);
  const invitation = invites.find((i: any) => i.id === params.id);
  if (!invitation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const users = await readJson(usersPath, []);
  const user = users.find((u: any) => u.id === invitation.userId);
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Credentials</title>
<style>
  body { font-family: Arial, sans-serif; padding: 24px; }
  .card { border: 1px solid #eee; padding: 24px; border-radius: 8px; max-width: 720px; margin: 0 auto; }
  h1 { margin: 0 0 8px; }
  .meta { color: #555; margin-bottom: 16px; }
  .row { display: flex; gap: 24px; }
  .col { flex: 1; }
  .kv { margin: 8px 0; }
  .label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  .value { font-size: 14px; }
  .cta { margin-top: 16px; font-size: 14px; }
</style>
</head>
<body>
  <div class="card">
    <h1>CryptoCross Credentials</h1>
    <div class="meta">Issued: ${new Date(invitation.createdAt).toLocaleString()}</div>
    <div class="row">
      <div class="col">
        <div class="kv"><div class="label">Name</div><div class="value">${user?.name || ''}</div></div>
        <div class="kv"><div class="label">Email</div><div class="value">${user?.email || ''}</div></div>
        <div class="kv"><div class="label">Username</div><div class="value">${user?.username || ''}</div></div>
      </div>
      <div class="col">
        <div class="kv"><div class="label">Organization</div><div class="value">${invitation.organizationId}</div></div>
        <div class="kv"><div class="label">Role</div><div class="value">${invitation.role}</div></div>
        <div class="kv"><div class="label">Temporary Password</div><div class="value">${invitation.tempPassword ? invitation.tempPassword : (invitation.hasTempPassword ? 'Provided separately' : 'Existing account - use your current password')}</div></div>
      </div>
    </div>
    <div class="cta">Login: https://cryptocross.local/login — On first login, go to Profile → Change password.</div>
  </div>
  <script>window.print && window.print()</script>
</body>
</html>`;
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
