'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import { Locale } from '@/types';
import './GallerySection.css';

interface GallerySectionProps {
  currentLocale: Locale;
}

export function GallerySection({ currentLocale }: GallerySectionProps) {
  const t = useTranslations('gallery');

  const galleryItems = [
    {
      id: 'gal-1',
      src: '/assets/GAL-1.jpg',
      alt: 'Field Harvesting',
      sub: t('item_1_sub'),
      title: t('item_1_title'),
    },
    {
      id: 'gal-2',
      src: '/assets/GAL-2.jpg',
      alt: 'Fresh Spring Onions',
      sub: t('item_2_sub'),
      title: t('item_2_title'),
    },
    {
      id: 'gal-3',
      src: '/assets/photo_6010464546872561786_y_1.jpg',
      alt: 'Fresh Potatoes',
      sub: t('item_3_sub'),
      title: t('item_3_title'),
    },
    {
      id: 'gal-4',
      src: '/assets/GAL5.jpg',
      alt: 'Sweet Potatoes Box Packaging',
      sub: t('item_4_sub'),
      title: t('item_4_title'),
    },
  ];

  return (
    <section className="gallery-section-wrapper" id="farming-gallery">
      <div className="gallery-container">
        
        {/* 1. Top Section Badge */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div className="sg-section-badge">
            <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
            <span>{t('badge')}</span>
          </div>
        </div>

        {/* 2. Topographic Green Forest Banner */}
        <div className="gallery-banner-card">
          <div className="gallery-banner-topo" />
          
          <div className="gallery-banner-header">
            <h2 className="gallery-banner-title">
              {t('title')}
            </h2>
            <Link
              href={`/${currentLocale}/gallery`}
              className="gallery-see-more-btn"
              aria-label="Explore Full Produce and Farm Gallery"
            >
              <span>{t('see_more')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 3. Overlapping 4 Gallery Cards - Clicking direct to /gallery */}
        <div className="gallery-cards-grid">
          {galleryItems.map((item) => (
            <Link
              key={item.id}
              href={`/${currentLocale}/gallery`}
              className="gallery-card group"
            >
              <div className="gallery-card-img-box">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="gallery-card-img"
                />

                {/* Subtle Floating Bottom Card on Hover */}
                <div className="gallery-card-floating-badge">
                  <span className="gallery-card-sub">{item.sub}</span>
                  <strong className="gallery-card-title">{item.title}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
