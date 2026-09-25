import React from 'react';
import { Vidaloka, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import type { Metadata, Viewport } from 'next';

import { getLocale } from 'next-intl/server';

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
  metadataBase: new URL('https://goldensun-eg.com'),
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
  alternates: {
    languages: {
      en: 'https://goldensun-eg.com/en',
      de: 'https://goldensun-eg.com/de',
      es: 'https://goldensun-eg.com/es',
      'x-default': 'https://goldensun-eg.com/en',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/icon.png',
  },
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
    url: 'https://goldensun-eg.com',
    siteName: 'Golden Sun Egypt',
    title: 'Golden Sun | Premium Egyptian Agricultural Exporter',
    description:
      'Direct Egyptian agricultural exporter of fresh Valencia oranges, IQF strawberries, pomegranates, garlic, and frozen vegetables to EU, US, and Global markets.',
    images: [
      {
        url: '/assets/Frame 160.svg',
        width: 285,
        height: 79,
        alt: 'Golden Sun',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golden Sun | Premium Egyptian Agricultural Exporter',
    description:
      'Direct Egyptian agricultural exporter of fresh Valencia oranges, IQF strawberries, pomegranates, garlic, and frozen vegetables to EU, US, and Global markets.',
    images: ['/assets/Frame 160.svg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://goldensun-eg.com/#organization',
      name: 'Golden Sun',
      url: 'https://goldensun-eg.com',
      logo: 'https://goldensun-eg.com/assets/Frame%20160.svg',
      description: 'Premium Egyptian Agricultural Exporter of fresh and IQF produce worldwide.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'EG',
        addressLocality: 'Cairo',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Sales & Export',
        availableLanguage: ['English', 'German', 'Spanish'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://goldensun-eg.com/#website',
      url: 'https://goldensun-eg.com',
      name: 'Golden Sun Export',
      publisher: {
        '@id': 'https://goldensun-eg.com/#organization',
      },
      inLanguage: ['en', 'de', 'es'],
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale || 'en'}
      data-scroll-behavior="smooth"
      className={`scroll-smooth ${vidaloka.variable} ${sourceSans.variable}`}
    >
      <head>
        {/* DNS Prefetch and Preconnect for fast external resources */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="//vuhzhsffbajtvmhxbicu.supabase.co" />
        <link rel="preconnect" href="https://vuhzhsffbajtvmhxbicu.supabase.co" crossOrigin="anonymous" />
        {/* Favicon & App Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[var(--sg-white)] text-[var(--sg-charcoal)] font-sans antialiased selection:bg-[var(--sg-gold)] selection:text-white min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
