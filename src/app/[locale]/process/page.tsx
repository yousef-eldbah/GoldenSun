import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Locale } from '@/types';
import { ProcessSection } from '@/components/ProcessSection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  return {
    title: 'Our Export Process | From Farm To Your Door - Sun Golden Export',
    description: 'Every shipment moves through 8 carefully controlled stages built to protect freshness and quality at each step.',
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/process`,
      languages: {
        en: 'https://sungolden-eg.com/en/process',
        de: 'https://sungolden-eg.com/de/process',
        es: 'https://sungolden-eg.com/es/process',
        'x-default': 'https://sungolden-eg.com/en/process',
      },
    },
    openGraph: {
      title: 'Our Export Process | Golden Sun Agricultural Export',
      description: 'Controlled cold chain and 8-stage export quality workflow from Egyptian farms to global ports.',
      url: `https://sungolden-eg.com/${locale}/process`,
      siteName: 'Golden Sun Agricultural Export',
      type: 'website',
    },
  };
}

export default async function ProcessPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-white">
      <ProcessSection currentLocale={locale} />
    </main>
  );
}
