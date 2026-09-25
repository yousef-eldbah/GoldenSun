import React from 'react';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FlaskConical, 
  ThermometerSnowflake, 
  FileCheck, 
  ArrowRight, 
  BadgeCheck
} from 'lucide-react';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import './certificates.css';

const certSeo = {
  en: {
    title: 'Official Export Certifications | Golden Sun Agricultural Operations',
    description: 'Golden Sun holds official international accreditations: GLOBALG.A.P., GRASP, SEDEX, and BRCGS Food Safety for fresh fruit and vegetable exports.',
  },
  de: {
    title: 'Offizielle Exportzertifikate | Golden Sun Agrarexport Ägypten',
    description: 'Golden Sun verfügt über offizielle internationale Zertifikate: GLOBALG.A.P., GRASP, SEDEX und BRCGS Lebensmittelsicherheit.',
  },
  es: {
    title: 'Certificaciones Oficiales de Exportación | Golden Sun Export',
    description: 'Golden Sun cuenta con acreditaciones internacionales verificadas: GLOBALG.A.P., GRASP, SEDEX y BRCGS Inocuidad Alimentaria.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  const seo = certSeo[locale] || certSeo.en;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `https://sungolden-eg.com/${locale}/certificates`,
      languages: {
        en: 'https://sungolden-eg.com/en/certificates',
        de: 'https://sungolden-eg.com/de/certificates',
        es: 'https://sungolden-eg.com/es/certificates',
        'x-default': 'https://sungolden-eg.com/en/certificates',
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://sungolden-eg.com/${locale}/certificates`,
      siteName: 'Golden Sun Agricultural Export',
      type: 'website',
    },
  };
}

