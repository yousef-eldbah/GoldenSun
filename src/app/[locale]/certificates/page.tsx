import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Award, FlaskConical, ThermometerSnowflake, FileCheck, ArrowRight, Phone } from 'lucide-react';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import './certificates.css';

const certSeo = {
  en: {
    title: 'Global Quality & Food Safety Accreditations | Golden Sun Export',
    description: 'Golden Sun Agricultural Export holds global certifications: GLOBALG.A.P., GRASP, BRCGS, ISO 22000, KOSHER & FDA for zero chemical residue compliance.',
  },
  de: {
    title: 'Qualitätszertifikate & Lebensmittelsicherheit | Golden Sun Agrarexport',
    description: 'Golden Sun ist nach europäischen Standards zertifiziert: GLOBALG.A.P., GRASP, BRCGS, ISO 22000 und KOSHER für 100% rückstandsfreie Frische.',
  },
  es: {
    title: 'Certificaciones de Calidad Global e Inocuidad | Golden Sun Export',
    description: 'Golden Sun cuenta con certificaciones internacionales: GLOBALG.A.P., GRASP, BRCGS, ISO 22000 y KOSHER para exportación a la Unión Europea.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'en';
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
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://sungolden-eg.com/${locale}/certificates`,
      type: 'website',
    },
  };
}

