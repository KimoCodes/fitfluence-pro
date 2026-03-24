import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { registerSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 });

    const password = await hash(parsed.data.password, 10);
    await db.user.create({ data: { ...parsed.data, password } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
