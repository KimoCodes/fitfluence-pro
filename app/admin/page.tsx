import { AdminConsole } from '@/components/admin-console';
import { requireAdmin } from '@/lib/admin';
import { getAdminPrograms } from '@/lib/cms';
import { db } from '@/lib/db';

export default async function AdminPage() {
  await requireAdmin();
  const [programs, bookings, leads, transactions] = await Promise.all([
    getAdminPrograms(),
    db.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    db.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    db.transaction.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  ]);

  return (
    <main className="container-shell py-16">
      <h1 className="text-4xl font-black">Admin Dashboard</h1>
      <p className="mt-3 max-w-3xl text-zinc-300">Manage Sanity-powered offers, review Stripe purchase logs, and triage live leads and coaching requests from one protected console.</p>
      <AdminConsole
        initialPrograms={programs}
        initialBookings={bookings.map((booking) => ({
          ...booking,
          date: booking.date.toISOString(),
          createdAt: booking.createdAt.toISOString()
        }))}
        initialLeads={leads.map((lead) => ({
          ...lead,
          createdAt: lead.createdAt.toISOString()
        }))}
        initialTransactions={transactions.map((transaction) => ({
          ...transaction,
          createdAt: transaction.createdAt.toISOString()
        }))}
      />
    </main>
  );
}
