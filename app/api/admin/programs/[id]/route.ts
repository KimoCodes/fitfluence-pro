import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin';
import { hasSanityWriteAccess, sanityWriteClient } from '@/lib/sanity';
import { adminProgramSchema } from '@/lib/validations';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

  const updated = await sanityWriteClient
    .patch(params.id)
    .set({
      name: parsed.data.name,
      slug: { _type: 'slug', current: parsed.data.slug },
      description: parsed.data.description,
      price: parsed.data.price,
      badge: parsed.data.badge || undefined,
      features: parsed.data.features,
      stripeProductId: parsed.data.stripeProductId || undefined,
      stripePriceId: parsed.data.stripePriceId || undefined,
      published: parsed.data.published
    })
    .commit();

  return NextResponse.json({ ok: true, program: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!hasSanityWriteAccess()) {
    return NextResponse.json({ error: 'Sanity write access is not configured' }, { status: 500 });
  }

  await sanityWriteClient.delete(params.id);
  return NextResponse.json({ ok: true });
}
