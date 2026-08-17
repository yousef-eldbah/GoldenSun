import React from 'react';
import { ExportMarketsMap } from '@/components/ExportMarketsMap';
import { Locale } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  return {
    title: 'Our Export Markets | Where Golden Sun Exports',
    description: 'Golden Sun exports fresh Egyptian agricultural produce to the Netherlands, United Kingdom, Spain, Italy, Germany, Russia, Turkey, and Saudi Arabia.',
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/markets`,
    },
  };
}

export default async function MarketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  return (
    <main className="bg-white pt-6 min-h-screen">
      <ExportMarketsMap currentLocale={locale} />
    </main>
  );
}
