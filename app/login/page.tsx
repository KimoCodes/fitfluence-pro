'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');

  async function onSubmit(formData: FormData) {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const res = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/dashboard' });
    if (res?.error) setError('Invalid credentials');
    else window.location.href = '/dashboard';
  }

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <form action={onSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Client Portal Login</h1>
        <p className="mt-2 text-zinc-300">Access purchased programs and coaching resources.</p>
        <div className="mt-8 grid gap-4">
          <input name="email" type="email" placeholder="Email" required className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
          <input name="password" type="password" placeholder="Password" required className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
          <button className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold">Login</button>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
        </div>
        <p className="mt-6 text-sm text-zinc-400">New here? <Link href="/register" className="text-white">Create an account</Link></p>
      </form>
    </main>
  );
}
