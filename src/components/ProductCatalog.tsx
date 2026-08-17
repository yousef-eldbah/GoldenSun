'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Leaf, Sun, CheckCircle2, Plus, ArrowRight, Sparkles, ShieldCheck, Sprout } from 'lucide-react';
import { useRFQBasket } from '@/context/RFQBasketContext';
import { Product, Locale } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useProducts } from '@/hooks/useProducts';

export function ProductCatalog({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('products');
  const { addItem } = useRFQBasket();
  const { products: liveProducts, isLoading } = useProducts();

  const [activeTab, setActiveTab] = useState<'all' | 'cat-vegetables' | 'cat-fruits'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Use ONLY live products from Database (Supabase) and Admin Dashboard
  const allProducts = liveProducts || [];

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 24);
    const prodName = product.translations[currentLocale]?.name || product.translations.en?.name || product.slug;
    setToastMessage(`Added 24 MT of ${prodName} to RFQ Basket!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Group products into Vegetables and Fruits (Vegetables FIRST)
  const isVegetable = (p: Product) => {
    const cat = (p.category_id || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase();
    return (
      cat === 'cat-vegetables' ||
      cat === '00000000-0000-0000-0000-000000000002' ||
      cat.includes('veg') ||
      slug.includes('broccoli') ||
      slug.includes('garlic') ||
      slug.includes('potato') ||
      slug.includes('onion')
    );
  };

  const vegetableProducts = allProducts.filter(isVegetable);
  const fruitProducts = allProducts.filter((p) => !isVegetable(p));

  const renderProductCard = (product: Product) => {
    const translation = product.translations[currentLocale] || product.translations.en || {
      name: product.slug,
      description: '',
    };
    const coverImage = product.images.find((img) => img.is_cover)?.image_url || product.images[0]?.image_url || '';

    return (
      <div
        key={product.id}
        className="group/card relative bg-white rounded-[32px] border border-emerald-900/10 p-5 sm:p-6 shadow-[0_10px_30px_-15px_rgba(37,135,70,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(37,135,70,0.22)] hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
      >
        <div>
          {/* Cover Image Container */}
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden mb-5 bg-[#f0f4ee]">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={translation.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-emerald-800/30">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            )}
            {/* Quick Add Button */}
            <button
              onClick={(e) => handleQuickAdd(product, e)}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-[#258746] text-[#1b3e2b] hover:text-white shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-20"
              title="Add 1 Reefer Container (24 MT) to Quote"
              aria-label="Add to Quote"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-xl text-[#1a3826] group-hover/card:text-[#258746] transition-colors leading-snug">
              {translation.name}
            </h3>

            {translation.description && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {translation.description}
              </p>
            )}

            {/* Quick Spec Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.hs_code && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                  HS: {product.hs_code}
                </span>
              )}
              {product.storage_temp && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                  {product.storage_temp}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer Features Row */}
        <div className="border-t border-gray-100 pt-3.5 mt-2">
          <div className="flex items-center justify-between text-[10px] font-semibold text-gray-600 px-1">
            <span className="flex items-center gap-1">
              <Leaf className="w-3 h-3 text-[#258746]" />
              100% Natural
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#258746]" />
              Premium Quality
            </span>
            <span className="flex items-center gap-1">
              <Sprout className="w-3 h-3 text-[#258746]" />
              Freshly Harvested
            </span>
          </div>

          {/* Action Button */}
          <div className="mt-3">
            <Link
              href={`/${currentLocale}/products/${product.slug}`}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50/80 group-hover/card:bg-[#258746] text-[#258746] group-hover/card:text-white text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{t('view_details') || 'Technical Specs & RFQ'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="catalog" className="py-20 bg-[#fafdfa] text-[var(--sg-charcoal)] relative border-b border-[var(--sg-sand)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b3e2b] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 border border-emerald-500/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 text-[#1b4327] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            Direct Egyptian Farms
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#1a3826] tracking-tight font-serif">
            Our <span className="text-[#258746]">Organic</span> Products
          </h2>

          <p className="text-sm sm:text-base text-gray-600 font-medium max-w-2xl mx-auto">
            Grade A fresh fruits and frozen vegetables harvested from solar-rich farms. Premium Quality, Naturally Fresh.
          </p>
        </div>

        {/* Category Filter Pills (Centered) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-7 py-2.5 rounded-full text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#258746] text-white shadow-lg shadow-emerald-700/25 scale-105'
                : 'border-2 border-[#258746] text-[#258746] hover:bg-[#258746] hover:text-white'
            }`}
          >
            {t('all') || 'All'}
          </button>

          <button
            onClick={() => setActiveTab('cat-vegetables')}
            className={`px-7 py-2.5 rounded-full text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'cat-vegetables'
                ? 'bg-[#258746] text-white shadow-lg shadow-emerald-700/25 scale-105'
                : 'border-2 border-[#258746] text-[#258746] hover:bg-[#258746] hover:text-white'
            }`}
          >
            {t('vegetables') || 'Vegetables'}
          </button>

          <button
            onClick={() => setActiveTab('cat-fruits')}
            className={`px-7 py-2.5 rounded-full text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'cat-fruits'
                ? 'bg-[#258746] text-white shadow-lg shadow-emerald-700/25 scale-105'
                : 'border-2 border-[#258746] text-[#258746] hover:bg-[#258746] hover:text-white'
            }`}
          >
            {t('fruits') || 'Fruits'}
          </button>
        </div>

        {/* Dynamic Database Content or Empty State */}
        {isLoading ? (
          <div className="py-16 text-center text-sm font-medium text-emerald-800 animate-pulse">
            Loading fresh agricultural produce...
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-emerald-300 max-w-md mx-auto">
            <Leaf className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">No Produce Listed Yet</h3>
            <p className="text-xs text-gray-500 mb-4">
              Products added from the database will appear dynamically here.
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#258746] text-white text-xs font-bold shadow-sm hover:bg-[#1b6a36] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
          </div>
        ) : (
          <>
            {/* SECTION 1: VEGETABLES (Displayed FIRST) */}
            {(activeTab === 'all' || activeTab === 'cat-vegetables') && vegetableProducts.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 text-xl sm:text-2xl font-black text-[#1b4327]">
                  <Leaf className="w-6 h-6 text-[#258746] fill-[#258746]" />
                  <span>Vegetables</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {vegetableProducts.map(renderProductCard)}
                </div>
              </div>
            )}

            {/* SECTION 2: FRUITS (Displayed SECOND) */}
            {(activeTab === 'all' || activeTab === 'cat-fruits') && fruitProducts.length > 0 && (
              <div className="space-y-6 pt-8">
                <div className="flex items-center gap-2 text-xl sm:text-2xl font-black text-[#1b4327]">
                  <Leaf className="w-6 h-6 text-[#258746] fill-[#258746]" />
                  <span>Fruits</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {fruitProducts.map(renderProductCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
