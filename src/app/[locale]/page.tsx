import React from 'react';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { WhyChooseSection } from '@/components/WhyChooseSection';
import { ProductCatalog } from '@/components/ProductCatalog';
import { ExportMarketsMap } from '@/components/ExportMarketsMap';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CertificatesSlider } from '@/components/CertificatesSlider';
import { ContactSection } from '@/components/ContactSection';
import { Locale } from '@/types';

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
  const locale = resolvedParams.locale as Locale;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    name: 'Golden Sun for Agricultural Export & Development',
    alternateName: 'Golden Sun Egypt',
    url: 'https://sungolden-eg.com',
    logo: 'https://sungolden-eg.com/assets/Frame%20160.svg',
    description: 'Leading Egyptian agricultural produce exporter supplying fresh fruits, Valencia oranges, IQF strawberries, garlic and vegetables to global ports.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kasab Pedestrian Village, Badreshin Center',
      addressLocality: 'Giza',
      addressCountry: 'EG',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+20-128-775-5522',
        contactType: 'sales',
        areaServed: ['EU', 'GB', 'DE', 'ES', 'NL', 'SA', 'RU', 'US'],
        availableLanguage: ['English', 'German', 'Spanish', 'Arabic'],
      },
    ],
    areaServed: [
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Netherlands' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'Saudi Arabia' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <main className="bg-[var(--sg-white)]">
        {/* 1. Hero Section */}
        <Hero currentLocale={locale} />

        {/* 2. About Us Section */}
        <AboutSection currentLocale={locale} />

        {/* 3. Why Choose Us Preview Section */}
        <WhyChooseSection currentLocale={locale} />

        {/* 4. Product Catalog Section */}
        <ProductCatalog currentLocale={locale} />

        {/* 5. Where Golden Sun Exports Section */}
        <ExportMarketsMap currentLocale={locale} />

        {/* 6. Certificates & Accreditations Infinite Marquee Slider */}
        <CertificatesSlider currentLocale={locale} />

        {/* 7. Testimonials & Customer Feedback Section */}
        <TestimonialsSection currentLocale={locale} />

        {/* 8. Contact Us Section */}
        <ContactSection currentLocale={locale} />
      </main>
    </>
  );
}
