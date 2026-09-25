'use client';

import React from 'react';
import './ProductSkeleton.css';

interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="product-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product-skeleton-card">
          {/* Image placeholder */}
          <div className="product-skeleton-img shimmer" />
          {/* Title placeholder */}
          <div className="product-skeleton-body">
            <div className="product-skeleton-title shimmer" />
            <div className="product-skeleton-subtitle shimmer" />
            <div className="product-skeleton-badge shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
