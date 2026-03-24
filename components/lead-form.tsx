'use client';

import { useState } from 'react';

export function LeadForm() {
  const [status, setStatus] = useState('');

  async function onSubmit(formData: FormData) {
    const payload = {
      name: formData.get('name'),
      email: formData.get('email')
    };

    const res = await fetch('/api/lead-magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setStatus(res.ok ? 'Success! Check your inbox for the free workout plan.' : 'Something went wrong.');
  }

  return (
    <form action={onSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <h3 className="text-xl font-semibold">Get the Free Sculpt Starter Plan</h3>
        <p className="mt-2 text-sm text-zinc-300">Join the email list and get a downloadable workout plan plus future offers.</p>
      </div>
      <input name="name" placeholder="Your name" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none" />
      <input name="email" type="email" required placeholder="Email address" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none" />
      <button className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white">Send My Free Plan</button>
      {status ? <p className="text-sm text-zinc-300">{status}</p> : null}
    </form>
  );
}