export default async function CertificatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || 'en') as Locale;
  setRequestLocale(locale);

  const officialCerts = [
    {
      id: 'globalgap',
      tag: 'Farm Assurance',
      title: 'GLOBALG.A.P. Certified',
      desc: 'Sustainable farm production, soil/water conservation, and European MRL chemical residue compliance.',
      scope: ['Valencia Oranges', 'Sweet Potatoes', 'Garlic', 'Strawberries', 'Pomegranates'],
      logoSvg: (
        <svg width="190" height="55" viewBox="0 0 220 75" fill="none">
          <path d="M40 10C23.4 10 10 23.4 10 40C10 56.6 23.4 70 40 70C51.4 70 61.3 63.6 66.2 54.2H40V41.5H88.5C89.5 45.8 90 50.3 90 55C90 79.8 69.8 100 45 100C20.2 100 0 79.8 0 55C0 30.2 20.2 10 45 10Z" fill="#228731" transform="scale(0.48)" />
          <text x="55" y="42" fill="#228731" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.03em">GLOBALG.A.P.</text>
          <text x="55" y="58" fill="#666" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">Certified Farm Production</text>
        </svg>
      ),
    },
    {
      id: 'grasp',
      tag: 'Social Compliance',
      title: 'GRASP Social Practice',
      desc: 'Fair labor standards, worker health & safety, ethical remuneration, and human rights compliance.',
      scope: ['Worker Welfare', 'Fair Remuneration', 'Occupational Safety', 'Human Rights'],
      logoSvg: (
        <svg width="180" height="55" viewBox="0 0 200 75" fill="none">
          <path d="M25 30C25 24 29 19 35 19C41 19 45 24 45 30V48H48V22C48 16 52 11 58 11C64 11 68 16 68 22V48H71V26C71 20 75 15 81 15C87 15 91 20 91 26V55C91 70 79 82 63 82C47 82 25 70 25 55V30Z" fill="#228731" transform="scale(0.5)" />
          <text x="58" y="36" fill="#228731" fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif">GLOBALG.A.P.</text>
          <text x="58" y="56" fill="#228731" fontSize="19" fontWeight="900" fontFamily="Inter, sans-serif">GRASP</text>
        </svg>
      ),
    },
    {
      id: 'sedex',
      tag: 'Ethical Trade',
      title: 'SEDEX Ethical Trade',
      desc: 'Supplier Ethical Data Exchange audit for continuous ethical, social, and sustainable supply chains.',
      scope: ['Labor Rights', 'Health & Safety', 'Environmental Impact', 'Business Ethics'],
      logoSvg: (
        <svg width="180" height="55" viewBox="0 0 200 75" fill="none">
          <text x="10" y="44" fill="#1b1b1b" fontSize="28" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="-0.02em">Sedex</text>
          <circle cx="82" cy="24" r="6" fill="#e51b24" />
        </svg>
      ),
    },
    {
      id: 'brcgs',
      tag: 'Food Safety Standard',
      title: 'BRCGS Food Safety',
      desc: 'Global Standard for Food Safety ensuring strict packhouse hygiene, grading, and cold chain controls.',
      scope: ['HACCP Food Safety', 'Packhouse Hygiene', 'Optical Sorting', 'Cold Chain Control'],
      logoSvg: (
        <svg width="180" height="55" viewBox="0 0 200 75" fill="none">
          <text x="10" y="38" fill="#388e3c" fontSize="26" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.02em">BRCGS</text>
          <text x="12" y="56" fill="#333333" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">Food Safety</text>
        </svg>
      ),
    },
  ];

  return (
    <main className="cert-page-main">
      <div className="cert-page-container">
        
        {/* 1. HERO HEADER */}
        <header className="cert-hero-header">
          <div className="cert-hero-badge">
            <LeafBadgeIcon className="w-3.5 h-3.5 text-[#228731]" />
            <span>Accredited Quality Standards</span>
          </div>

          <h1 className="cert-hero-title">
            International Quality & <span className="text-[#228731]">Certifications</span>
          </h1>

          <p className="cert-hero-subtitle">
            Ensuring 100% food safety, traceability, and European MRL chemical residue compliance across every export shipment.
          </p>
        </header>

        {/* 2. THE 4 CERTIFICATE CARDS */}
        <section className="cert-cards-section">
          <div className="cert-cards-grid">
            {officialCerts.map((cert) => (
              <div key={cert.id} className="cert-card-item">
                <div className="cert-card-top">
                  <span className="cert-card-tag">{cert.tag}</span>
                  <span className="cert-card-status">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="cert-card-logo-wrap">
                  {cert.logoSvg}
                </div>

                <h3 className="cert-card-title">{cert.title}</h3>
                <p className="cert-card-desc">{cert.desc}</p>

                <div className="cert-card-scope">
                  {cert.scope.map((tag, i) => (
                    <span key={i} className="cert-scope-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. FOUR KEY TRUST INDICATORS */}
        <div className="cert-trust-row">
          <div className="cert-trust-item">
            <ShieldCheck className="w-5 h-5 text-[#228731] flex-shrink-0" />
            <div>
              <h4 className="cert-trust-heading">100% Traceability</h4>
              <p className="cert-trust-text">Plot-to-port batch tracking</p>
            </div>
          </div>

          <div className="cert-trust-item">
            <FlaskConical className="w-5 h-5 text-[#228731] flex-shrink-0" />
            <div>
              <h4 className="cert-trust-heading">Zero Residue (MRL)</h4>
              <p className="cert-trust-text">EU chemical limits tested</p>
            </div>
          </div>

          <div className="cert-trust-item">
            <ThermometerSnowflake className="w-5 h-5 text-[#228731] flex-shrink-0" />
            <div>
              <h4 className="cert-trust-heading">Cold Chain Logged</h4>
              <p className="cert-trust-text">Continuous reefer sensors</p>
            </div>
          </div>

          <div className="cert-trust-item">
            <FileCheck className="w-5 h-5 text-[#228731] flex-shrink-0" />
            <div>
              <h4 className="cert-trust-heading">Phytosanitary Clean</h4>
              <p className="cert-trust-text">Ministry export clearance</p>
            </div>
          </div>
        </div>

        {/* 4. QUALITY PROTOCOLS */}
        <section className="cert-protocol-box">
          <div className="cert-protocol-header">
            <span className="cert-protocol-tag">Quality Assurance Protocol</span>
            <h2 className="cert-protocol-title">From Farm Harvest to Port Clearance</h2>
          </div>

          <div className="cert-protocol-steps">
            <div className="cert-step-card">
              <span className="cert-step-num">01</span>
              <h4 className="cert-step-title">Lab MRL Testing</h4>
              <p className="cert-step-desc">Pre-harvest sampling tested at ISO 17025 accredited labs for 500+ chemical compounds.</p>
            </div>

            <div className="cert-step-card">
              <span className="cert-step-num">02</span>
              <h4 className="cert-step-title">Sanitized Grading</h4>
              <p className="cert-step-desc">Washed with ozone-treated water, dried and calibrated by optical sorting machines.</p>
            </div>

            <div className="cert-step-card">
              <span className="cert-step-num">03</span>
              <h4 className="cert-step-title">Quarantine Clearance</h4>
              <p className="cert-step-desc">Official Egyptian Ministry of Agriculture phytosanitary inspection & certification.</p>
            </div>

            <div className="cert-step-card">
              <span className="cert-step-num">04</span>
              <h4 className="cert-step-title">Reefer Telematics</h4>
              <p className="cert-step-desc">Automated temperature and humidity data loggers installed in every export container.</p>
            </div>
          </div>
        </section>

        {/* 5. SLIM CTA CARD */}
        <div className="cert-slim-cta">
          <div className="cert-cta-left">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-1">
              <BadgeCheck size={16} />
              <span>Verified Documentation Available</span>
            </div>
            <h3 className="cert-cta-heading">Request Certificate Copies & Lab Test Reports</h3>
            <p className="cert-cta-sub">
              Our quality assurance team provides certificate validation documents and pesticide residue test reports upon request.
            </p>
          </div>

          <div className="cert-cta-right">
            <Link href={`/${locale}/rfq`} className="cert-action-btn primary">
              <span>Submit Commercial Inquiry</span>
              <ArrowRight size={15} />
            </Link>
            <Link href={`/${locale}/contact`} className="cert-action-btn secondary">
              <span>Contact Quality Team</span>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
