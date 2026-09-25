import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import { ArrowRight } from 'lucide-react';
import './whyChoose.css';

const whySeo = {
  en: {
    title: 'Why Choose Golden Sun | Certified Egyptian Produce Exporter',
    description: 'Discover why Golden Sun is the trusted partner for fresh produce export — direct farm sourcing, GlobalG.A.P. quality control, and competitive seasonal pricing.',
  },
  de: {
    title: 'Warum Golden Sun | Zertifizierter Agrarexporteur aus Ägypten',
    description: 'Warum europäische Importeure Golden Sun wählen: Direkte Farmbeschaffung, lückenlose Qualitätskontrolle und zuverlässige Kühlkettenlogistik.',
  },
  es: {
    title: 'Por Qué Elegir Golden Sun | Exportador Agrícola Certificado de Egipto',
    description: 'Descubra por qué Golden Sun es el socio de confianza para la exportación de frutas y verduras: abastecimiento directo, control de calidad y precios estables.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale as Locale) || 'en';
  const seo = whySeo[locale] || whySeo.en;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/why-choose`,
      languages: {
        en: 'https://sungolden-eg.com/en/why-choose',
        de: 'https://sungolden-eg.com/de/why-choose',
        es: 'https://sungolden-eg.com/es/why-choose',
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://sungolden-eg.com/${locale}/why-choose`,
      type: 'website',
    },
  };
}

