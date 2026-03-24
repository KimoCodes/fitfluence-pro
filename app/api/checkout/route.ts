import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getProgramBySlug } from '@/lib/cms';
import { getAppUrl, getStripeClient } from '@/lib/stripe';
import { checkoutSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const stripe = getStripeClient();
  if (!stripe) return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'A valid program slug is required' }, { status: 400 });
  }

  const program = await getProgramBySlug(parsed.data.slug);

  if (!program || !program.published) {
    return NextResponse.json({ error: 'Program not found' }, { status: 404 });
  }

  if (!program.stripePriceId) {
    return NextResponse.json(
      { error: 'This program is missing a Stripe price ID in Sanity' },
      { status: 400 }
    );
  }

  const authSession = await getServerSession(authOptions);
  const signedInUser = authSession?.user?.email
    ? await db.user.findUnique({ where: { email: authSession.user.email } })
    : null;

  const appUrl = getAppUrl();
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: program.stripePriceId, quantity: 1 }],
    client_reference_id: signedInUser?.id,
    customer_email: signedInUser?.email || authSession?.user?.email || undefined,
    metadata: {
      purchaseType: 'PROGRAM',
      programSlug: program.slug,
      programName: program.name,
      userId: signedInUser?.id || '',
      customerEmail: signedInUser?.email || authSession?.user?.email || ''
    },
    success_url: `${appUrl}/dashboard?success=1`,
    cancel_url: `${appUrl}/programs/${program.slug}?canceled=1`
  });

  return NextResponse.json({ url: checkoutSession.url });
}
