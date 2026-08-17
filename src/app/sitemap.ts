import { MetadataRoute } from 'next';
import { mockProducts } from '@/lib/mockData';
import { locales } from '@/i18n/config';

const baseUrl = 'https://sungolden-eg.com';

const pages = [
  '',
  '/about',
  '/products',
  '/why-choose',
  '/process',
  '/certificates',
  '/markets',
  '/contact',
  '/rfq',
  '/tools',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Static Pages for each locale
  locales.forEach((locale) => {
    pages.forEach((page) => {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    });

    // Product detail pages for each locale
    mockProducts.forEach((prod) => {
      routes.push({
        url: `${baseUrl}/${locale}/products/${prod.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  return routes;
}
