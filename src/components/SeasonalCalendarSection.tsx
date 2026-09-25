'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import { MONTH_NAMES, seasonalProducts, SeasonalProduct, MonthInfo } from '@/lib/seasonalCalendarData';
import './SeasonalCalendarSection.css';

import { Product } from '@/types';

interface SeasonalCalendarSectionProps {
  currentLocale: Locale;
  initialProducts?: Product[];
}

export function SeasonalCalendarSection({ currentLocale }: SeasonalCalendarSectionProps) {
  const currentMonthId = new Date().getMonth() + 1;

  const fruits = seasonalProducts.filter((p: SeasonalProduct) => p.category === 'fruit');
  const vegetables = seasonalProducts.filter((p: SeasonalProduct) => p.category === 'vegetable');

  const renderProductRow = (product: SeasonalProduct) => {
    const name = product.name[currentLocale] || product.name.en;

    return (
      <div key={product.id} className="sg-dot-row">
        {/* Sticky Product Name Column */}
        <div className="sg-dot-prod-cell">
          <Link
            href={`/${currentLocale}/products#${product.slug}`}
            className="sg-dot-prod-name"
            title={`View ${name} Specifications`}
          >
            {name}
          </Link>
        </div>

        {/* 12 Month Dot Columns */}
        {MONTH_NAMES.map((m: MonthInfo) => {
          const isAvailable = product.availableMonths.includes(m.id);
          const isCurrent = m.id === currentMonthId;

          return (
            <div
              key={m.id}
              className={`sg-dot-cell ${isCurrent ? 'is-current-col' : ''}`}
              title={`${name} — ${m.full[currentLocale] || m.full.en}: ${isAvailable ? 'Available' : 'Off Season'}`}
            >
              {isAvailable ? (
                <span className="sg-active-dot" />
              ) : (
                <span className="sg-off-dot" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="sg-dot-section" id="seasonal-calendar">
      <div className="sg-dot-container">
        
        {/* Unified Section Header (Matches exact font & style of all home sections) */}
        <div className="sg-section-header">
          <div className="sg-section-badge">
            <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
            <span>Crop Availability</span>
          </div>

          <h2 className="sg-section-title">
            <span className="sg-section-title-dark">Seasonal </span>
            <span className="sg-section-title-green">Calendar</span>
          </h2>

          <p className="sg-section-subtitle">
            What's available, month by month — A quick look at which fruits and vegetables from Golden Sun farms are in season across the year.
          </p>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sg-mobile-swipe-hint" aria-hidden="true">
          <span className="sg-swipe-icon">↔</span>
          <span>
            {currentLocale === 'de'
              ? 'Tabelle wischen für alle 12 Monate'
              : currentLocale === 'es'
              ? 'Desliza horizontalmente para ver los 12 meses'
              : 'Swipe horizontally to view all 12 months'}
          </span>
        </div>

        {/* Dot Matrix Card */}
        <div className="sg-dot-matrix-box">
          <div className="sg-dot-scroll-wrap">
            
            {/* Header Row */}
            <div className="sg-dot-header-row">
              <div className="sg-dot-col-title">Produce</div>
              {MONTH_NAMES.map((m: MonthInfo) => {
                const isCurrent = m.id === currentMonthId;
                return (
                  <div
                    key={m.id}
                    className={`sg-dot-month-head ${isCurrent ? 'is-current-head' : ''}`}
                  >
                    {m.short[currentLocale] || m.short.en}
                  </div>
                );
              })}
            </div>

            {/* FRUITS GROUP */}
            <div className="sg-dot-group-label">
              <span>🍊</span>
              <span>FRUITS</span>
            </div>
            {fruits.map(renderProductRow)}

            {/* VEGETABLES GROUP */}
            <div className="sg-dot-group-label mt-3">
              <span>🥕</span>
              <span>VEGETABLES</span>
            </div>
            {vegetables.map(renderProductRow)}

          </div>
        </div>

        {/* Footer */}
        <footer className="sg-dot-footer">
          <p className="sg-dot-disclaimer">
            <Info className="w-3.5 h-3.5 text-[#228731] flex-shrink-0" />
            <span>
              Seasonal availability is indicative and may vary depending on harvest conditions and export schedules.
            </span>
          </p>

          <div className="sg-dot-cta">
            <span className="text-xs font-bold text-[#1a1917]">Need a specific product?</span>
            <Link href={`/${currentLocale}/rfq`} className="sg-dot-cta-btn">
              <span>Request Availability</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </footer>

      </div>
    </section>
  );
}
