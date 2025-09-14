import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const orgsPath = path.join(process.cwd(), 'data', 'organizations.json');

async function readOrgs() {
  try { const raw = await fs.readFile(orgsPath, 'utf-8'); return JSON.parse(raw); } catch { return []; }
}
async function writeOrgs(orgs: any[]) {
  await fs.mkdir(path.dirname(orgsPath), { recursive: true });
  await fs.writeFile(orgsPath, JSON.stringify(orgs, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const orgs = await readOrgs();
  if (id) return NextResponse.json(orgs.find((o: any) => o.id === id) || null);
  return NextResponse.json(orgs);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name) return NextResponse.json({ error: 'name required' }, { status: 400 });
  const orgs = await readOrgs();
  const id = body.id || `org-${crypto.randomUUID?.() || Date.now()}`;
  if (orgs.some((o: any) => o.id === id)) return NextResponse.json({ error: 'duplicate id' }, { status: 409 });
  const org = { id, name: body.name, createdAt: new Date().toISOString(), logoUrl: body.logoUrl || '', settings: body.settings || {} };
  orgs.push(org);
  await writeOrgs(orgs);
  return NextResponse.json(org, { status: 201 });
}


