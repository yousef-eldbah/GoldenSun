'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  PhoneCall,
  MapPin,
  Phone,
  Mail,
  Share2,
  Globe,
  MessageCircle,
} from 'lucide-react';
import { Locale } from '@/types';
import './Footer.css';

export function Footer({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-outer">
      {/* 1. Floating Newsletter Card (Overlaps Top of Footer) */}
      <div className="footer-newsletter-container">
        <div className="footer-newsletter-card">
          <div className="footer-newsletter-text">
            <h3 className="footer-newsletter-title">{t('newsletter_title')}</h3>
            <p className="footer-newsletter-desc">{t('newsletter_desc')}</p>
          </div>

          <form onSubmit={handleSubscribe} className="footer-newsletter-form">
            <div className="footer-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter_placeholder')}
                className="footer-input-field"
                required
              />
              <button type="submit" className="footer-subscribe-btn">
                {subscribed ? '✓ Subscribed' : t('newsletter_btn')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Main Dark Green Footer Section */}
      <div className="footer-main-area">
        {/* Decorative background images matching Figma: footerl.svg left, image 69.svg right */}
        <div className="footer-bg-left">
          <Image
            src="/assets/footerl.svg"
            alt=""
            width={440}
            height={320}
            className="footer-bg-corner-img"
          />
        </div>
        <div className="footer-bg-right">
          <Image
            src="/assets/image 69.svg"
            alt=""
            width={440}
            height={320}
            className="footer-bg-corner-img"
          />
        </div>

        <div className="footer-content-wrapper">

          {/* 4 Main Columns Grid */}
          <div className="footer-grid">
            {/* Column 1: Logo & About & Social Icons */}
            <div className="footer-col footer-col-brand">
              <div className="footer-logo-wrapper">
                <Image
                  src="/assets/logo-footer.svg"
                  alt="Golden Sun Emblem"
                  width={48}
                  height={42}
                  className="footer-logo-icon"
                />
                <span className="footer-logo-text">Golden Sun</span>
              </div>

              <p className="footer-brand-text">{t('about_text')}</p>

              {/* 4 Social Icons */}
              <div className="footer-social-row">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Facebook"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Twitter"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="LinkedIn"
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="WhatsApp"
                >
                  <PhoneCall size={15} />
                </a>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div className="footer-col">
              <div className="footer-col-header">
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 24 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="footer-leaf-icon"
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
                <h4 className="footer-col-title">{t('categories_title')}</h4>
              </div>

              <ul className="footer-links-list">
                <li>
                  <Link href={`/${currentLocale}/products`}>
                    <span className="footer-arrow">→</span> {t('cat_vegetables')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${currentLocale}/products`}>
                    <span className="footer-arrow">→</span> {t('cat_fruits')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${currentLocale}/products`}>
                    <span className="footer-arrow">→</span> {t('cat_dairy')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="footer-col">
              <div className="footer-col-header">
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 24 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="footer-leaf-icon"
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
                <h4 className="footer-col-title">{t('quick_links_title')}</h4>
              </div>

              <ul className="footer-links-list">
                <li>
                  <Link href={`/${currentLocale}/about`}>
                    <span className="footer-arrow">→</span> {t('link_about')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${currentLocale}/products`}>
                    <span className="footer-arrow">→</span> {t('link_gallery')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${currentLocale}/certificates`}>
                    <span className="footer-arrow">→</span> {t('link_certificates')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${currentLocale}/why-choose`}>
                    <span className="footer-arrow">→</span> {t('link_blog')}
                  </Link>
                </li>
                <li>
                  <Link href={`/${currentLocale}#markets`}>
                    <span className="footer-arrow">→</span> {t('link_process')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div className="footer-col footer-col-contact">
              <div className="footer-col-header">
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 24 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="footer-leaf-icon"
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
                <h4 className="footer-col-title">{t('contact_title')}</h4>
              </div>

              <div className="footer-contact-list">
                {/* Location */}
                <div className="footer-contact-item">
                  <div className="footer-contact-badge">
                    <MapPin size={15} />
                  </div>
                  <span className="footer-contact-text">{t('contact_address')}</span>
                </div>

                {/* Phone */}
                <div className="footer-contact-item">
                  <div className="footer-contact-badge">
                    <Phone size={15} />
                  </div>
                  <div className="footer-contact-lines">
                    <span>{t('contact_phone_1')}</span>
                    <span>{t('contact_phone_2')}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="footer-contact-item">
                  <div className="footer-contact-badge">
                    <Mail size={15} />
                  </div>
                  <div className="footer-contact-lines">
                    <span>{t('contact_email_1')} | {t('contact_email_2')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
