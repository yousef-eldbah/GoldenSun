'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '@/types';
import './FullGalleryGrid.css';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  isTall?: boolean;
}

export function FullGalleryGrid({ currentLocale }: { currentLocale: Locale }) {
  // Column 1 (Left)
  const col1: GalleryItem[] = [
    { id: 'c1-1', src: '/assets/GAL-1.jpg', alt: 'Field Harvesting' },
    { id: 'c1-2', src: '/assets/image_111.png', alt: 'Red Onion Harvest Bags' },
    { id: 'c1-3', src: '/assets/photo_6010464546872561786_y_1.jpg', alt: 'Fresh Potatoes' },
    { id: 'c1-4', src: '/assets/GAL7.png', alt: 'Warehouse Stacks' },
  ];

  // Column 2 (Middle - Tall Center Card)
  const col2: GalleryItem[] = [
    { id: 'c2-1', src: '/assets/GAL-2.jpg', alt: 'Spring Onions' },
    { id: 'c2-2', src: '/assets/photo_6010464546872561768_y_1_1.jpg', alt: 'Warehouse Facility', isTall: true },
    { id: 'c2-3', src: '/assets/GAL8.jpg', alt: 'Fresh Garlic Boxes' },
  ];

  // Column 3 (Right)
  const col3: GalleryItem[] = [
    { id: 'c3-1', src: '/assets/GAL4.jpg', alt: 'Sweet Potatoes' },
    { id: 'c3-2', src: '/assets/image_112.png', alt: 'Farmland View' },
    { id: 'c3-3', src: '/assets/photo_6010464546872561748_y_2_2.jpg', alt: 'Green Beans' },
    { id: 'c3-4', src: '/assets/why3.png', alt: 'Golden Sun Farm Sign' },
  ];

  const renderCard = (item: GalleryItem) => (
    <div
      key={item.id}
      className={`full-gallery-item ${item.isTall ? 'full-gallery-item-tall' : 'full-gallery-item-standard'}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="full-gallery-img"
      />
    </div>
  );

  return (
    <section className="full-gallery-section">
      {/* Header */}
      <div className="full-gallery-header">
        <h1 className="full-gallery-title">Our Gallery Image</h1>
        <p className="full-gallery-subtitle">Inside Our Farming Gallery</p>
      </div>

      {/* 3-Column Layout Matching UI */}
      <div className="full-gallery-grid-container">
        <div className="full-gallery-col">{col1.map(renderCard)}</div>
        <div className="full-gallery-col">{col2.map(renderCard)}</div>
        <div className="full-gallery-col">{col3.map(renderCard)}</div>
      </div>
    </section>
  );
}
