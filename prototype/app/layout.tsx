import type { Metadata } from 'next';
import { GrainLayer } from '@/components/GrainLayer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'https://lori-found-memo.alex-markin.chatgpt.site'),
  title: 'Lost and Found: Lori, Armenia',
  description: 'A prototype digital museum of objects and participant projects from Lori, Armenia.',
  openGraph: {
    title: 'Lost and Found: Lori, Armenia',
    description: 'Objects and stories from the “person in history” summer school',
    images: [{ url: '/og.png', width: 1729, height: 910, alt: 'Lost and Found: Lori, Armenia — found-object illustrations on warm paper' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lost and Found: Lori, Armenia',
    description: 'Objects and stories from the “person in history” summer school',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GrainLayer />
        {children}
      </body>
    </html>
  );
}
