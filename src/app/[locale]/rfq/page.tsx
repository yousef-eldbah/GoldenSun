import React from 'react';
import { Locale } from '@/types';
import { RFQForm } from '@/components/RFQForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  return {
    title: 'Request a Quote | Sun Golden Egyptian Produce Export',
    description: 'Fill in your commercial details and produce requirements to receive an official Proforma Invoice within 24 hours.',
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/rfq`,
    },
  };
}

export default async function RFQPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  return (
    <main className="min-h-screen bg-[#fafdfa]">
      <RFQForm currentLocale={locale} />
    </main>
  );
}
