import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // ─── Image Optimization ───────────────────────────────────────────────────
  images: {
    // Cloudflare Workers runtime compatibility
    unoptimized: true,
    // Use modern AVIF/WebP formats for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Minimise layout shift with explicit dimension hints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    // Cache optimised images longer (10 days)
    minimumCacheTTL: 864000,
  },

  // ─── Compiler Optimisations ───────────────────────────────────────────────
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ─── Bundle Size ──────────────────────────────────────────────────────────
  experimental: {
    // Optimise package imports to reduce bundle size (only import what we use)
    optimizePackageImports: ['lucide-react'],
  },

  // ─── HTTP Headers (Caching + Security) ───────────────────────────────────
  async headers() {
    return [
      {
        // Cache all static SVGs from /assets/ for 1 year
        source: '/assets/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache all other public assets for 7 days (no capturing groups allowed)
        source: '/:path*.(png|jpg|jpeg|gif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Security headers on all pages
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // ─── Trailing Slash Normalisation ─────────────────────────────────────────
  trailingSlash: false,

  // ─── Powered-by header (remove for security) ──────────────────────────────
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
