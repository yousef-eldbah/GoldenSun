import React from 'react';
import { ContactSection } from '@/components/ContactSection';
import { setRequestLocale } from 'next-intl/server';
import { Locale } from '@/types';

const contactSeo = {
  en: {
    title: 'Contact Us | Golden Sun Agricultural Export Sales Team',
    description: 'Get in touch with Golden Sun export team for fresh produce inquiries, container quotation, and logistics schedules.',
  },
  de: {
    title: 'Kontakt | Golden Sun Agrarexport Ägypten - Vertriebsteam',
    description: 'Kontaktieren Sie das Golden Sun Exportteam für Anfragen zu frischem Obst & Gemüse, Containerpreisen und Lieferzeiten.',
  },
  es: {
    title: 'Contacto | Golden Sun Equipo de Ventas de Exportación Agrícola',
    description: 'Póngase en contacto con el equipo de Golden Sun para consultas sobre exportación de frutas y verduras frescas y cotizaciones de contenedores.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'en';
  const seo = contactSeo[locale] || contactSeo.en;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/contact`,
      languages: {
        en: 'https://sungolden-eg.com/en/contact',
        de: 'https://sungolden-eg.com/de/contact',
        es: 'https://sungolden-eg.com/es/contact',
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://sungolden-eg.com/${locale}/contact`,
      type: 'website',
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Golden Sun Export Contact Portal',
    description: 'Direct communication channel for international produce importers and supermarket procurement managers.',
    url: `https://sungolden-eg.com/${locale}/contact`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <main className="bg-white pt-6 min-h-screen">
        <ContactSection currentLocale={locale} />
      </main>
    </>
  );
}
