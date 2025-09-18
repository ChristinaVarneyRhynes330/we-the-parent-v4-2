'use client';

export default function NotFound() {
  return (
    <html>
      <body className="bg-warm-ivory text-charcoal-navy p-8">
        <h2 className="text-2xl font-header mb-4">Page Not Found</h2>
        <p className="mb-4">We couldn’t find the page you were looking for.</p>
        <a href="/" className="button-secondary">Go Home</a>
      </body>
    </html>
  );
}