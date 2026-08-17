import React from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Locale } from '@/types';
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
  const locale = (resolvedParams.locale as Locale) || 'en';
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
  const locale = resolvedParams.locale as Locale;
  const tWhy = await getTranslations({ locale, namespace: 'why_choose' });
  const tCert = await getTranslations({ locale, namespace: 'certificates_section' });

  return (
    <main className="why-page-main">
      <div className="why-page-container">
        {/* Title */}
        <h1 className="why-main-title">
          <span className="why-title-dark">Why Choose </span>
          <span className="why-title-green">GOLDEN SUN</span>
        </h1>

        {/* Banner Card (why-sec.svg) with Text Overlay */}
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
              THE TRUSTED PARTNER BEHIND YOUR SUCCESS
            </span>
          </div>
        </div>

        {/* Badge */}
        <div className="why-badge">
          <svg
            width="20"
            height="13"
            viewBox="0 0 24 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="why-badge-icon"
          >
            <path
              d="M0 0C0 0 16.723 0.154976 15.7773 12.9182C14.2767 11.1692 11.2856 8.00332 7.44157 5.57908C7.44157 5.57908 12.9611 10.9257 14.8831 14.8333L14.842 14.8665C14.8523 14.8775 4.26553 17.4014 0 0Z"
              fill="#228731"
            />
            <path
              d="M24 6.34296C24 6.34296 15.3765 7.52737 16.5893 14.0474C17.2677 13.0511 18.6347 11.2135 20.4746 9.70815C20.4746 9.70815 17.9255 12.8297 17.1546 14.9773L17.1751 14.9883C17.1855 14.9883 22.7871 15.5971 24 6.34296Z"
              fill="#228731"
            />
            <path
              d="M19.1594 2.65631C19.1594 2.65631 14.637 4.992 16.3946 8.32395C16.6002 7.63762 17.0319 6.3757 17.7925 5.19124C17.7925 5.19124 16.9188 7.40517 16.8674 8.72242H16.888C16.8777 8.73352 20.0537 7.96972 19.1594 2.65631Z"
              fill="#228731"
            />
          </svg>
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
                src="/assets/why2.svg"
                alt={tWhy('item2_title')}
                width={520}
                height={380}
                className="why-block-img"
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
            <svg
              width="20"
              height="13"
              viewBox="0 0 24 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="why-badge-icon"
            >
              <path d="M0 0C0 0 16.723 0.154976 15.7773 12.9182C14.2767 11.1692 11.2856 8.00332 7.44157 5.57908C7.44157 5.57908 12.9611 10.9257 14.8831 14.8333L14.842 14.8665C14.8523 14.8775 4.26553 17.4014 0 0Z" fill="#228731" />
              <path d="M24 6.34296C24 6.34296 15.3765 7.52737 16.5893 14.0474C17.2677 13.0511 18.6347 11.2135 20.4746 9.70815C20.4746 9.70815 17.9255 12.8297 17.1546 14.9773L17.1751 14.9883C17.1855 14.9883 22.7871 15.5971 24 6.34296Z" fill="#228731" />
              <path d="M19.1594 2.65631C19.1594 2.65631 14.637 4.992 16.3946 8.32395C16.6002 7.63762 17.0319 6.3757 17.7925 5.19124C17.7925 5.19124 16.9188 7.40517 16.8674 8.72242H16.888C16.8777 8.73352 20.0537 7.96972 19.1594 2.65631Z" fill="#228731" />
            </svg>
            <span>{tCert('badge')}</span>
          </div>

          <div className="why-cert-cards">
            <div className="why-cert-card why-cert-card-normal">
              <div className="why-cert-card-content">
                <h3 className="why-cert-card-title">{tCert('cert1_title')}</h3>
                <p className="why-cert-card-desc">{tCert('cert1_desc')}</p>
              </div>
              <div className="why-cert-card-logo">
                <svg width="220" height="110" viewBox="0 0 220 110" fill="none">
                  <path d="M60 20C37.9 20 20 37.9 20 60C20 82.1 37.9 100 60 100C75.2 100 88.4 91.5 95 79H60V62H118C119.3 67.8 120 73.8 120 80C120 113.1 93.1 140 60 140C26.9 140 0 113.1 0 80C0 46.9 26.9 20 60 20Z" fill="#228731" transform="scale(0.55)" />
                  <text x="85" y="72" fill="#228731" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.05em">GLOBALG.A.P.</text>
                </svg>
              </div>
            </div>

            <div className="why-cert-card why-cert-card-reverse">
              <div className="why-cert-card-logo">
                <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
                  <path d="M30 45C30 38 35 32 42 32C49 32 54 38 54 45V65H58V35C58 28 63 22 70 22C77 22 82 28 82 35V65H86V40C86 33 91 27 98 27C105 27 110 33 110 40V75C110 95 95 110 75 110C55 110 30 95 30 75V45Z" fill="#0080FF" transform="scale(0.65)" />
                  <text x="15" y="88" fill="#0080FF" fontSize="16" fontWeight="800" fontFamily="Inter, sans-serif">GLOBALG.A.P.</text>
                  <text x="35" y="108" fill="#0080FF" fontSize="20" fontWeight="900" fontFamily="Inter, sans-serif">GRASP</text>
                </svg>
              </div>
              <div className="why-cert-card-content">
                <h3 className="why-cert-card-title">{tCert('cert2_title')}</h3>
                <p className="why-cert-card-desc">{tCert('cert2_desc')}</p>
              </div>
            </div>

            <div className="why-cert-card why-cert-card-normal">
              <div className="why-cert-card-content">
                <h3 className="why-cert-card-title">{tCert('cert3_title')}</h3>
                <p className="why-cert-card-desc">{tCert('cert3_desc')}</p>
              </div>
              <div className="why-cert-card-logo">
                <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
                  <circle cx="90" cy="60" r="52" stroke="#228731" strokeWidth="4" strokeDasharray="6 4" />
                  <circle cx="90" cy="60" r="44" stroke="#228731" strokeWidth="2" />
                  <rect x="20" y="45" width="140" height="30" rx="4" fill="#228731" transform="rotate(-8 90 60)" />
                  <text x="90" y="66" fill="#ffffff" fontSize="18" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle" transform="rotate(-8 90 60)">KOSHER</text>
                  <text x="90" y="24" fill="#228731" fontSize="10" fontWeight="800" fontFamily="Inter, sans-serif" textAnchor="middle">CERTIFIED</text>
                  <text x="90" y="104" fill="#228731" fontSize="10" fontWeight="800" fontFamily="Inter, sans-serif" textAnchor="middle">CERTIFIED</text>
                </svg>
              </div>
            </div>

            <div className="why-cert-card why-cert-card-reverse">
              <div className="why-cert-card-logo">
                <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
                  <circle cx="80" cy="70" r="58" fill="#228731" />
                  <circle cx="80" cy="70" r="46" fill="#ffffff" />
                  <text x="80" y="55" fill="#1a1917" fontSize="14" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">ISO</text>
                  <text x="80" y="76" fill="#1a1917" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">9001</text>
                  <text x="80" y="92" fill="#228731" fontSize="9" fontWeight="800" fontFamily="Inter, sans-serif" textAnchor="middle">CERTIFIED</text>
                  <circle cx="80" cy="115" r="14" fill="#228731" />
                  <path d="M74 115L78 119L86 111" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="why-cert-card-content">
                <h3 className="why-cert-card-title">{tCert('cert4_title')}</h3>
                <p className="why-cert-card-desc">{tCert('cert4_desc')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
