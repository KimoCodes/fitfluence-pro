import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin';

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const transactions = await db.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return NextResponse.json({ transactions });
}
