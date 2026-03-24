import { NextResponse } from 'next/server';
import { adminProgramSchema } from '@/lib/validations';
import { hasSanityWriteAccess, sanityWriteClient } from '@/lib/sanity';
import { isAdminRequest } from '@/lib/admin';
import { getAdminPrograms } from '@/lib/cms';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const programs = await getAdminPrograms();
  return NextResponse.json({ programs });
}

export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!hasSanityWriteAccess()) {
    return NextResponse.json({ error: 'Sanity write access is not configured' }, { status: 500 });
  }

  const body = await req.json();
  const parsed = adminProgramSchema.safeParse({
    ...body,
    features: Array.isArray(body.features)
      ? body.features
      : String(body.features || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await sanityWriteClient.create({
    _type: 'program',
    name: parsed.data.name,
    slug: { _type: 'slug', current: parsed.data.slug },
    description: parsed.data.description,
    price: parsed.data.price,
    badge: parsed.data.badge || undefined,
    features: parsed.data.features,
    stripeProductId: parsed.data.stripeProductId || undefined,
    stripePriceId: parsed.data.stripePriceId || undefined,
    published: parsed.data.published
  });

  return NextResponse.json({ ok: true, program: created });
}
