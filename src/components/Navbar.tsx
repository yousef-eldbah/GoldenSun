'use client';

import './Navbar.css';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronDown, Menu, X, ShoppingBag } from 'lucide-react';
import { locales, localeNames } from '@/i18n/config';
import { Locale } from '@/types';
import { FlagIcon } from '@/components/FlagIcon';
import { useRFQBasket } from '@/context/RFQBasketContext';

export function Navbar({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useRFQBasket();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLocalePath = (newLocale: Locale) => {
    return pathname.replace(`/${currentLocale}`, `/${newLocale}`);
  };

  // Prefetch alternate languages immediately on dropdown interaction
  const toggleLangDropdown = () => {
    setIsLangOpen((prev) => {
      const next = !prev;
      if (next) {
        locales.forEach((loc) => {
          if (loc !== currentLocale) {
            router.prefetch(getLocalePath(loc));
          }
        });
      }
      return next;
    });
  };

  const navLinks = [
    { href: `/${currentLocale}`, label: t('home') },
    { href: `/${currentLocale}/products`, label: t('products') },
    { href: `/${currentLocale}/about`, label: t('about') },
    { href: `/${currentLocale}/why-choose`, label: t('why_choose') },
    { href: `/${currentLocale}/certificates`, label: t('certificates') },
    { href: `/${currentLocale}#contact`, label: t('contact') },
  ];

  const isActive = (href: string) => {
    // Exact match for home page
    if (href === `/${currentLocale}`) {
      return pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;
    }
    // For hash links, check if we're on the home page
    if (href.includes('#')) {
      return false;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo */}
        <Link href={`/${currentLocale}`} className="navbar-logo-link">
          <Image
            src="/assets/Frame 160.svg"
            alt="Golden Sun"
            width={142}
            height={40}
            className="navbar-logo-img"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${isActive(link.href) ? 'navbar-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side: Language + CTA */}
        <div className="navbar-actions">
          {/* Language Selector */}
          <div
            className="navbar-lang-wrapper"
            ref={langRef}
            onMouseEnter={() => {
              locales.forEach((loc) => {
                if (loc !== currentLocale) {
                  router.prefetch(getLocalePath(loc));
                }
              });
            }}
          >
            <button
              onClick={toggleLangDropdown}
              className="navbar-lang-btn"
              aria-label="Select Language"
              aria-expanded={isLangOpen}
            >
              <FlagIcon locale={currentLocale} />
              <span className="navbar-lang-code">{currentLocale.toUpperCase()}</span>
              <ChevronDown
                className={`navbar-lang-chevron ${isLangOpen ? 'navbar-lang-chevron--open' : ''}`}
                size={14}
              />
            </button>

            {isLangOpen && (
              <div className="navbar-lang-dropdown">
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={getLocalePath(loc)}
                    prefetch={true}
                    onClick={() => setIsLangOpen(false)}
                    className={`navbar-lang-option ${currentLocale === loc ? 'navbar-lang-option--active' : ''}`}
                  >
                    <FlagIcon locale={loc} />
                    <span className="navbar-lang-option-name">{localeNames[loc]}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Request Quote CTA Button */}
          <Link
            href={`/${currentLocale}/rfq`}
            className="navbar-cta inline-flex items-center gap-1.5"
          >
            <span>{t('request_quote') || 'Request Quote'}</span>
            {items.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-emerald-950 font-black text-[11px] inline-flex items-center justify-center shadow-xs">
                {items.length}
              </span>
            )}
          </Link>

          {/* Mobile Basket Badge Button */}
          <Link
            href={`/${currentLocale}/rfq`}
            className="md:hidden relative p-2 rounded-xl bg-emerald-800/90 text-amber-400 border border-emerald-600/40 flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-transform"
            aria-label="View Quote Basket"
          >
            <ShoppingBag className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] flex items-center justify-center shadow-md animate-pulse">
                {items.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="navbar-mobile-toggle"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Side Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="navbar-mobile-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="navbar-mobile-menu">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="navbar-drawer-close"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`navbar-mobile-link ${isActive(link.href) ? 'navbar-mobile-link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${currentLocale}#contact`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="navbar-mobile-cta"
            >
              {t('request_quote')}
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
