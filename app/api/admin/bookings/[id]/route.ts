import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin';
import { bookingStatusSchema } from '@/lib/validations';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const parsed = bookingStatusSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const booking = await db.booking.update({
    where: { id: params.id },
    data: { status: parsed.data.status }
  });

  return NextResponse.json({ ok: true, booking });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await db.booking.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
