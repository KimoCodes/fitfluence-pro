'use client';

import { useState } from 'react';

export function CheckoutButton({
  slug,
  label = 'Buy Now',
  className = ''
}: {
  slug: string;
  label?: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckout() {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Unable to start checkout');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? 'Redirecting...' : label}
      </button>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
