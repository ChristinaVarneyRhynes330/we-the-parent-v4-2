'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="bg-warm-ivory text-charcoal-navy p-8">
        <h2 className="text-2xl font-header mb-4">Something went wrong</h2>
        <p className="mb-4">{error.message}</p>
        <button onClick={reset} className="button-primary">
          Try again
        </button>
      </body>
    </html>
  );
}