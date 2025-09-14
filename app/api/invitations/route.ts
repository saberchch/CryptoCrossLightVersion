import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const invitationsPath = path.join(process.cwd(), 'data', 'invitations.json');

async function readJson(p: string, fallback: any) { try { const raw = await fs.readFile(p, 'utf-8'); return JSON.parse(raw); } catch { return fallback; } }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');
  const invites = await readJson(invitationsPath, []);
  const filtered = organizationId ? invites.filter((i: any) => i.organizationId === organizationId) : invites;
  return NextResponse.json(filtered);
}
