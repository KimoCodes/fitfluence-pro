import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-wide">Fitfluence Pro</Link>
        <nav className="hidden gap-6 text-sm text-zinc-300 md:flex">
          <a href="#programs">Programs</a>
          <a href="#results">Results</a>
          <a href="#about">About</a>
          <a href="#book">Book Coaching</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-zinc-300">Client Portal</Link>
          <a href="#lead" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-glow">Start My Program</a>
        </div>
      </div>
    </header>
  );
}
