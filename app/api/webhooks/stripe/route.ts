import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { sendPurchaseEmails } from '@/lib/email';

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Missing Stripe config' }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' as any });
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail =
        session.customer_details?.email || session.metadata?.customerEmail || undefined;
      const existingUser = customerEmail
        ? await db.user.findUnique({ where: { email: customerEmail } })
        : null;

      await db.transaction.upsert({
        where: { stripeSessionId: session.id },
        update: {
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: session.payment_status || 'paid',
          email: customerEmail,
          customerName: session.customer_details?.name,
          stripeCustomerId:
            typeof session.customer === 'string' ? session.customer : session.customer?.id,
          programSlug: session.metadata?.programSlug,
          userId: existingUser?.id
        },
        create: {
          stripeSessionId: session.id,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: session.payment_status || 'paid',
          email: customerEmail,
          customerName: session.customer_details?.name,
          stripeCustomerId:
            typeof session.customer === 'string' ? session.customer : session.customer?.id,
          programSlug: session.metadata?.programSlug,
          userId: existingUser?.id
        }
      });

      if (existingUser?.id && session.metadata?.programSlug && session.metadata?.programName) {
        await db.purchase.upsert({
          where: { stripeSessionId: session.id },
          update: {
            userId: existingUser.id,
            type: 'PROGRAM',
            programSlug: session.metadata.programSlug,
            programName: session.metadata.programName,
            pricePaid: session.amount_total || 0
          },
          create: {
            userId: existingUser.id,
            type: 'PROGRAM',
            programSlug: session.metadata.programSlug,
            programName: session.metadata.programName,
            pricePaid: session.amount_total || 0,
            stripeSessionId: session.id
          }
        });
      }

      if (customerEmail && session.metadata?.programSlug && session.metadata?.programName) {
        try {
          await sendPurchaseEmails({
            email: customerEmail,
            customerName: session.customer_details?.name,
            programName: session.metadata.programName,
            programSlug: session.metadata.programSlug
          });
        } catch (error) {
          console.error('Purchase email workflow failed:', error);
        }
      }
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch {
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
}
