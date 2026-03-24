import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin';
import { leadStatusSchema } from '@/lib/validations';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = leadStatusSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const lead = await db.lead.update({
    where: { id: params.id },
    data: { status: parsed.data.status }
  });

  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await db.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
