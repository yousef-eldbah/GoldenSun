import React from 'react';
import { notFound } from 'next/navigation';
import { services } from '@/services';
import { Locale } from '@/types';
import { ProductDetailView } from '@/components/ProductDetailView';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const product = await services.productRepository.getBySlug(resolvedParams.slug);
  if (!product) return { title: 'Product Not Found | Sun Golden Export' };
  const translation = product.translations[resolvedParams.locale as Locale] || product.translations.en;
  return {
    title: `${translation.name} | Premium Egyptian Produce Exporter - Sun Golden`,
    description: `${translation.description} Origin: ${translation.origin || 'Egypt'}.`,
    alternates: {
      canonical: `https://sungolden-eg.com/${resolvedParams.locale}/products/${product.slug}`,
      languages: {
        en: `https://sungolden-eg.com/en/products/${product.slug}`,
        de: `https://sungolden-eg.com/de/products/${product.slug}`,
        es: `https://sungolden-eg.com/es/products/${product.slug}`,
      },
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const product = await services.productRepository.getBySlug(resolvedParams.slug);

  if (!product) notFound();

  const translation = product.translations[locale] || product.translations.en;
  const imageUrls = product.images.map((img) => typeof img === 'string' ? img : img.image_url);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: translation.name,
    image: imageUrls,
    description: translation.description,
    category: product.category_id,
    brand: { '@type': 'Brand', name: 'Sun Golden Export' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Sun Golden for Export & Agricultural Development' },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailView product={product} currentLocale={locale} />
    </>
  );
}
