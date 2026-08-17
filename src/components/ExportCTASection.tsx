'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Sprout } from 'lucide-react';
import { Locale } from '@/types';

export function ExportCTASection({ currentLocale }: { currentLocale: Locale }) {
  return (
    <section className="py-16 sm:py-20 bg-[#fafdfa]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[36px] bg-gradient-to-br from-[#1b3e2b] via-[#215337] to-[#122e1f] p-8 sm:p-14 text-white overflow-hidden shadow-2xl border border-emerald-500/20">
          
          {/* Ambient Lighting Background Shapes */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8 text-center max-w-3xl mx-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-widest border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
              <span>Direct Farm Sourcing & Export</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
              Ready to Secure Your Fresh Produce Supply?
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-emerald-100/90 font-medium leading-relaxed max-w-2xl mx-auto">
              Direct sourcing from certified farms in Sadat City & Nile Delta. Guaranteed cold chain logistics, custom carton packaging, and phytosanitary clearance within 24 hours.
            </p>

            {/* Value Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-emerald-500/20 text-xs font-bold text-emerald-200">
              <div className="flex items-center justify-center gap-2 bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/20">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>24H Proforma Response</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/20">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Custom Box Calibration</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-emerald-900/40 p-3 rounded-2xl border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>GLOBALG.A.P. & ISO 22000</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
              <Link
                href={`/${currentLocale}/rfq`}
                className="w-full sm:w-auto px-10 py-4 bg-[#258746] hover:bg-[#1b6a36] text-white text-base sm:text-lg font-extrabold rounded-2xl shadow-xl shadow-emerald-950/40 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Request Commercial Proforma (RFQ)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
