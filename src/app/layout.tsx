import React from 'react';
import { Vidaloka, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import type { Metadata, Viewport } from 'next';

const vidaloka = Vidaloka({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vidaloka',
  display: 'swap',   // Prevent invisible text during font load
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#23903F',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sungolden-eg.com'),
  title: {
    default: 'Golden Sun | Premium Egyptian Agricultural Exporter',
    template: '%s | Golden Sun',
  },
  description:
    'Direct Egyptian agricultural exporter of fresh Valencia oranges, IQF strawberries, pomegranates, garlic, and frozen vegetables to EU, US, and Global markets.',
  keywords: [
    'Egyptian produce exporter',
    'fresh Valencia oranges Egypt',
    'IQF strawberries Egypt',
    'pomegranates export Egypt',
    'garlic export Egypt',
    'agricultural export Egypt',
    'Golden Sun Egypt',
    'B2B fresh produce',
    'Egyptian vegetables exporter',
  ],
  authors: [{ name: 'Golden Sun Egypt' }],
  creator: 'Golden Sun Egypt',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sungolden-eg.com',
    siteName: 'Golden Sun Egypt',
    title: 'Golden Sun | Premium Egyptian Agricultural Exporter',
    description:
      'Direct Egyptian agricultural exporter of fresh Valencia oranges, IQF strawberries, pomegranates, garlic, and frozen vegetables to EU, US, and Global markets.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golden Sun | Premium Egyptian Agricultural Exporter',
    description:
      'Direct Egyptian agricultural exporter of fresh Valencia oranges, IQF strawberries, pomegranates, garlic, and frozen vegetables to EU, US, and Global markets.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`scroll-smooth ${vidaloka.variable} ${sourceSans.variable}`}
    >
      <head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-[var(--sg-white)] text-[var(--sg-charcoal)] font-sans antialiased selection:bg-[var(--sg-gold)] selection:text-white min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