export default async function CertificatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'en';

  return (
    <main className="cert-page-main">
      <div className="cert-page-container">
        
        {/* 1. HERO HEADER */}
        <header className="cert-hero-header">
          <div className="cert-hero-badge">
            <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
            <span>International Standards & Accreditations</span>
          </div>

          <h1 className="cert-hero-title">
            <span className="cert-hero-title-dark">Certified For Global Quality, </span>
            <span className="cert-hero-title-green">Traceability & Food Safety</span>
          </h1>

          <p className="cert-hero-subtitle">
            At Golden Sun, our fresh fruits, garlic, and frozen vegetables are cultivated, sorted, and packed strictly adhering to the highest international agricultural standards required by leading supermarket chains across the EU, UK, and Americas.
          </p>
        </header>

        {/* 2. FOUR TRUST HIGHLIGHTS */}
        <div className="cert-trust-bar">
          <div className="cert-trust-card">
            <div className="cert-trust-icon-box">
              <ShieldCheck className="w-6 h-6 text-[#228731]" />
            </div>
            <h3 className="cert-trust-title">100% Traceability</h3>
            <p className="cert-trust-desc">Full batch tracking from registered farm plots to port of discharge.</p>
          </div>

          <div className="cert-trust-card">
            <div className="cert-trust-icon-box">
              <FlaskConical className="w-6 h-6 text-[#228731]" />
            </div>
            <h3 className="cert-trust-title">Zero Residue (MRL)</h3>
            <p className="cert-trust-desc">Pre-harvest lab testing ensuring total compliance with EU chemical limit directives.</p>
          </div>

          <div className="cert-trust-card">
            <div className="cert-trust-icon-box">
              <ThermometerSnowflake className="w-6 h-6 text-[#228731]" />
            </div>
            <h3 className="cert-trust-title">Continuous Cold Chain</h3>
            <p className="cert-trust-desc">Automated temperature and humidity logging across all reefer containers.</p>
          </div>

          <div className="cert-trust-card">
            <div className="cert-trust-icon-box">
              <FileCheck className="w-6 h-6 text-[#228731]" />
            </div>
            <h3 className="cert-trust-title">Phytosanitary Cleared</h3>
            <p className="cert-trust-desc">Official Egyptian Ministry of Agriculture export clearance with every bill of lading.</p>
          </div>
        </div>

        {/* 3. SIX OFFICIAL ACCREDITATION CARDS */}
        <section className="cert-grid-section">
          <div className="cert-section-heading">
            <div>
              <h2 className="cert-section-title">Official Accreditation Portfolio</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Verified compliance standards held by Golden Sun for international trade</p>
            </div>
            <span className="text-xs font-bold text-[#228731] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
              ✓ Fully Audited & Validated 2026
            </span>
          </div>

          <div className="cert-cards-grid">
            
            {/* CERT 1: GLOBALG.A.P. IFA v6.0 */}
            <div className="cert-showcase-card">
              <div className="cert-card-badge-top">
                <span>Integrated Farm Assurance</span>
              </div>
              <div className="cert-card-logo-wrap">
                <svg width="220" height="75" viewBox="0 0 220 75" fill="none">
                  <path d="M40 10C23.4 10 10 23.4 10 40C10 56.6 23.4 70 40 70C51.4 70 61.3 63.6 66.2 54.2H40V41.5H88.5C89.5 45.8 90 50.3 90 55C90 79.8 69.8 100 45 100C20.2 100 0 79.8 0 55C0 30.2 20.2 10 45 10Z" fill="#228731" transform="scale(0.5)" />
                  <text x="60" y="44" fill="#228731" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.04em">GLOBALG.A.P.</text>
                  <text x="60" y="60" fill="#666" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">IFA Version 6.0 Compliant</text>
                </svg>
              </div>
              <h3 className="cert-card-title">GLOBALG.A.P. IFA</h3>
              <p className="cert-card-desc">
                Certifies safe, sustainable agricultural production, soil and water conservation, responsible chemical use, and occupational health and safety across all our contracted farms.
              </p>
              <div className="cert-card-scope-box">
                <span className="cert-scope-label">Certified Produce Scope:</span>
                <div className="cert-scope-tags">
                  <span className="cert-tag">Valencia Oranges</span>
                  <span className="cert-tag">Strawberries</span>
                  <span className="cert-tag">Fresh Garlic</span>
                  <span className="cert-tag">Pomegranates</span>
                </div>
              </div>
            </div>

            {/* CERT 2: GRASP */}
            <div className="cert-showcase-card">
              <div className="cert-card-badge-top">
                <span>Social & Labor Compliance</span>
              </div>
              <div className="cert-card-logo-wrap">
                <svg width="200" height="75" viewBox="0 0 200 75" fill="none">
                  <path d="M25 30C25 24 29 19 35 19C41 19 45 24 45 30V48H48V22C48 16 52 11 58 11C64 11 68 16 68 22V48H71V26C71 20 75 15 81 15C87 15 91 20 91 26V55C91 70 79 82 63 82C47 82 25 70 25 55V30Z" fill="#0080FF" transform="scale(0.55)" />
                  <text x="65" y="38" fill="#0080FF" fontSize="16" fontWeight="800" fontFamily="Inter, sans-serif">GLOBALG.A.P.</text>
                  <text x="65" y="58" fill="#0080FF" fontSize="20" fontWeight="900" fontFamily="Inter, sans-serif">GRASP</text>
                </svg>
              </div>
              <h3 className="cert-card-title">GRASP Social Practice</h3>
              <p className="cert-card-desc">
                Demonstrates good social management and ethical labor standards, protecting worker welfare, fair remuneration, and child labor prevention across all harvest operations.
              </p>
              <div className="cert-card-scope-box">
                <span className="cert-scope-label">Audit Scope:</span>
                <div className="cert-scope-tags">
                  <span className="cert-tag">Fair Labor</span>
                  <span className="cert-tag">Worker Rights</span>
                  <span className="cert-tag">Health & Safety</span>
                </div>
              </div>
            </div>

            {/* CERT 3: BRCGS Food Safety */}
            <div className="cert-showcase-card">
              <div className="cert-card-badge-top">
                <span>Packhouse & Processing</span>
              </div>
              <div className="cert-card-logo-wrap">
                <svg width="200" height="75" viewBox="0 0 200 75" fill="none">
                  <rect x="5" y="10" width="48" height="48" rx="10" fill="#E60028" />
                  <text x="12" y="44" fill="#ffffff" fontSize="24" fontWeight="900" fontFamily="Inter, sans-serif">BRC</text>
                  <text x="62" y="34" fill="#1a1917" fontSize="18" fontWeight="900" fontFamily="Inter, sans-serif">BRCGS</text>
                  <text x="62" y="52" fill="#E60028" fontSize="11" fontWeight="800" fontFamily="Inter, sans-serif">Food Safety Grade A</text>
                </svg>
              </div>
              <h3 className="cert-card-title">BRCGS Food Safety</h3>
              <p className="cert-card-desc">
                Global Standard for Food Safety covering automated optical grading, packhouse hygiene, foreign body detection, and cold chain integrity in sorting centers.
              </p>
              <div className="cert-card-scope-box">
                <span className="cert-scope-label">Facility Scope:</span>
                <div className="cert-scope-tags">
                  <span className="cert-tag">Optical Sorting</span>
                  <span className="cert-tag">IQF Freezing</span>
                  <span className="cert-tag">Carton Packing</span>
                </div>
              </div>
            </div>

            {/* CERT 4: ISO 22000 & ISO 9001 */}
            <div className="cert-showcase-card">
              <div className="cert-card-badge-top">
                <span>Management & HACCP</span>
              </div>
              <div className="cert-card-logo-wrap">
                <svg width="200" height="75" viewBox="0 0 200 75" fill="none">
                  <circle cx="30" cy="35" r="26" fill="#228731" />
                  <circle cx="30" cy="35" r="20" fill="#ffffff" />
                  <text x="30" y="32" fill="#1a1917" fontSize="9" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">ISO</text>
                  <text x="30" y="44" fill="#228731" fontSize="11" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">22000</text>
                  <text x="68" y="32" fill="#1a1917" fontSize="18" fontWeight="900" fontFamily="Inter, sans-serif">ISO 22000:2018</text>
                  <text x="68" y="50" fill="#666" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">& ISO 9001 Quality</text>
                </svg>
              </div>
              <h3 className="cert-card-title">ISO 22000 & 9001</h3>
              <p className="cert-card-desc">
                HACCP-based Food Safety and Quality Management Systems ensuring zero contamination risks from post-harvest wash lines to export container loading.
              </p>
              <div className="cert-card-scope-box">
                <span className="cert-scope-label">System Scope:</span>
                <div className="cert-scope-tags">
                  <span className="cert-tag">HACCP Controls</span>
                  <span className="cert-tag">Quality Audit</span>
                  <span className="cert-tag">Cold Storage</span>
                </div>
              </div>
            </div>

            {/* CERT 5: KOSHER & HALAL */}
            <div className="cert-showcase-card">
              <div className="cert-card-badge-top">
                <span>Dietary Certification</span>
              </div>
              <div className="cert-card-logo-wrap">
                <svg width="200" height="75" viewBox="0 0 200 75" fill="none">
                  <circle cx="30" cy="35" r="26" stroke="#228731" strokeWidth="2.5" />
                  <circle cx="30" cy="35" r="21" stroke="#228731" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="30" y="40" fill="#228731" fontSize="14" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">Ⓚ</text>
                  <text x="68" y="32" fill="#1a1917" fontSize="17" fontWeight="900" fontFamily="Inter, sans-serif">KOSHER & HALAL</text>
                  <text x="68" y="50" fill="#228731" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">100% Pure Agricultural</text>
                </svg>
              </div>
              <h3 className="cert-card-title">KOSHER & HALAL Certified</h3>
              <p className="cert-card-desc">
                Guarantees 100% natural, unadulterated produce processed in strict accordance with religious dietary regulations, fully compliant with global retail specifications.
              </p>
              <div className="cert-card-scope-box">
                <span className="cert-scope-label">Compliance:</span>
                <div className="cert-scope-tags">
                  <span className="cert-tag">100% Natural</span>
                  <span className="cert-tag">No Additives</span>
                  <span className="cert-tag">Pure Produce</span>
                </div>
              </div>
            </div>

            {/* CERT 6: FDA Registered */}
            <div className="cert-showcase-card">
              <div className="cert-card-badge-top">
                <span>U.S. Market Clearance</span>
              </div>
              <div className="cert-card-logo-wrap">
                <svg width="200" height="75" viewBox="0 0 200 75" fill="none">
                  <rect x="5" y="12" width="48" height="44" rx="8" fill="#003366" />
                  <text x="13" y="41" fill="#ffffff" fontSize="16" fontWeight="900" fontFamily="Inter, sans-serif">FDA</text>
                  <text x="62" y="32" fill="#003366" fontSize="17" fontWeight="900" fontFamily="Inter, sans-serif">U.S. FDA Registered</text>
                  <text x="62" y="50" fill="#666" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">Facility Registration</text>
                </svg>
              </div>
              <h3 className="cert-card-title">FDA Facility Registration</h3>
              <p className="cert-card-desc">
                Registered under the U.S. Food & Drug Administration Bioterrorism Act, enabling seamless customs clearance and phytosanitary verification for American buyers.
              </p>
              <div className="cert-card-scope-box">
                <span className="cert-scope-label">Regulatory Scope:</span>
                <div className="cert-scope-tags">
                  <span className="cert-tag">U.S. Port Clearance</span>
                  <span className="cert-tag">FSMA Compliant</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. FOUR QUALITY PILLARS */}
        <section className="cert-pillars-section">
          <div className="cert-pillars-header">
            <h2 className="cert-pillars-title">The Golden Sun Quality Guarantee</h2>
            <p className="text-sm text-gray-600 font-medium">How we maintain zero rejection rates across international import terminals</p>
          </div>

          <div className="cert-pillars-grid">
            <div className="cert-pillar-item">
              <div className="cert-pillar-step">01</div>
              <h3 className="cert-pillar-heading">Pre-Harvest Soil & Water Testing</h3>
              <p className="cert-pillar-text">Regular multi-residue pesticide tests and heavy metal water checks conducted by ISO 17025 accredited labs.</p>
            </div>

            <div className="cert-pillar-item">
              <div className="cert-pillar-step">02</div>
              <h3 className="cert-pillar-heading">Automated Optical Sorting</h3>
              <p className="cert-pillar-text">Grading for precise diameter, color calibration, and Brix sugar content to ensure uniform carton packing.</p>
            </div>

            <div className="cert-pillar-item">
              <div className="cert-pillar-step">03</div>
              <h3 className="cert-pillar-heading">Ventilated Export Packaging</h3>
              <p className="cert-pillar-text">Heavy-duty telescopic export cartons and ozone-treated liners preventing moisture accumulation in transit.</p>
            </div>

            <div className="cert-pillar-item">
              <div className="cert-pillar-step">04</div>
              <h3 className="cert-pillar-heading">Digital Reefer Telematics</h3>
              <p className="cert-pillar-text">Real-time GPS and temperature monitoring across maritime voyages from Alexandria and Damietta ports.</p>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CTA CARD */}
        <div className="cert-cta-card">
          <div className="cert-cta-content">
            <h2 className="cert-cta-title">Need Official Batch Documentation for Customs?</h2>
            <p className="cert-cta-desc">
              Our export documentation department provides complete phytosanitary certificates, certificates of origin, GlobalGAP audit scopes, and COA analysis for every shipped container.
            </p>
          </div>
          <div className="cert-cta-buttons">
            <Link href={`/${locale}/rfq`} className="cert-btn-primary">
              <span>Request Produce Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${locale}/contact`} className="cert-btn-secondary">
              <span>Contact Quality Team</span>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
