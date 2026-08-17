'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import './CertificatesSlider.css';

interface CertificatesSliderProps {
  currentLocale: Locale;
}

const certificatesList = [
  {
    id: 'globalgap',
    tag: 'Farm Assurance',
    title: 'GLOBALG.A.P. IFA v6.0',
    desc: 'Sustainable farm production, soil/water management & MRL chemical safety.',
    logoSvg: (
      <svg width="190" height="55" viewBox="0 0 220 75" fill="none">
        <path d="M40 10C23.4 10 10 23.4 10 40C10 56.6 23.4 70 40 70C51.4 70 61.3 63.6 66.2 54.2H40V41.5H88.5C89.5 45.8 90 50.3 90 55C90 79.8 69.8 100 45 100C20.2 100 0 79.8 0 55C0 30.2 20.2 10 45 10Z" fill="#228731" transform="scale(0.48)" />
        <text x="55" y="42" fill="#228731" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="0.03em">GLOBALG.A.P.</text>
        <text x="55" y="58" fill="#666" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">IFA v6.0 Certified</text>
      </svg>
    ),
  },
  {
    id: 'grasp',
    tag: 'Social Compliance',
    title: 'GRASP Social Practice',
    desc: 'Fair labor standards, worker health & safety, and human rights compliance.',
    logoSvg: (
      <svg width="180" height="55" viewBox="0 0 200 75" fill="none">
        <path d="M25 30C25 24 29 19 35 19C41 19 45 24 45 30V48H48V22C48 16 52 11 58 11C64 11 68 16 68 22V48H71V26C71 20 75 15 81 15C87 15 91 20 91 26V55C91 70 79 82 63 82C47 82 25 70 25 55V30Z" fill="#0080FF" transform="scale(0.5)" />
        <text x="58" y="36" fill="#0080FF" fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif">GLOBALG.A.P.</text>
        <text x="58" y="56" fill="#0080FF" fontSize="19" fontWeight="900" fontFamily="Inter, sans-serif">GRASP</text>
      </svg>
    ),
  },
  {
    id: 'brcgs',
    tag: 'Packhouse Hygiene',
    title: 'BRCGS Food Safety',
    desc: 'Grade A packhouse standard with automated optical sorting & cold hygiene.',
    logoSvg: (
      <svg width="180" height="55" viewBox="0 0 200 75" fill="none">
        <rect x="2" y="10" width="44" height="44" rx="8" fill="#E60028" />
        <text x="8" y="41" fill="#ffffff" fontSize="21" fontWeight="900" fontFamily="Inter, sans-serif">BRC</text>
        <text x="54" y="32" fill="#1a1917" fontSize="17" fontWeight="900" fontFamily="Inter, sans-serif">BRCGS</text>
        <text x="54" y="48" fill="#E60028" fontSize="10" fontWeight="800" fontFamily="Inter, sans-serif">Food Safety Grade A</text>
      </svg>
    ),
  },
  {
    id: 'iso',
    tag: 'HACCP Management',
    title: 'ISO 22000 & 9001',
    desc: 'HACCP-based food safety management across washing, packing and cold chain.',
    logoSvg: (
      <svg width="180" height="55" viewBox="0 0 200 75" fill="none">
        <circle cx="26" cy="34" r="22" fill="#228731" />
        <circle cx="26" cy="34" r="17" fill="#ffffff" />
        <text x="26" y="32" fill="#1a1917" fontSize="8" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">ISO</text>
        <text x="26" y="42" fill="#228731" fontSize="9" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">22000</text>
        <text x="58" y="32" fill="#1a1917" fontSize="16" fontWeight="900" fontFamily="Inter, sans-serif">ISO 22000:2018</text>
        <text x="58" y="48" fill="#666" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">& ISO 9001 Quality</text>
      </svg>
    ),
  },
  {
    id: 'kosher',
    tag: 'Pure Produce',
    title: 'KOSHER & HALAL',
    desc: '100% natural, unadulterated fresh produce conforming to dietary laws.',
    logoSvg: (
      <svg width="180" height="55" viewBox="0 0 200 75" fill="none">
        <circle cx="26" cy="34" r="22" stroke="#228731" strokeWidth="2" />
        <circle cx="26" cy="34" r="18" stroke="#228731" strokeWidth="1" strokeDasharray="3 2" />
        <text x="26" y="39" fill="#228731" fontSize="13" fontWeight="900" fontFamily="Inter, sans-serif" textAnchor="middle">Ⓚ</text>
        <text x="58" y="32" fill="#1a1917" fontSize="16" fontWeight="900" fontFamily="Inter, sans-serif">KOSHER & HALAL</text>
        <text x="58" y="48" fill="#228731" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">100% Pure Agricultural</text>
      </svg>
    ),
  },
  {
    id: 'fda',
    tag: 'U.S. Clearance',
    title: 'U.S. FDA Registered',
    desc: 'Official Bioterrorism Act facility registration for prompt U.S. customs entry.',
    logoSvg: (
      <svg width="180" height="55" viewBox="0 0 200 75" fill="none">
        <rect x="2" y="12" width="44" height="40" rx="8" fill="#003366" />
        <text x="9" y="38" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="Inter, sans-serif">FDA</text>
        <text x="54" y="31" fill="#003366" fontSize="16" fontWeight="900" fontFamily="Inter, sans-serif">U.S. FDA</text>
        <text x="54" y="47" fill="#666" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">Facility Registered</text>
      </svg>
    ),
  },
];

export function CertificatesSlider({ currentLocale }: CertificatesSliderProps) {
  // Duplicate array for seamless infinite marquee loop
  const marqueeItems = [...certificatesList, ...certificatesList];

  return (
    <section className="cert-slider-section" aria-label="Official Accreditations & Certificates">
      <div className="cert-slider-container">
        
        {/* Header */}
        <div className="cert-slider-header">
          <div className="cert-slider-badge">
            <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
            <span>Accredited For Global Quality</span>
          </div>

          <h2 className="cert-slider-title">
            <span className="cert-slider-title-dark">Our International </span>
            <span className="cert-slider-title-green">Quality Certifications</span>
          </h2>

          <p className="cert-slider-subtitle">
            Ensuring 100% food safety, traceability, and European MRL chemical residue compliance across every export shipment.
          </p>
        </div>

      </div>

      {/* Infinite Marquee Slider */}
      <div className="cert-marquee-wrapper">
        <div className="cert-marquee-track">
          {marqueeItems.map((cert, index) => (
            <Link
              key={`${cert.id}-${index}`}
              href={`/${currentLocale}/certificates`}
              className="cert-slider-card"
            >
              <div>
                <div className="cert-slider-card-top">
                  <span className="cert-slider-tag">{cert.tag}</span>
                  <span className="cert-slider-status">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="cert-slider-logo-wrap">
                  {cert.logoSvg}
                </div>

                <h3 className="cert-slider-card-title">{cert.title}</h3>
                <p className="cert-slider-card-desc">{cert.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Link to full Certificates page */}
      <div className="cert-slider-footer">
        <Link href={`/${currentLocale}/certificates`} className="cert-slider-btn">
          <span>View All Accreditation Details & Standards</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </section>
  );
}
