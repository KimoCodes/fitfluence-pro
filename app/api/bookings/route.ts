import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendBookingEmails } from '@/lib/email';
import { bookingSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid booking details' }, { status: 400 });
  const session = await getServerSession(authOptions);
  const user = session?.user?.email
    ? await db.user.findUnique({ where: { email: session.user.email } })
    : null;

  const booking = await db.booking.create({
    data: {
      userId: user?.id,
      name: parsed.data.name,
      email: parsed.data.email,
      sessionType: parsed.data.sessionType,
      date: new Date(parsed.data.date),
      notes: parsed.data.notes
    }
  });

  try {
    await sendBookingEmails({
      email: booking.email,
      name: booking.name,
      sessionType: booking.sessionType,
      date: booking.date.toISOString(),
      notes: booking.notes
    });
  } catch (error) {
    console.error('Booking email workflow failed:', error);
  }

  return NextResponse.json({ ok: true, booking });
}
