import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found" id="main">
      <p className="eyebrow">Lori, Found · 404</p>
      <h1>This object or project was not found.</h1>
      <Link href="/en">← Back to collection</Link>
    </main>
  );
}
