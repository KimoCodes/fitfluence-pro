import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendLeadMagnetEmails } from '@/lib/email';
import { leadSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

  const lead = await db.lead.upsert({
    where: { email: parsed.data.email },
    update: {
      name: parsed.data.name,
      source: 'website',
      lastEmailedAt: new Date()
    },
    create: {
      email: parsed.data.email,
      name: parsed.data.name,
      source: 'website',
      lastEmailedAt: new Date()
    }
  });

  try {
    await sendLeadMagnetEmails({ email: lead.email, name: lead.name });
  } catch (error) {
    console.error('Lead email workflow failed:', error);
  }

  return NextResponse.json({ ok: true, message: 'Lead saved and email automation triggered.' });
}
