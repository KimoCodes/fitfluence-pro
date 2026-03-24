'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [status, setStatus] = useState('');

  async function onSubmit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setStatus(res.ok ? 'Account created. You can now log in.' : 'Registration failed.');
  }

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <form action={onSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <div className="mt-8 grid gap-4">
          <input name="name" placeholder="Full name" required className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
          <input name="email" type="email" placeholder="Email" required className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
          <input name="password" type="password" placeholder="Password" required className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
          <button className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold">Create Account</button>
          {status ? <p className="text-sm text-zinc-300">{status}</p> : null}
        </div>
        <p className="mt-6 text-sm text-zinc-400">Already registered? <Link href="/login" className="text-white">Log in</Link></p>
      </form>
    </main>
  );
}
