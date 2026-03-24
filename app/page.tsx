import Image from 'next/image';
import Link from 'next/link';
import { CheckoutButton } from '@/components/checkout-button';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { LeadForm } from '@/components/lead-form';
import { BookingForm } from '@/components/booking-form';
import { getPrograms, getSiteSettings, getTestimonials } from '@/lib/cms';
import { currency } from '@/lib/utils';

export default async function HomePage() {
  const [programs, testimonials, siteSettings] = await Promise.all([
    getPrograms(),
    getTestimonials(),
    getSiteSettings()
  ]);

  const benefitItems = siteSettings.benefits?.length ? siteSettings.benefits : [];

  return (
    <main className="bg-mesh">
      <Navbar />

      <section className="container-shell grid gap-10 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-2 text-sm text-brand-200">{siteSettings.heroEyebrow}</p>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">{siteSettings.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-300">{siteSettings.heroDescription}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#programs" className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white shadow-glow">Start My Program</a>
            <a href="#book" className="rounded-full border border-white/15 px-6 py-3 font-semibold">Book Coaching</a>
          </div>
          <div className="mt-8 flex gap-8 text-sm text-zinc-300">
            <div><span className="block text-2xl font-bold text-white">2 weeks</span> Fast visible wins</div>
            <div><span className="block text-2xl font-bold text-white">24/7</span> Client access</div>
            <div><span className="block text-2xl font-bold text-white">3 offers</span> Built to convert</div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-glow">
          <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-zinc-900">
            <Image
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80"
              alt="Fitness hero"
              width={1200}
              height={1500}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-8 left-8 rounded-2xl border border-white/10 bg-zinc-950/85 p-4 backdrop-blur">
            <p className="text-sm text-zinc-300">Workout reel / intro video placeholder</p>
            <p className="mt-1 text-lg font-semibold">Replace with short embedded video</p>
          </div>
        </div>
      </section>

      <section id="results" className="container-shell py-16">
        <h2 className="section-title">Proof that builds trust fast</h2>
        <p className="section-copy">Feature before-and-after shots, screenshots of client messages, and short testimonials that remove doubt.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold">{item.name}</span>
                <span className="text-sm text-brand-300">{item.result}</span>
              </div>
              <p className="text-zinc-300">“{item.quote}”</p>
              <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-6 text-sm text-zinc-400">Before / After media placeholder</div>
            </article>
          ))}
        </div>
      </section>

      <section id="programs" className="container-shell py-16">
        <h2 className="section-title">Programs designed to sell clearly</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {programs.map((program) => (
            <article key={program.slug} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/8 to-white/3 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{program.name}</h3>
                <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-200">{program.badge}</span>
              </div>
              <p className="mt-4 text-zinc-300">{program.description}</p>
              <p className="mt-6 text-3xl font-bold">{currency.format(program.price)}</p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                {program.features.map((feature) => <li key={feature}>• {feature}</li>)}
              </ul>
              <div className="mt-8 flex gap-3">
                <Link href={`/programs/${program.slug}`} className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold">View Program</Link>
                <CheckoutButton slug={program.slug} label="Buy Now" className="rounded-full border border-white/10 px-5 py-3 text-sm" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell grid gap-6 py-16 lg:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Daily Workouts</h3>
          <p className="mt-3 text-zinc-300">Smart gym and home options with video guidance and progressive overload.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Fat-Burning Circuits</h3>
          <p className="mt-3 text-zinc-300">High-energy sessions built to increase burn, improve conditioning, and keep results visible.</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Premium Coaching</h3>
          <p className="mt-3 text-zinc-300">Custom planning, direct accountability, and regular check-ins that increase retention.</p>
        </article>
      </section>

      <section className="container-shell py-16">
        <h2 className="section-title">Why it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {benefitItems.map((benefit) => (
            <div key={benefit} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-zinc-300">{benefit}</div>
          ))}
        </div>
      </section>

      <section id="about" className="container-shell grid gap-8 py-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="overflow-hidden rounded-[2rem] border border-white/10">
          <Image src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80" alt="Coach portrait" width={1200} height={1200} className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="section-title">About the coach</h2>
          <p className="section-copy">From sharing fitness content online to coaching real transformation, this brand is built around helping clients create confidence, discipline, and visible results without confusion.</p>
          <p className="mt-4 text-zinc-300">Use this section to tell a short, personal story, explain the mission, and make the brand feel human and trustworthy.</p>
        </div>
      </section>

      <section id="lead" className="container-shell grid gap-8 py-16 lg:grid-cols-2">
        <LeadForm />
        <div id="book" className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/15 to-transparent p-6">
          <h2 className="text-2xl font-bold">Book 1-on-1 or group coaching</h2>
          <p className="mt-3 text-zinc-300">Use selectable slots, automated confirmation emails, and reminder workflows to increase show-up rates.</p>
          <div className="mt-6">
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold">Already a client?</h2>
            <p className="mt-2 text-zinc-300">Log in to access your purchased programs and coaching dashboard.</p>
          </div>
          <Link href="/login" className="rounded-full bg-white px-5 py-3 font-semibold text-zinc-950">Open Client Portal</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
