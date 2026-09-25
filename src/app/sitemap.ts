import { MetadataRoute } from 'next';
import { services } from '@/services';
import { locales } from '@/i18n/config';

const baseUrl = 'https://goldensun-eg.com';

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
  '/gallery',
  '/tools/calculator',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  // Fetch actual products from repository (live database or mock fallback)
  let liveProducts: any[] = [];
  try {
    liveProducts = await services.productRepository.getAll();
  } catch (err) {
    console.error('Failed to load products for sitemap:', err);
  }

  // Generate routes for each supported locale
  locales.forEach((locale) => {
    pages.forEach((page) => {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    });

    // Dynamic Product detail pages
    liveProducts.forEach((prod) => {
      routes.push({
        url: `${baseUrl}/${locale}/products/${prod.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  return routes;
}
