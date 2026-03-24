import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckoutButton } from '@/components/checkout-button';
import { getProgramBySlug } from '@/lib/cms';
import { currency } from '@/lib/utils';

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const program = await getProgramBySlug(params.slug);
  if (!program) return notFound();

  return (
    <main className="container-shell py-16">
      <Link href="/" className="text-sm text-zinc-400">← Back home</Link>
      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm text-brand-300">{program.badge}</p>
        <h1 className="mt-3 text-4xl font-black">{program.name}</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">{program.description}</p>
        <p className="mt-8 text-3xl font-bold">{currency.format(program.price)}</p>
        <ul className="mt-8 space-y-3 text-zinc-300">
          {program.features.map((feature) => <li key={feature}>• {feature}</li>)}
        </ul>
        <div className="mt-10 flex gap-4">
          <CheckoutButton slug={program.slug} label="Checkout with Stripe" className="rounded-full bg-brand-500 px-6 py-3 font-semibold" />
          <Link href="/login" className="rounded-full border border-white/10 px-6 py-3 font-semibold">Login to Portal</Link>
        </div>
      </div>
    </main>
  );
}
