import type { Metadata } from 'next';
import { GrainLayer } from '@/components/GrainLayer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  title: 'Lori, Found — MEMO summer school museum',
  description: 'A prototype digital museum of objects and participant projects from Lori, Armenia.',
  openGraph: {
    title: 'Lori, Found',
    description: 'Objects and stories from MEMO’s summer school',
    images: [{ url: '/og.png', width: 1729, height: 910, alt: 'Lori, Found — found-object illustrations on warm paper' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lori, Found',
    description: 'Objects and stories from MEMO’s summer school',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GrainLayer />
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
