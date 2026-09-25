import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Locale } from '@/types';
import { ProductCatalog } from '@/components/ProductCatalog';

const productSeo = {
  en: {
    title: 'Export Produce Catalog | Fresh Egyptian Citrus, Berries & Vegetables',
    description: 'Explore Golden Sun export catalog: Valencia Oranges, IQF Strawberries, Pomegranates, Fresh Garlic, Broccoli, Sweet Potatoes and Frozen Vegetables.',
  },
  de: {
    title: 'Produktkatalog Agrarexport | Frische Zitrusfrüchte & Gemüse aus Ägypten',
    description: 'Entdecken Sie den Golden Sun Exportkatalog: Valencia-Orangen, IQF-Erdbeeren, Granatäpfel, frischer Knoblauch, Brokkoli, Süßkartoffeln und Tiefkühlgemüse.',
  },
  es: {
    title: 'Catálogo de Productos de Exportación | Cítricos y Verduras de Egipto',
    description: 'Explore el catálogo de exportación de Golden Sun: Naranjas Valencia, Fresas IQF, Granadas, Ajo Fresco, Brócoli, Batatas y Verduras Congeladas.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'en';
  const seo = productSeo[locale] || productSeo.en;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/products`,
      languages: {
        en: 'https://sungolden-eg.com/en/products',
        de: 'https://sungolden-eg.com/de/products',
        es: 'https://sungolden-eg.com/es/products',
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://sungolden-eg.com/${locale}/products`,
      type: 'website',
    },
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Golden Sun Agricultural Export Catalog',
    description: 'Export-grade certified fresh fruits and frozen vegetables harvested from Egyptian farms.',
    url: `https://sungolden-eg.com/${locale}/products`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <main className="min-h-screen bg-[#fafdfa]">
        <ProductCatalog currentLocale={locale} />
      </main>
    </>
  );
}
