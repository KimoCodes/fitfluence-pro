'use client';

import { useState } from 'react';

export function BookingForm() {
  const [status, setStatus] = useState('');

  async function onSubmit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setStatus(res.ok ? 'Booking requested. Confirmation emails are on the way.' : 'Unable to save booking.');
  }

  return (
    <form action={onSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <input name="name" placeholder="Full name" required className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
      <input name="email" type="email" placeholder="Email address" required className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
      <select name="sessionType" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3">
        <option value="one_on_one">1-on-1 Coaching</option>
        <option value="group">Group Coaching</option>
      </select>
      <input name="date" type="datetime-local" required className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
      <textarea name="notes" placeholder="Goals, injuries, or questions" className="min-h-28 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
      <button className="rounded-2xl bg-white px-4 py-3 font-semibold text-zinc-950">Book Session</button>
      {status ? <p className="text-sm text-zinc-300">{status}</p> : null}
    </form>
  );
}
