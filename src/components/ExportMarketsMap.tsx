'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';


interface DestinationCountry {
  name: string;
  code: string;
  flagSvg: React.ReactNode;
}

const destinationCountries: DestinationCountry[] = [
  {
    name: 'Netherlands',
    code: 'nl',
    flagSvg: (
      <svg className="w-9 h-6 rounded-md shadow-2xs border border-gray-200 shrink-0" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="900" height="200" fill="#21468B" />
        <rect width="900" height="200" y="200" fill="#AE1C28" />
        <rect width="900" height="200" y="400" fill="#21468B" />
        <rect width="900" height="600" fill="none" />
        <path fill="#AE1C28" d="M0 0h900v200H0z"/>
        <path fill="#FFF" d="M0 200h900v200H0z"/>
        <path fill="#21468B" d="M0 400h900v200H0z"/>
      </svg>
    ),
  },
  {
    name: 'United Kingdom',
    code: 'gb',
    flagSvg: (
      <svg className="w-9 h-6 rounded-md shadow-2xs border border-gray-200 shrink-0" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="uk-clip">
          <path d="M0,0 v30 h60 v-30 z"/>
        </clipPath>
        <clipPath id="uk-diag">
          <path d="M30,15 h30 v15 z m0,0 v-15 h-30 z m0,0 h-30 v15 z m0,0 v-15 h30 z"/>
        </clipPath>
        <g clipPath="url(#uk-clip)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-diag)" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
      </svg>
    ),
  },
  {
    name: 'SPAIN',
    code: 'es',
    flagSvg: (
      <svg className="w-9 h-6 rounded-md shadow-2xs border border-gray-200 shrink-0" viewBox="0 0 750 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="750" height="500" fill="#c60b1e"/>
        <rect width="750" height="250" y="125" fill="#ffc400"/>
      </svg>
    ),
  },
  {
    name: 'ITALY',
    code: 'it',
    flagSvg: (
      <svg className="w-9 h-6 rounded-md shadow-2xs border border-gray-200 shrink-0" viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg">
        <rect width="1" height="2" fill="#009246"/>
        <rect width="1" height="2" x="1" fill="#ffffff"/>
        <rect width="1" height="2" x="2" fill="#ce2b37"/>
      </svg>
    ),
  },
  {
    name: 'Germany',
    code: 'de',
    flagSvg: (
      <svg className="w-9 h-6 rounded-md shadow-2xs border border-gray-200 shrink-0" viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg">
        <rect width="5" height="1" fill="#000000"/>
        <rect width="5" height="1" y="1" fill="#DD0000"/>
        <rect width="5" height="1" y="2" fill="#FFCC00"/>
      </svg>
    ),
  },
  {
    name: 'Russia',
    code: 'ru',
    flagSvg: (
      <svg className="w-9 h-6 rounded-md shadow-2xs border border-gray-200 shrink-0" viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
        <rect width="9" height="2" fill="#ffffff"/>
        <rect width="9" height="2" y="2" fill="#0039a6"/>
        <rect width="9" height="2" y="4" fill="#d52b1e"/>
      </svg>
    ),
  },
  {
    name: 'Turkey',
    code: 'tr',
    flagSvg: (
      <svg className="w-9 h-6 rounded-md shadow-2xs border border-gray-200 shrink-0" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="800" fill="#E30A17"/>
        <circle cx="425" cy="400" r="200" fill="#ffffff"/>
        <circle cx="475" cy="400" r="160" fill="#E30A17"/>
        <polygon fill="#ffffff" points="583.3,400 706.7,440.1 630.4,335.2 630.4,464.8 706.7,359.9"/>
      </svg>
    ),
  },
  {
    name: 'Saudi Arabia',
    code: 'sa',
    flagSvg: (
      <svg className="w-9 h-6 rounded-md shadow-2xs border border-gray-200 shrink-0" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="900" height="600" fill="#006C35"/>
        <path fill="#FFF" d="M250 380h400v20H250z M270 360l-30 40h460l-30-40z"/>
      </svg>
    ),
  },
];

export function ExportMarketsMap({ currentLocale }: { currentLocale: Locale }) {
  return (
    <section id="markets" className="py-16 sm:py-24 bg-white text-gray-900 border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#17C548] text-xs font-bold uppercase tracking-wider">
            <LeafBadgeIcon className="w-4 h-4 text-[#17C548]" />
            <span>OUR EXPORT MARKETS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 tracking-tight font-serif">
            Where Golden Sun Exports
          </h2>

          <p className="text-gray-400 text-sm sm:text-base font-normal">
            Growing Trust. Delivering Excellence Worldwide.
          </p>
        </div>

        {/* Map Graphic Container (Clean, Flat, No Shadow) */}
        <div className="max-w-6xl mx-auto flex items-center justify-center py-2 border-0 bg-transparent shadow-none">
          <Image
            src="/assets/map.svg"
            width={1200}
            height={600}
            alt="Where Golden Sun Exports Map"
            className="w-full h-auto object-contain max-h-[550px] shadow-none border-0"
            loading="lazy"
          />
        </div>

        {/* Destination Flags & Country Names Row */}
        <div className="max-w-5xl mx-auto space-y-6 pt-2">
          {/* Row 1: Netherlands, UK, Spain, Italy, Germany */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {destinationCountries.slice(0, 5).map((country) => (
              <div
                key={country.code}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
              >
                {country.flagSvg}
                <span className="font-serif font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#17C548] transition-colors">
                  {country.name}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2: Russia, Turkey, Saudi Arabia */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            {destinationCountries.slice(5).map((country) => (
              <div
                key={country.code}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
              >
                {country.flagSvg}
                <span className="font-serif font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#17C548] transition-colors">
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
