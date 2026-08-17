import React from 'react';
import { Locale } from '@/types';
import { ProcessSection } from '@/components/ProcessSection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  return {
    title: 'Our Export Process | From Farm To Your Door - Sun Golden Export',
    description: 'Every shipment moves through 8 carefully controlled stages built to protect freshness and quality at each step.',
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/process`,
    },
  };
}

export default async function ProcessPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  return (
    <main className="min-h-screen bg-white">
      <ProcessSection currentLocale={locale} />
    </main>
  );
}
