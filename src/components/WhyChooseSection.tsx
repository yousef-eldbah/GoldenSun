'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import './WhyChooseSection.css';

export function WhyChooseSection({ currentLocale }: { currentLocale: Locale }) {
  const tWhy = useTranslations('why_choose');

  return (
    <section id="why-choose-us" className="why-sec-home">
      <div className="why-sec-container">
        {/* Top Header */}
        <div className="sg-section-header">
          <div className="sg-section-badge">
            <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
            <span>{tWhy('badge')}</span>
          </div>

          <h2 className="sg-section-title">
            <span className="sg-section-title-dark">{tWhy('title_part1')}</span>
            <span className="sg-section-title-green">{tWhy('title_part2')}</span>
          </h2>
          <p className="sg-section-subtitle">
            {tWhy('banner_text')}
          </p>
        </div>

        {/* 3 Quick Preview Cards */}
        <div className="why-sec-cards-grid">
          {/* Card 1 */}
          <div className="why-sec-card">
            <div className="why-sec-card-img-wrap">
              <Image
                src="/assets/why1.png"
                alt={tWhy('item1_title')}
                width={380}
                height={260}
                className="why-sec-card-img"
              />
              <span className="why-sec-card-number">01</span>
            </div>
            <div className="why-sec-card-body">
              <h3 className="why-sec-card-title">{tWhy('item1_title')}</h3>
              <p className="why-sec-card-desc">{tWhy('item1_desc')}</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="why-sec-card">
            <div className="why-sec-card-img-wrap">
              <Image
                src="/assets/ss.png"
                alt={tWhy('item2_title')}
                width={380}
                height={260}
                className="why-sec-card-img"
                unoptimized
              />
              <span className="why-sec-card-number">02</span>
            </div>
            <div className="why-sec-card-body">
              <h3 className="why-sec-card-title">{tWhy('item2_title')}</h3>
              <p className="why-sec-card-desc">{tWhy('item2_desc')}</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="why-sec-card">
            <div className="why-sec-card-img-wrap">
              <Image
                src="/assets/why3.png"
                alt={tWhy('item3_title')}
                width={380}
                height={260}
                className="why-sec-card-img"
              />
              <span className="why-sec-card-number">03</span>
            </div>
            <div className="why-sec-card-body">
              <h3 className="why-sec-card-title">{tWhy('item3_title')}</h3>
              <p className="why-sec-card-desc">{tWhy('item3_desc')}</p>
            </div>
          </div>
        </div>

        {/* CTA Button to Full Page */}
        <div className="why-sec-footer-cta">
          <Link href={`/${currentLocale}/why-choose`} className="why-sec-btn">
            <span>Explore All Advantages & Certificates</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
