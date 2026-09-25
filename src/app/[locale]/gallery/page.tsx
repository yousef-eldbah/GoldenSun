import React from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Locale } from '@/types';
import { FullGalleryGrid } from '@/components/FullGalleryGrid';
import { ExportCTASection } from '@/components/ExportCTASection';
import './galleryPage.css';

const gallerySeo = {
  en: {
    title: 'Farming & Packing Gallery | Golden Sun Agricultural Operations',
    description: 'Tour Golden Sun fresh produce operations in Egypt: certified farms, field harvesting, modern grading lines, and automated cold chain storage.',
  },
  de: {
    title: 'Bildergalerie Anbau & Verpackung | Golden Sun Agrarexport Ägypten',
    description: 'Einblick in die landwirtschaftlichen Betriebe von Golden Sun: kontrollierte Felder, Ernte, Packstationen und zertifizierte Kühllagerung in Ägypten.',
  },
  es: {
    title: 'Galería de Cultivo y Empaque | Golden Sun Exportación Agrícola',
    description: 'Explore las operaciones de Golden Sun en Egipto: fincas certificadas, cosecha en campo, líneas de empaque y logística de cadena de frío.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  const seo = gallerySeo[locale] || gallerySeo.en;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/gallery`,
      languages: {
        en: 'https://sungolden-eg.com/en/gallery',
        de: 'https://sungolden-eg.com/de/gallery',
        es: 'https://sungolden-eg.com/es/gallery',
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://sungolden-eg.com/${locale}/gallery`,
      type: 'website',
    },
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  return (
    <main className="gallery-page-main">
      {/* Main 3-Column Visual Farming Gallery Matching Design */}
      <FullGalleryGrid currentLocale={locale} />

      {/* Export CTA Section */}
      <ExportCTASection currentLocale={locale} />
    </main>
  );
}
