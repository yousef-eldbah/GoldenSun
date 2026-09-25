'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Send } from 'lucide-react';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import { Locale } from '@/types';

export function ExportCTASection({ currentLocale }: { currentLocale: Locale }) {
  return (
    <section className="py-8 sm:py-12 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0c3815] via-[#165023] to-[#0c3815] p-6 sm:p-8 text-white overflow-hidden shadow-lg border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="space-y-1.5 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              <LeafBadgeIcon className="w-5 h-4 text-[#f3ba2f]" />
              <span>Direct Farm Sourcing</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
              Ready to Secure Your Fresh Produce Supply?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-normal">
              Direct B2B export from certified Egyptian farms with cold-chain shipping.
            </p>
          </div>

          {/* Action Buttons: Catalog & Quick RFQ */}
          <div className="flex items-center gap-3 flex-wrap justify-center flex-shrink-0">
            <Link
              href={`/${currentLocale}/products`}
              className="px-5 py-2.5 bg-[#f3ba2f] hover:bg-[#e2aa22] text-[#0c3815] text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>Explore Products</span>
            </Link>

            <Link
              href={`/${currentLocale}/rfq`}
              className="px-5 py-2.5 bg-emerald-900/60 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl border border-emerald-400/30 hover:border-emerald-400/60 transition-all inline-flex items-center gap-2"
            >
              <span>Quick RFQ</span>
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
