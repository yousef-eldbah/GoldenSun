import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Locale } from '@/types';
import { RFQForm } from '@/components/RFQForm';
import { services } from '@/services';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  return {
    title: 'Request a Quote | Sun Golden Egyptian Produce Export',
    description: 'Fill in your commercial details and produce requirements to receive an official Proforma Invoice within 24 hours.',
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/rfq`,
      languages: {
        en: 'https://sungolden-eg.com/en/rfq',
        de: 'https://sungolden-eg.com/de/rfq',
        es: 'https://sungolden-eg.com/es/rfq',
        'x-default': 'https://sungolden-eg.com/en/rfq',
      },
    },
    openGraph: {
      title: 'Request a Quote | Golden Sun Export',
      description: 'Submit your commercial requirements for fresh Egyptian produce and receive an official quotation.',
      url: `https://sungolden-eg.com/${locale}/rfq`,
      siteName: 'Golden Sun Agricultural Export',
      type: 'website',
    },
  };
}

export default async function RFQPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  const products = await services.productRepository.getAll();

  return (
    <main className="min-h-screen bg-[#fafdfa]">
      <RFQForm currentLocale={locale} initialProducts={products} />
    </main>
  );
}
