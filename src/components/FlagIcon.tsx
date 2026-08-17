import React from 'react';
import { Locale } from '@/types';

export function FlagIcon({ locale, className = 'w-5 h-3.5 rounded-xs' }: { locale: Locale; className?: string }) {
  if (locale === 'en') {
    // UK Flag SVG
    return (
      <svg className={`${className} inline-block shrink-0 shadow-xs border border-black/10`} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z"/>
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z m0,0 v-15 h-30 z m0,0 h-30 v15 z m0,0 v-15 h30 z"/>
        </clipPath>
        <g clipPath="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
      </svg>
    );
  }

  if (locale === 'de') {
    // Germany Flag SVG
    return (
      <svg className={`${className} inline-block shrink-0 shadow-xs border border-black/10`} viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg">
        <rect width="5" height="3" fill="#000"/>
        <rect width="5" height="2" y="1" fill="#DD0000"/>
        <rect width="5" height="1" y="2" fill="#FFCC00"/>
      </svg>
    );
  }

  if (locale === 'es') {
    // Spain Flag SVG
    return (
      <svg className={`${className} inline-block shrink-0 shadow-xs border border-black/10`} viewBox="0 0 750 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="750" height="500" fill="#c60b1e"/>
        <rect width="750" height="250" y="125" fill="#ffc400"/>
      </svg>
    );
  }

  return null;
}
