'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Locale } from '@/types';
import './Hero.css';

export function Hero({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('hero');

  return (
    <section className="hero-section">
      {/* Background Graphic for Desktop */}
      <div className="hero-bg-wrapper hidden md:block">
        <Image
          src="/assets/banner-1.svg"
          alt="Golden Sun Fresh Produce"
          fill
          priority
          sizes="(min-width: 768px) 100vw, 1px"
          className="hero-bg-image"
        />
      </div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Main Headline */}
          <h1 className="hero-title">
            <span className="hero-title-dark">{t('title_prefix')} </span>
            <br />
            <span className="hero-title-green">{t('title_highlight')}</span>
            <br />
            <span className="hero-title-dark hero-title-sub">
              {t('title_sub')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            <strong className="hero-subtitle-brand">{t('subtitle_brand')}</strong>{' '}
            {t('subtitle_text')}
          </p>

          {/* CTA Buttons */}
          <div className="hero-ctas">
            <Link href={`/${currentLocale}/products`} className="hero-btn-quote">
              <span className="hero-btn-desktop-text">{t('cta_quote')}</span>
              <span className="hero-btn-mobile-text">{t('cta_shopping')}</span>
            </Link>
            <Link href={`/${currentLocale}#contact`} className="hero-btn-contact">
              {t('cta_contact')}
            </Link>
          </div>

          {/* Stats Bar (Desktop) */}
          <div className="hero-stats-bar">
            <div className="hero-stat-item">
              <span className="hero-stat-num">{t('stat_products_num')}</span>
              <div className="hero-stat-label">
                <span>{t('stat_products_label1')}</span>
                <span>{t('stat_products_label2')}</span>
              </div>
            </div>

            <div className="hero-stat-divider" />

            <div className="hero-stat-item">
              <span className="hero-stat-num">{t('stat_customers_num')}</span>
              <div className="hero-stat-label">
                <span>{t('stat_customers_label1')}</span>
                <span>{t('stat_customers_label2')}</span>
              </div>
            </div>

            <div className="hero-stat-divider" />

            <div className="hero-stat-item">
              <span className="hero-stat-num">{t('stat_countries_num')}</span>
              <div className="hero-stat-label">
                <span>{t('stat_countries_label1')}</span>
                <span>{t('stat_countries_label2')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Produce Image Arc (Takes full screen width with 0 side gaps) */}
      <div className="hero-mobile-img-wrapper">
        <Image
          src="/assets/hero-m.svg"
          alt="Fresh Egyptian Produce"
          width={402}
          height={289}
          priority
          unoptimized
          className="hero-mobile-img"
        />
      </div>
    </section>
  );
}
