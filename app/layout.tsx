import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://fitfluencepro.com'),
  title: 'Fitfluence Pro | Fitness Funnel & Client Portal',
  description: 'A high-converting Next.js fitness platform for programs, coaching, bookings, payments, and client access.',
  openGraph: {
    title: 'Fitfluence Pro',
    description: 'Fitness funnel + coaching platform built for conversion.',
    url: 'https://fitfluencepro.com',
    siteName: 'Fitfluence Pro',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