export default async function WhyChoosePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);
  const tWhy = await getTranslations({ locale, namespace: 'why_choose' });
  const tCert = await getTranslations({ locale, namespace: 'certificates_section' });

  return (
    <main className="why-page-main">
      <div className="why-page-container">
        {/* Title */}
        <h1 className="why-main-title">
          <span className="why-title-dark">{tWhy('title_part1')}</span>
          <span className="why-title-green">{tWhy('title_part2')}</span>
        </h1>

        {/* Banner Card with Text Overlay */}
        <div className="why-banner-card">
          <Image
            src="/assets/about-new.svg"
            alt="Golden Sun Farm Landscape"
            fill
            priority
            className="why-banner-bg"
          />
          <div className="why-banner-overlay">
            <span className="why-banner-overlay-text font-serif">
              {tWhy('banner_text')}
            </span>
          </div>
        </div>

        {/* Badge */}
        <div className="why-badge">
          <LeafBadgeIcon className="w-5 h-4 text-[#228731]" />
          <span>{tWhy('badge')}</span>
        </div>

        {/* 3 Feature Blocks */}
        <div className="why-blocks">
          {/* Block 01 */}
          <div className="why-block why-block-normal">
            <div className="why-block-content">
              <div className="why-number-wrapper">
                <span className="why-number-badge" />
                <span className="why-number-text">01</span>
              </div>
              <h3 className="why-block-title">{tWhy('item1_title')}</h3>
              <p className="why-block-desc">{tWhy('item1_desc')}</p>
            </div>
            <div className="why-block-img-wrapper">
              <Image
                src="/assets/why1.svg"
                alt={tWhy('item1_title')}
                width={520}
                height={380}
                className="why-block-img"
                priority
              />
            </div>
          </div>

          {/* Block 02 */}
          <div className="why-block why-block-reverse">
            <div className="why-block-content">
              <div className="why-number-wrapper">
                <span className="why-number-badge" />
                <span className="why-number-text">02</span>
              </div>
              <h3 className="why-block-title">{tWhy('item2_title')}</h3>
              <p className="why-block-desc">{tWhy('item2_desc')}</p>
            </div>
            <div className="why-block-img-wrapper">
              <Image
                src="/assets/ss.png"
                alt={tWhy('item2_title')}
                width={520}
                height={380}
                className="why-block-img why-block-img-curve"
                unoptimized
              />
            </div>
          </div>

          {/* Block 03 */}
          <div className="why-block why-block-normal">
            <div className="why-block-content">
              <div className="why-number-wrapper">
                <span className="why-number-badge" />
                <span className="why-number-text">03</span>
              </div>
              <h3 className="why-block-title">{tWhy('item3_title')}</h3>
              <p className="why-block-desc">{tWhy('item3_desc')}</p>
            </div>
            <div className="why-block-img-wrapper">
              <Image
                src="/assets/why3.svg"
                alt={tWhy('item3_title')}
                width={520}
                height={380}
                className="why-block-img"
              />
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <section id="certificates" className="why-cert-section">
          <div className="why-badge">
            <LeafBadgeIcon className="w-5 h-4 text-[#228731]" />
            <span>{tCert('badge')}</span>
          </div>

          <div className="why-cert-cards">
            {/* Cert 1: GLOBALG.A.P. */}
            <div className="why-cert-card why-cert-card-normal">
              <div className="why-cert-card-content">
                <h3 className="why-cert-card-title">{tCert('cert1_title')}</h3>
                <p className="why-cert-card-desc">{tCert('cert1_desc')}</p>
              </div>
              <div className="why-cert-card-logo">
                <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
                  <path d="M60 20C37.9 20 20 37.9 20 60C20 82.1 37.9 100 60 100C75.2 100 88.4 91.5 95 79H60V62H118C119.3 67.8 120 73.8 120 80C120 113.1 93.1 140 60 140C26.9 140 0 113.1 0 80C0 46.9 26.9 20 60 20Z" fill="#228731" transform="scale(0.5)" />
                  <text x="75" y="60" fill="#228731" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.04em">GLOBALG.A.P.</text>
                </svg>
              </div>
            </div>

            {/* Cert 2: GRASP */}
            <div className="why-cert-card why-cert-card-reverse">
              <div className="why-cert-card-logo">
                <svg width="200" height="90" viewBox="0 0 200 90" fill="none">
                  <path d="M30 45C30 38 35 32 42 32C49 32 54 38 54 45V65H58V35C58 28 63 22 70 22C77 22 82 28 82 35V65H86V40C86 33 91 27 98 27C105 27 110 33 110 40V75C110 95 95 110 75 110C55 110 30 95 30 75V45Z" fill="#228731" transform="scale(0.55)" />
                  <text x="65" y="42" fill="#228731" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">GLOBALG.A.P.</text>
                  <text x="65" y="66" fill="#228731" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif">GRASP</text>
                </svg>
              </div>
              <div className="why-cert-card-content">
                <h3 className="why-cert-card-title">{tCert('cert2_title')}</h3>
                <p className="why-cert-card-desc">{tCert('cert2_desc')}</p>
              </div>
            </div>

            {/* Cert 3: SEDEX */}
            <div className="why-cert-card why-cert-card-normal">
              <div className="why-cert-card-content">
                <h3 className="why-cert-card-title">{tCert('cert3_title')}</h3>
                <p className="why-cert-card-desc">{tCert('cert3_desc')}</p>
              </div>
              <div className="why-cert-card-logo">
                <svg width="180" height="70" viewBox="0 0 180 70" fill="none">
                  <text x="15" y="48" fill="#1b1b1b" fontSize="32" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="-0.02em">Sedex</text>
                  <circle cx="100" cy="24" r="7.5" fill="#e51b24" />
                </svg>
              </div>
            </div>

            {/* Cert 4: BRCGS Food Safety */}
            <div className="why-cert-card why-cert-card-reverse">
              <div className="why-cert-card-logo">
                <svg width="190" height="70" viewBox="0 0 190 70" fill="none">
                  <text x="10" y="38" fill="#388e3c" fontSize="28" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.02em">BRCGS</text>
                  <text x="12" y="58" fill="#333333" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">Food Safety</text>
                </svg>
              </div>
              <div className="why-cert-card-content">
                <h3 className="why-cert-card-title">{tCert('cert4_title')}</h3>
                <p className="why-cert-card-desc">{tCert('cert4_desc')}</p>
              </div>
            </div>
          </div>

          {/* Link to full certificates page */}
          <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '8px' }}>
            <Link
              href={`/${locale}/certificates`}
              className="why-cert-cta-btn"
            >
              <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
              <span>View Full Accreditation Details & Standards</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Process CTA Banner */}
        <section className="why-process-cta">
          <div className="why-process-cta-inner">
            <div>
              <p className="why-process-cta-label">Step-by-step from farm to port</p>
              <h2 className="why-process-cta-title">See How We Export</h2>
              <p className="why-process-cta-desc">
                Understand our full export process — from farm-gate harvest and cold-chain handling to phytosanitary clearance and container loading.
              </p>
            </div>
            <Link href={`/${locale}/process`} className="why-process-cta-btn">
              Our Export Process <ArrowRight size={18} />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
