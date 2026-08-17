'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Plus, ArrowRight, X } from 'lucide-react';
import { useRFQBasket } from '@/context/RFQBasketContext';
import { Locale } from '@/types';

export function FloatingRFQBar({ currentLocale }: { currentLocale: Locale }) {
  const { items, totalTonnage, setIsBasketOpen } = useRFQBasket();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-[#1b3e2b] text-white rounded-full p-2.5 sm:p-3 shadow-2xl border border-emerald-500/30 flex items-center justify-between gap-3 backdrop-blur-md">
        
        {/* Left Info Badge */}
        <button
          onClick={() => setIsBasketOpen(true)}
          className="flex items-center gap-3 pl-3 text-left group cursor-pointer"
        >
          <div className="relative w-10 h-10 rounded-full bg-emerald-700/80 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-[#1b3e2b] font-black text-[11px] flex items-center justify-center shadow-xs">
              {items.length}
            </span>
          </div>
          <div className="hidden xs:block">
            <div className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition-colors">
              {items.length} Product{items.length > 1 ? 's' : ''} Selected
            </div>
            <div className="text-[11px] text-emerald-200/90 font-medium">
              Total Weight: <span className="font-extrabold text-amber-400">{totalTonnage} MT</span>
            </div>
          </div>
        </button>

        {/* Right CTA Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Add More Products Button */}
          <Link
            href={`/${currentLocale}/products`}
            className="px-3 sm:px-4 py-2 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-600/40 inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More</span>
          </Link>

          {/* Proceed to Quote Button */}
          <Link
            href={`/${currentLocale}/rfq`}
            className="px-4 sm:px-6 py-2.5 rounded-full bg-[#258746] hover:bg-[#1b6a36] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-lg shadow-emerald-950/40 hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Proceed to Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
