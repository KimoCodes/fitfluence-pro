import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect('/login');
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireUser();

  if (session.user.role !== Role.ADMIN) {
    redirect('/dashboard');
  }

  return session;
}

export async function isAdminRequest() {
  const session = await getCurrentSession();
  return session?.user?.role === Role.ADMIN;
}
