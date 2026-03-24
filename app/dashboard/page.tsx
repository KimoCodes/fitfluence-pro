import { db } from '@/lib/db';
import { requireUser } from '@/lib/admin';
import { getProgramsBySlugs } from '@/lib/cms';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await requireUser();
  const [purchases, bookings] = await Promise.all([
    db.purchase.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    }),
    db.booking.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' }
    })
  ]);
  const purchasedPrograms = await getProgramsBySlugs(
    purchases.map((purchase) => purchase.programSlug).filter(Boolean) as string[]
  );

  return (
    <main className="container-shell py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">Client Dashboard</h1>
          <p className="mt-2 text-zinc-300">Purchased programs, bookings, and progress tools live here for {session.user.name}.</p>
        </div>
        <Link href="/" className="text-sm text-zinc-400">Back to website</Link>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        {purchasedPrograms.length ? purchasedPrograms.map((program) => (
          <article key={program.slug} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">{program.name}</h2>
            <p className="mt-3 text-zinc-300">Workout videos, downloadable plans, and weekly structure.</p>
            <Link href={`/programs/${program.slug}`} className="mt-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950">Open Program</Link>
          </article>
        )) : (
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold">No purchases yet</h2>
            <p className="mt-3 text-zinc-300">Complete checkout on a program page and it will appear here automatically after Stripe confirmation.</p>
          </article>
        )}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Upcoming bookings</h3>
          <div className="mt-4 grid gap-4">
            {bookings.length ? bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
                <p className="font-medium">{booking.sessionType}</p>
                <p className="mt-2 text-sm text-zinc-300">{booking.date.toLocaleString()}</p>
                <p className="mt-1 text-sm text-zinc-400">Status: {booking.status}</p>
              </div>
            )) : <p className="mt-3 text-zinc-300">No upcoming sessions yet.</p>}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Progress tracking</h3>
          <p className="mt-3 text-zinc-300">Optional enhancement: measurements, check-ins, streaks, and photo uploads.</p>
        </div>
      </section>
    </main>
  );
}
