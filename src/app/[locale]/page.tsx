import React from 'react';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { WhyChooseSection } from '@/components/WhyChooseSection';
import { ProductCatalog } from '@/components/ProductCatalog';
import { SeasonalCalendarSection } from '@/components/SeasonalCalendarSection';
import { ExportMarketsMap } from '@/components/ExportMarketsMap';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CertificatesSlider } from '@/components/CertificatesSlider';
import { GallerySection } from '@/components/GallerySection';
import { ContactSection } from '@/components/ContactSection';
import { setRequestLocale } from 'next-intl/server';
import { Locale, Product } from '@/types';
import { services } from '@/services';

const seoByLocale = {
  en: {
    title: 'Golden Sun | Premium Egyptian Agricultural Produce Exporter',
    description: 'Direct Egyptian agricultural exporter of fresh Valencia oranges, IQF strawberries, pomegranates, garlic & frozen vegetables. Global cold chain shipping to EU, UK & Middle East ports.',
  },
  de: {
    title: 'Golden Sun | Ägyptischer Exporteur von frischem Obst & Gemüse',
    description: 'B2B-Exporteur für ägyptische Valencia-Orangen, IQF-Erdbeeren, Granatäpfel, Knoblauch und Tiefkühlgemüse. Zertifizierte Kühlketten-Lieferung nach Deutschland und in die EU.',
  },
  es: {
    title: 'Golden Sun | Exportador de Frutas y Verduras Frescas de Egipto',
    description: 'Plataforma B2B de exportación de naranjas Valencia, fresas IQF, granadas, ajo fresco y verduras congeladas. Envíos globales a puertos de la UE y América.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'en';
  const seo = seoByLocale[locale] || seoByLocale.en;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}`,
      languages: {
        en: 'https://sungolden-eg.com/en',
        de: 'https://sungolden-eg.com/de',
        es: 'https://sungolden-eg.com/es',
        'x-default': 'https://sungolden-eg.com/en',
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://sungolden-eg.com/${locale}`,
      siteName: 'Golden Sun Agricultural Export',
      locale: locale === 'de' ? 'de_DE' : locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  let products: Product[] = [];
  try {
    products = await services.productRepository.getAll();
  } catch (err) {
    console.warn('[homepage] Failed to load products repository:', err);
  }

  return (
    <main className="bg-[var(--sg-white)]">
      {/* 1. Hero Section */}
      <Hero currentLocale={locale} />

      {/* 2. About Us Section */}
      <AboutSection currentLocale={locale} />

      {/* 3. Why Choose Us Preview Section */}
      <WhyChooseSection currentLocale={locale} />

      {/* 4. Product Catalog Section */}
      <ProductCatalog currentLocale={locale} initialProducts={products} />

      {/* 5. Seasonal Calendar Dot Matrix Section */}
      <SeasonalCalendarSection currentLocale={locale} initialProducts={products} />

      {/* 5. Where Golden Sun Exports Section */}
      <ExportMarketsMap currentLocale={locale} />

      {/* 6. Certificates & Accreditations Infinite Marquee Slider */}
      <CertificatesSlider currentLocale={locale} />

      {/* 7. Inside Our Farming Gallery Section */}
      <GallerySection currentLocale={locale} />

      {/* 8. Testimonials & Customer Feedback Section */}
      <TestimonialsSection currentLocale={locale} />

      {/* 9. Contact Us Section */}
      <ContactSection currentLocale={locale} />
    </main>
  );
}
