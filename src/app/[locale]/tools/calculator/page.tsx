import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { ContainerCalculator } from '@/components/ContainerCalculator';
import { Locale, Product } from '@/types';
import { services } from '@/services';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;

  return {
    title: 'Reefer Container Packing Calculator | 20ft & 40ft High Cube Produce Planner',
    description: 'Calculate gross weight, net weight, carton count, and pallet capacity utilization for fresh Egyptian produce export containers.',
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/tools/calculator`,
      languages: {
        en: 'https://sungolden-eg.com/en/tools/calculator',
        de: 'https://sungolden-eg.com/de/tools/calculator',
        es: 'https://sungolden-eg.com/es/tools/calculator',
        'x-default': 'https://sungolden-eg.com/en/tools/calculator',
      },
    },
    openGraph: {
      title: 'Reefer Container Packing Calculator | Golden Sun Export',
      description: 'Optimize freight packing and payload for 40ft and 20ft refrigerated shipping containers.',
      url: `https://sungolden-eg.com/${locale}/tools/calculator`,
      siteName: 'Golden Sun Agricultural Export',
      type: 'website',
    },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  let products: Product[] = [];
  try {
    products = await services.productRepository.getAll();
  } catch (err) {
    console.warn('[calculator] Failed to fetch products repository, falling back to defaults:', err);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <ContainerCalculator currentLocale={locale} initialProducts={products} />
      </div>
    </main>
  );
}
