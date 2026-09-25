import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { ExportMarketsMap } from '@/components/ExportMarketsMap';
import { Locale } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  return {
    title: 'Our Export Markets | Where Golden Sun Exports',
    description: 'Golden Sun exports fresh Egyptian agricultural produce to the Netherlands, United Kingdom, Spain, Italy, Germany, Russia, Turkey, and Saudi Arabia.',
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/markets`,
      languages: {
        en: 'https://sungolden-eg.com/en/markets',
        de: 'https://sungolden-eg.com/de/markets',
        es: 'https://sungolden-eg.com/es/markets',
        'x-default': 'https://sungolden-eg.com/en/markets',
      },
    },
    openGraph: {
      title: 'Our Export Markets | Golden Sun Agricultural Export',
      description: 'Global trade routes and direct maritime shipments connecting Egyptian farms to European and Middle Eastern ports.',
      url: `https://sungolden-eg.com/${locale}/markets`,
      siteName: 'Golden Sun Agricultural Export',
      type: 'website',
    },
  };
}

export default async function MarketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  return (
    <main className="bg-white pt-6 min-h-screen">
      <ExportMarketsMap currentLocale={locale} />
    </main>
  );
}
