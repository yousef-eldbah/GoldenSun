import React from 'react';
import { ContainerCalculator } from '@/components/ContainerCalculator';
import { Locale } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return {
    title: 'Reefer Container Packing Calculator | 20ft & 40ft High Cube Produce Planner',
    description: 'Calculate gross weight, net weight, carton count, and pallet capacity utilization for fresh Egyptian produce export containers.',
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  return (
    <main className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <ContainerCalculator currentLocale={locale} />
      </div>
    </main>
  );
}
