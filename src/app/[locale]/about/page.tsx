import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  HeartHandshake,
  Building2,
  Users,
  Handshake,
  Laptop,
  Globe,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { Locale } from '@/types';
import './aboutPage.css';


const aboutSeo = {
  en: {
    title: 'About Us | Golden Sun Agricultural Export History & Vision',
    description: "Learn about Golden Sun's history, premium Egyptian agricultural produce, sustainable farming standards, food safety certifications, and global export partnerships.",
  },
  de: {
    title: 'Über Uns | Golden Sun Agrarexport Ägypten - Geschichte & Qualität',
    description: 'Erfahren Sie mehr über Golden Sun: Geschichte, ägyptisches Qualitätsgemüse, Lebensmittelsicherheits-Zertifikate (GlobalG.A.P., ISO) und weltweite Partnerschaften.',
  },
  es: {
    title: 'Sobre Nosotros | Golden Sun Exportación Agrícola de Egipto',
    description: 'Conozca la historia de Golden Sun, calidad de frutas y verduras frescas de Egipto, normas de inocuidad alimentaria y alianzas internacionales.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'en';
  const seo = aboutSeo[locale] || aboutSeo.en;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/about`,
      languages: {
        en: 'https://sungolden-eg.com/en/about',
        de: 'https://sungolden-eg.com/de/about',
        es: 'https://sungolden-eg.com/es/about',
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://sungolden-eg.com/${locale}/about`,
      type: 'website',
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);
  const tAbout = await getTranslations({ locale, namespace: 'about_page' });
  const tJ = await getTranslations({ locale, namespace: 'journey' });

  const features = [
    { key: 'feat_1', label: tAbout('feat_1'), icon: Award },
    { key: 'feat_2', label: tAbout('feat_2'), icon: ShieldCheck },
    { key: 'feat_3', label: tAbout('feat_3'), icon: CheckCircle2 },
    { key: 'feat_4', label: tAbout('feat_4'), icon: HeartHandshake },
  ];

  const timelineItems = [
    { year: '12-12-2022', title: tJ('item_founded_title'), desc: tJ('item_founded_desc'), isGreen: true, side: 'left', icon: Building2 },
    { year: '2025–2026', title: tJ('item_gcc_title'), desc: tJ('item_gcc_desc'), isGreen: false, side: 'right', icon: Globe },
    { year: '2025–2026', title: tJ('item_europe_title'), desc: tJ('item_europe_desc'), isGreen: true, side: 'left', icon: Award },
    { year: 'Today', title: tJ('item_today_title'), desc: tJ('item_today_desc'), isGreen: false, side: 'right', icon: Rocket },
  ];

  return (
    <main className="about-page-main">
      <div className="about-page-container">
        {/* Title */}
        <h1 className="about-main-title">
          <span>About </span>
          <span className="text-[#228731]">GOLDEN SUN</span>
        </h1>

        {/* 1. Top Banner Card (about-new.svg with Text Overlay) */}
        <section className="about-banner-card">
          <Image
            src="/assets/about-new.svg"
            alt="About Sun Golden Banner"
            fill
            priority
            className="about-banner-bg"
          />
          <div className="about-banner-overlay">
            <span className="about-banner-text font-serif">
              Rooted in Nature, Built on Trust
            </span>
          </div>
        </section>

        {/* 2. Our Story Section */}
        <section className="ourstory-section">
          <div className="ourstory-grid">
            <div className="ourstory-content">
              <div className="ourstory-badge">
                <svg width="20" height="13" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ourstory-badge-icon">
                  <path d="M0 0C0 0 16.723 0.154976 15.7773 12.9182C14.2767 11.1692 11.2856 8.00332 7.44157 5.57908C7.44157 5.57908 12.9611 10.9257 14.8831 14.8333L14.842 14.8665C14.8523 14.8775 4.26553 17.4014 0 0Z" fill="#228731" />
                  <path d="M24 6.34296C24 6.34296 15.3765 7.52737 16.5893 14.0474C17.2677 13.0511 18.6347 11.2135 20.4746 9.70815C20.4746 9.70815 17.9255 12.8297 17.1546 14.9773L17.1751 14.9883C17.1855 14.9883 22.7871 15.5971 24 6.34296Z" fill="#228731" />
                  <path d="M19.1594 2.65631C19.1594 2.65631 14.637 4.992 16.3946 8.32395C16.6002 7.63762 17.0319 6.3757 17.7925 5.19124C17.7925 5.19124 16.9188 7.40517 16.8674 8.72242H16.888C16.8777 8.73352 20.0537 7.96972 19.1594 2.65631Z" fill="#228731" />
                </svg>
                <span>{tAbout('badge')}</span>
              </div>

              <h2 className="ourstory-title">
                <span>{tAbout('headline_part1')}</span>
                <br />
                <span>{tAbout('headline_part2')}</span>
              </h2>

              <p className="ourstory-description">{tAbout('description')}</p>

              <div className="ourstory-features">
                {features.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div key={item.key} className="ourstory-feature-item">
                      <div className="ourstory-feature-icon-wrapper">
                        <IconComp size={18} className="ourstory-feature-icon" />
                      </div>
                      <span className="ourstory-feature-label">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="ourstory-image-wrapper">
              <Image
                src="/assets/Ourstory.svg"
                alt="Golden Sun Warehouse Produce"
                width={560}
                height={620}
                className="ourstory-main-img"
                priority
              />
            </div>
          </div>
        </section>

        {/* 3. Our Journey Of Success Timeline */}
        <section className="journey-section">
          <div className="journey-header">
            <h2 className="journey-title">{tJ('title')}</h2>
            <p className="journey-subtitle">{tJ('subtitle')}</p>
            <div className="journey-decor-line">
              <span className="journey-line-side" />
              <span className="journey-dot-outer">
                <span className="journey-dot-inner" />
              </span>
              <span className="journey-line-side" />
            </div>
          </div>

          <div className="journey-timeline">
            <div className="journey-axis" />
            {timelineItems.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div key={index} className={`journey-timeline-row journey-row-${item.side}`}>
                  <div className={`journey-card ${item.isGreen ? 'journey-card-green' : 'journey-card-white'}`}>
                    <div className="journey-card-header">
                      <div className={`journey-card-icon-box ${item.isGreen ? 'journey-icon-gold' : 'journey-icon-green'}`}>
                        <IconComp size={22} />
                      </div>
                      <div>
                        <span className="journey-card-year">{item.year}</span>
                        <h3 className="journey-card-title">{item.title}</h3>
                      </div>
                    </div>
                    <p className="journey-card-desc">{item.desc}</p>
                  </div>
                  <div className={`journey-node-dot ${item.isGreen ? 'journey-node-green' : 'journey-node-white'}`} />
                  <div className="journey-spacer" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Process CTA Banner at bottom of About page */}
        <section style={{
          marginTop: '60px',
          background: 'linear-gradient(135deg, #1b3e2b 0%, #0d281a 100%)',
          borderRadius: '24px',
          padding: '40px 48px',
          color: '#ffffff',
          boxShadow: '0 16px 36px rgba(13, 40, 26, 0.15)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#55d878',
                margin: '0 0 8px 0',
              }}>
                From Farm Harvest To Global Ports
              </p>
              <h2 style={{
                fontFamily: 'var(--font-vidaloka), "Vidaloka", Georgia, serif',
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 8px 0',
              }}>
                Discover Our 6-Step Export Journey
              </h2>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                maxWidth: '560px',
              }}>
                Learn how our quality control, cold-chain pre-cooling, optical sorting, and phytosanitary handling operate at scale.
              </p>
            </div>
            <Link
              href={`/${locale}/process`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 28px',
                background: '#228731',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '30px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 6px 20px rgba(34, 135, 49, 0.4)',
                transition: 'all 0.25s ease',
              }}
            >
              <span>Explore Export Process</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
