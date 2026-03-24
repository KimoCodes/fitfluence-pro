'use client';

import { useState, useTransition } from 'react';
import type { ProgramContent } from '@/lib/cms';

type BookingRecord = {
  id: string;
  name: string;
  email: string;
  sessionType: string;
  status: string;
  date: string;
  notes?: string | null;
  createdAt: string;
};

type LeadRecord = {
  id: string;
  email: string;
  name?: string | null;
  status: string;
  source?: string | null;
  createdAt: string;
};

type TransactionRecord = {
  id: string;
  stripeSessionId: string;
  email?: string | null;
  amount: number;
  currency: string;
  status: string;
  programSlug?: string | null;
  createdAt: string;
};

type ProgramFormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  badge: string;
  stripeProductId: string;
  stripePriceId: string;
  published: boolean;
  features: string;
};

const emptyProgramForm: ProgramFormState = {
  name: '',
  slug: '',
  description: '',
  price: '',
  badge: '',
  stripeProductId: '',
  stripePriceId: '',
  published: true,
  features: ''
};

function toProgramForm(program: ProgramContent): ProgramFormState {
  return {
    name: program.name,
    slug: program.slug,
    description: program.description,
    price: String(program.price),
    badge: program.badge || '',
    stripeProductId: program.stripeProductId || '',
    stripePriceId: program.stripePriceId || '',
    published: program.published,
    features: program.features.join('\n')
  };
}

export function AdminConsole({
  initialPrograms,
  initialBookings,
  initialLeads,
  initialTransactions
}: {
  initialPrograms: ProgramContent[];
  initialBookings: BookingRecord[];
  initialLeads: LeadRecord[];
  initialTransactions: TransactionRecord[];
}) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [bookings, setBookings] = useState(initialBookings);
  const [leads, setLeads] = useState(initialLeads);
  const [transactions] = useState(initialTransactions);
  const [form, setForm] = useState<ProgramFormState>(emptyProgramForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  async function refreshPrograms() {
    const response = await fetch('/api/admin/programs');
    const data = await response.json();
    if (response.ok) setPrograms(data.programs);
  }

  async function saveProgram() {
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `/api/admin/programs/${editingId}` : '/api/admin/programs';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        features: form.features
      })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error?.formErrors?.[0] || data.error || 'Unable to save program');
    }

    await refreshPrograms();
    setEditingId(null);
    setForm(emptyProgramForm);
  }

  async function deleteProgram(id: string) {
    const response = await fetch(`/api/admin/programs/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Unable to delete program');
    await refreshPrograms();
  }

  async function updateBookingStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Unable to update booking');
    setBookings((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  async function updateLeadStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Unable to update lead');
    setLeads((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  async function removeBooking(id: string) {
    const response = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Unable to delete booking');
    setBookings((current) => current.filter((item) => item.id !== id));
  }

  async function removeLead(id: string) {
    const response = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Unable to delete lead');
    setLeads((current) => current.filter((item) => item.id !== id));
  }

  function runTask(task: () => Promise<void>, successMessage: string) {
    startTransition(async () => {
      try {
        setMessage('');
        await task();
        setMessage(successMessage);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Something went wrong');
      }
    });
  }

  return (
    <div className="mt-10 grid gap-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">CMS Programs</h2>
              <p className="mt-2 text-zinc-300">Edit the Sanity documents that power pricing, features, and live Stripe checkout.</p>
            </div>
            {message ? <p className="text-sm text-brand-200">{message}</p> : null}
          </div>

          <div className="mt-6 grid gap-4">
            {programs.map((program) => (
              <article key={program._id} className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{program.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">/{program.slug}</p>
                    <p className="mt-3 text-sm text-zinc-300">{program.description}</p>
                    <p className="mt-3 text-sm text-zinc-400">
                      Stripe price: {program.stripePriceId || 'Missing'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(program._id);
                        setForm(toProgramForm(program));
                      }}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => runTask(() => deleteProgram(program._id), 'Program deleted')}
                      className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{editingId ? 'Edit Program' : 'New Program'}</h2>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyProgramForm);
                }}
                className="text-sm text-zinc-400"
              >
                Clear
              </button>
            ) : null}
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              runTask(saveProgram, editingId ? 'Program updated' : 'Program created');
            }}
          >
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Program name" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
            <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder="slug" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="min-h-28 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
            <input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="Display price in USD" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
            <input value={form.badge} onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))} placeholder="Badge" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
            <input value={form.stripeProductId} onChange={(event) => setForm((current) => ({ ...current, stripeProductId: event.target.value }))} placeholder="Stripe product ID" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
            <input value={form.stripePriceId} onChange={(event) => setForm((current) => ({ ...current, stripePriceId: event.target.value }))} placeholder="Stripe price ID" className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
            <textarea value={form.features} onChange={(event) => setForm((current) => ({ ...current, features: event.target.value }))} placeholder="One feature per line" className="min-h-28 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3" />
            <label className="flex items-center gap-3 text-sm text-zinc-300">
              <input type="checkbox" checked={form.published} onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))} />
              Published
            </label>
            <button disabled={isPending} className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white">
              {isPending ? 'Saving...' : editingId ? 'Update Program' : 'Create Program'}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Bookings</h2>
          <div className="mt-6 grid gap-4">
            {bookings.map((booking) => (
              <article key={booking.id} className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{booking.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{booking.email}</p>
                    <p className="mt-3 text-sm text-zinc-300">
                      {booking.sessionType} on {new Date(booking.date).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">{booking.notes || 'No notes provided.'}</p>
                  </div>
                  <div className="grid gap-3">
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        runTask(
                          () => updateBookingStatus(booking.id, event.target.value),
                          'Booking updated'
                        )
                      }
                      className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELED">Canceled</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => runTask(() => removeBooking(booking.id), 'Booking deleted')}
                      className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold">Leads</h2>
          <div className="mt-6 grid gap-4">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{lead.name || 'Unnamed lead'}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{lead.email}</p>
                    <p className="mt-3 text-sm text-zinc-300">Source: {lead.source || 'website'}</p>
                  </div>
                  <div className="grid gap-3">
                    <select
                      value={lead.status}
                      onChange={(event) =>
                        runTask(() => updateLeadStatus(lead.id, event.target.value), 'Lead updated')
                      }
                      className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
                    >
                      <option value="NEW">New</option>
                      <option value="NURTURING">Nurturing</option>
                      <option value="CONVERTED">Converted</option>
                      <option value="UNSUBSCRIBED">Unsubscribed</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => runTask(() => removeLead(lead.id), 'Lead deleted')}
                      className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-bold">Stripe Transactions</h2>
        <div className="mt-6 grid gap-4">
          {transactions.map((transaction) => (
            <article key={transaction.id} className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{transaction.email || 'Guest checkout'}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{transaction.stripeSessionId}</p>
                  <p className="mt-3 text-sm text-zinc-300">
                    {(transaction.amount / 100).toLocaleString('en-US', {
                      style: 'currency',
                      currency: transaction.currency.toUpperCase()
                    })}
                  </p>
                </div>
                <div className="text-right text-sm text-zinc-400">
                  <p>{transaction.status}</p>
                  <p className="mt-2">{transaction.programSlug || 'No program metadata'}</p>
                  <p className="mt-2">{new Date(transaction.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
