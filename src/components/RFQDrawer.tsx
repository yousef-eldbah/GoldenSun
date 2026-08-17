'use client';

import React from 'react';
import Link from 'next/link';
import { X, CheckCircle2, ArrowRight, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useRFQBasket } from '@/context/RFQBasketContext';
import { Locale } from '@/types';

export function RFQDrawer({ currentLocale }: { currentLocale: Locale }) {
  const {
    items,
    removeItem,
    isBasketOpen,
    setIsBasketOpen,
    totalTonnage,
  } = useRFQBasket();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Popup Toast Card */}
      {isBasketOpen && (
        <div className="w-80 sm:w-96 bg-[#1b3e2b] text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/30 space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-emerald-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#258746]" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Your Quote List ({items.length})</h4>
            </div>

            <button
              onClick={() => setIsBasketOpen(false)}
              className="p-1 text-emerald-300/70 hover:text-white hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List (max 3 items scrollable) */}
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {items.map((item) => (
              <div key={item.product_id} className="flex items-center justify-between bg-emerald-900/40 p-2 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-white block">{item.product_name}</span>
                  <span className="text-[10px] text-emerald-200/80">{item.quantity_tons} MT</span>
                </div>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="p-1 text-emerald-400/60 hover:text-rose-400 cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="text-[11px] text-emerald-200/80 bg-emerald-900/60 px-3 py-1.5 rounded-xl flex items-center justify-between border border-emerald-500/20">
            <span>Total Weight:</span>
            <span className="font-extrabold text-amber-400">{totalTonnage} Metric Tons</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {/* Add More Redirects to All Products Page */}
            <Link
              href={`/${currentLocale}/products`}
              onClick={() => setIsBasketOpen(false)}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-600/30 inline-flex items-center justify-center gap-1 transition-all cursor-pointer text-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More</span>
            </Link>

            {/* Request Quote Redirects to RFQ Form Page */}
            <Link
              href={`/${currentLocale}/rfq`}
              onClick={() => setIsBasketOpen(false)}
              className="flex-1 py-2 px-3 rounded-xl bg-[#258746] hover:bg-[#1b6a36] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 hover:scale-[1.02] transition-all cursor-pointer text-center"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Persistent Floating Circular Button */}
      <button
        onClick={() => setIsBasketOpen(!isBasketOpen)}
        className="relative w-14 h-14 rounded-full bg-[#1b3e2b] hover:bg-[#258746] text-amber-400 border-2 border-emerald-500/40 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
        aria-label="Toggle Quote Basket"
      >
        <ShoppingBag className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-emerald-950 font-black text-xs flex items-center justify-center shadow-lg border-2 border-[#1b3e2b] animate-bounce">
          {items.length}
        </span>
      </button>
    </div>
  );
}
