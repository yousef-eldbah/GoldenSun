'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import './AboutSection.css';

export function AboutSection({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('about_section');

  return (
    <section id="about" className="about-section">
      {/* Top Right Decorative Leaves (Lowered down) */}
      <div className="about-decor-leaves">
        <Image
          src="/assets/pawel-about.png"
          alt="Natural Green Leaves"
          width={220}
          height={180}
          sizes="(max-width: 640px) 180px, 220px"
          className="about-leaves-img"
        />
      </div>

      <div className="about-container">
        {/* Top Centered Badge */}
        <div className="about-top-header">
          <div className="sg-section-badge">
            <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
            <span>{t('badge')}</span>
          </div>
        </div>

        <div className="about-grid">
          {/* Left Column: Image Card */}
          <div className="about-image-column">
            <div className="about-image-wrapper">
              <Image
                src="/assets/about.svg"
                alt="Golden Sun Fresh Vegetables Crate"
                width={480}    
                height={540}
                className="about-main-img"
                priority
              />
            </div>
          </div>
          {/* Right Column: Text Content */}
          <div className="about-content-column">
            {/* Headline */}
            <h2 className="about-title">
              <span className="about-title-dark">{t('title_part1')}</span>
              <br />
              <span className="about-title-green">{t('title_part2')}</span>
              <br />
              <span className="about-title-dark">{t('title_part3')}</span>
            </h2>

            {/* Description */}
            <p className="about-description">{t('description')}</p>

            {/* Action Row: CTA Buttons + Arrow SVG */}
            <div className="about-action-row flex-wrap">
              <Link href={`/${currentLocale}/about`} className="about-btn-cta">
                {t('cta')}
              </Link>

              <Link href={`/${currentLocale}/process`} className="about-btn-secondary">
                <span>Our Export Process</span>
                <span aria-hidden="true">→</span>
              </Link>

              <svg
                width="85"
                height="28"
                viewBox="0 0 105 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="about-orange-arrow hidden sm:block"
              >
                <path
                  d="M0.607227 7.90421C3.70511 5.06147 6.96292 2.54651 10.5014 0.267522C11.4476 -0.345538 12.6007 0.609798 11.9789 1.63905C11.0742 3.12038 10.0739 4.44482 8.97507 5.68869C16.501 5.03866 24.1074 4.53979 31.6254 5.47979C34.6546 5.86588 38.1388 6.4595 41.4464 7.51985C41.8233 7.13795 42.2198 6.77217 42.6408 6.43291C48.3823 1.7887 56.3176 1.46665 63.2615 2.8772C79.5747 6.18155 94.5107 17.2632 104 30.7074C104.381 31.2484 103.612 31.8942 103.21 31.3627C96.4058 22.5566 88.1729 15.205 78.2517 10.0871C69.208 5.42369 57.1182 1.05654 47.2533 5.68195C45.8626 6.33255 44.5307 7.16913 43.3544 8.18551C46.4676 9.39574 49.3062 11.1043 51.2857 13.5366C58.7286 22.6802 43.6934 31.1682 38.5865 21.0361C36.5734 17.0325 37.4759 12.6915 39.9391 9.29721C39.3307 9.10877 38.7268 8.93074 38.1173 8.76769C27.8421 5.99511 16.9928 6.99103 6.55783 7.93792C5.62274 8.02133 5.11284 7.0265 5.61969 6.32373C4.95145 6.86175 4.28787 7.41011 3.63934 7.96419C6.49023 8.48054 9.02396 9.53919 11.5566 11.2605C12.6472 11.994 11.4651 13.6627 10.3698 12.9187C7.49993 10.9744 4.62805 9.96784 1.17204 9.68629C0.232709 9.62172 -0.0215796 8.47443 0.607227 7.90421ZM46.6917 23.8357C51.0786 22.9988 52.0748 20.0023 49.7113 14.832C48.2919 13.2845 46.6398 12.079 44.7457 11.1948C43.7625 10.7002 42.7208 10.2694 41.6667 9.89419C40.9493 10.7666 40.3607 11.7309 39.9308 12.7987C38.1425 17.3884 40.4698 24.7234 46.6917 23.8357Z"
                  fill="#FF9C00"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
