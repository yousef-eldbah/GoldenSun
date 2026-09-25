'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Plus, Minus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';
import { Product, Locale } from '@/types';
import { useRFQBasket } from '@/context/RFQBasketContext';

interface ProductDetailViewProps {
  product: Product;
  currentLocale: Locale;
}

const MONTH_KEYS = [
  { key: 'jan', label: 'Jan' },
  { key: 'feb', label: 'Feb' },
  { key: 'mar', label: 'Mar' },
  { key: 'apr', label: 'Apr' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' },
  { key: 'aug', label: 'Aug' },
  { key: 'sep', label: 'Sep' },
  { key: 'oct', label: 'Oct' },
  { key: 'nov', label: 'Nov' },
  { key: 'dec', label: 'Dec' },
];

export function ProductDetailView({ product, currentLocale }: ProductDetailViewProps) {
  const t = useTranslations('products');
  const { addItem } = useRFQBasket();

  const translation = product.translations[currentLocale] || product.translations.en;
  const sizesList = translation.sizes && translation.sizes.length > 0 ? translation.sizes : ['Standard Box'];
  const images = (product.images || [])
    .map((img) => (typeof img === 'string' ? img : img.image_url))
    .filter((url): url is string => Boolean(url && !url.startsWith('blob:')));


  // Interactive states
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedBoxSize, setSelectedBoxSize] = useState<string>(
    sizesList[1] || sizesList[0] || 'Standard Box'
  );
  const [quantity, setQuantity] = useState<number>(5);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product, quantity);
    router.push(`/${currentLocale}/rfq`);
  };

  // Determine monthly season status (peak, available, limited, off)
  const getMonthStatus = (mKey: string): 'peak' | 'available' | 'limited' | 'off' => {
    if (product.season_status && product.season_status[mKey]) {
      return product.season_status[mKey];
    }
    // Fallback based on seasonality boolean map
    if (product.seasonality[mKey]) return 'available';
    return 'off';
  };

  return (
    <main className="min-h-screen bg-[#fafcf9] text-[#1b3e2b] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b3e2b] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 border border-emerald-500/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-between text-xs font-semibold text-gray-500">
          <Link
            href={`/${currentLocale}`}
            className="inline-flex items-center gap-1.5 text-[#258746] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <div className="flex items-center gap-2 text-gray-400">
            <Link href={`/${currentLocale}`} className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <span className="text-[#1b3e2b] font-bold">{translation.name}</span>
          </div>
        </nav>

        {/* TOP SECTION: Gallery & Main Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Display Image */}
            <div className="relative aspect-square w-full rounded-[32px] overflow-hidden bg-white shadow-xl border border-gray-100 p-4 flex items-center justify-center group">
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[selectedImageIndex] || images[0]}
                    alt={translation.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20">
                      Photo {selectedImageIndex + 1} of {images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-emerald-900/30 gap-2">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span className="text-sm font-semibold">No Image Available</span>
                </div>
              )}
            </div>

            {/* Thumbnails Grid (only when more than 1 image) */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:gap-4 pt-1">
                {images.slice(0, 4).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square w-full rounded-2xl bg-[#f5f1e8] p-1 border-2 transition-all cursor-pointer overflow-hidden shadow-xs ${
                      selectedImageIndex === idx
                        ? 'border-[#258746] ring-4 ring-[#258746]/20 scale-[1.03] shadow-md'
                        : 'border-gray-200/80 opacity-75 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                    aria-label={`Select photo ${idx + 1}`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${translation.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 15vw"
                      className="object-cover rounded-xl"
                    />
                    {selectedImageIndex === idx && (
                      <div className="absolute inset-0 bg-[#258746]/10 rounded-xl border border-[#258746] pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title & Controls */}
          <div className="lg:col-span-6 space-y-6 pt-2">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#228731] uppercase tracking-wider bg-[#eef7ed] px-3 py-1.5 rounded-full border border-[#228731]/15">
              <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
              <span>{product.category_id === 'cat-fruits' ? 'Fresh Fruits' : 'Fresh Vegetables'}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-black font-serif text-[#1b3e2b] tracking-tight leading-tight">
              {translation.name}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
              {translation.description}
            </p>

            {/* Box Size Picker */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700">
                Box Size
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {sizesList.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedBoxSize(size)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                      selectedBoxSize === size
                        ? 'bg-[#258746] text-white shadow-md shadow-emerald-700/20 scale-105'
                        : 'border-2 border-[#258746]/40 text-[#258746] hover:border-[#258746] hover:bg-[#258746]/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700">
                Quantity (Tons)
              </label>
              <div className="inline-flex items-center border-2 border-[#258746]/40 rounded-full px-3 py-1.5 bg-white shadow-xs gap-5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full bg-emerald-100/70 hover:bg-[#258746] text-[#258746] hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-extrabold text-[#1b3e2b] min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-full bg-emerald-100/70 hover:bg-[#258746] text-[#258746] hover:text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#258746] hover:bg-[#1b6a36] text-white text-base sm:text-lg font-extrabold rounded-2xl shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Request Quote Now</span>
              </button>
            </div>
          </div>
        </div>

        <hr className="border-emerald-900/10 my-8" />

        {/* SECTION 2: Product Specifications Dashboard */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#1b3e2b]">
                Product Specifications
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Official Export Specifications & Cold Chain Logistics Parameters
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-[#1b3e2b] text-xs font-bold flex items-center gap-1.5 border border-emerald-300/40">
              <ShieldCheck className="w-4 h-4 text-[#258746]" />
              <span>EU, UK & GCC Export Compliant</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CARD 1: Origin & Classification */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs hover:shadow-lg transition-all space-y-4 relative overflow-hidden group">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#258746] flex items-center justify-center font-bold">
                  🌐
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1b3e2b] uppercase tracking-wide">
                    Origin & Classification
                  </h3>
                  <span className="text-[11px] text-gray-400 font-semibold">Geographical & Crop Data</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {translation.origin && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Origin</span>
                    <span className="font-extrabold text-[#1b3e2b] flex items-center gap-1">
                      🇪🇬 {translation.origin}
                    </span>
                  </div>
                )}

                {translation.varieties && translation.varieties.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-gray-50/80 space-y-1.5">
                    <span className="block font-bold text-gray-500 uppercase tracking-wider text-[10px]">Available Varieties</span>
                    <div className="flex flex-wrap gap-1.5">
                      {translation.varieties.map((v) => (
                        <span key={v} className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-[#1b3e2b] font-bold text-[11px]">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : translation.variety ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Variety</span>
                    <span className="font-extrabold text-[#1b3e2b]">
                      {translation.variety}
                    </span>
                  </div>
                ) : null}

                {translation.grade && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Grade</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1b3e2b] font-black text-[11px]">
                      {translation.grade}
                    </span>
                  </div>
                )}

                {product.hs_code && product.hs_code.trim() !== '' && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">HS Code</span>
                    <span className="font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {product.hs_code}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: Physical & Quality Parameters */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs hover:shadow-lg transition-all space-y-4 relative overflow-hidden group">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  🧪
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1b3e2b] uppercase tracking-wide">
                    Quality Parameters
                  </h3>
                  <span className="text-[11px] text-gray-400 font-semibold">Physical & Harvest Specs</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {product.brix_level && product.brix_level !== 'N/A' && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Brix / Sweetness</span>
                    <span className="font-extrabold text-[#1b3e2b]">
                      {product.brix_level}
                    </span>
                  </div>
                )}

                {translation.average_diameter && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Average Diameter</span>
                    <span className="font-extrabold text-[#1b3e2b]">
                      {translation.average_diameter}
                    </span>
                  </div>
                )}

                {translation.color && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Color</span>
                    <span className="font-extrabold text-[#1b3e2b]">
                      {translation.color}
                    </span>
                  </div>
                )}

                {translation.harvest_method && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Harvest Method</span>
                    <span className="font-extrabold text-[#1b3e2b] flex items-center gap-1">
                      🌱 {translation.harvest_method}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 3: Cold Chain & Packaging */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-xs hover:shadow-lg transition-all space-y-4 relative overflow-hidden group lg:col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                  ❄️
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1b3e2b] uppercase tracking-wide">
                    Cold Chain & Packaging
                  </h3>
                  <span className="text-[11px] text-gray-400 font-semibold">Reefer Shipping Specs</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {product.storage_temp && (
                  <div className="p-2.5 rounded-xl bg-cyan-50/50 border border-cyan-100">
                    <span className="block font-bold text-cyan-800 uppercase tracking-wider text-[10px] mb-0.5">
                      Storage Temperature
                    </span>
                    <span className="font-black text-[#1b3e2b]">
                      {product.storage_temp}
                    </span>
                  </div>
                )}

                {translation.shelf_life && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Shelf Life</span>
                    <span className="font-extrabold text-[#1b3e2b]">
                      {translation.shelf_life}
                    </span>
                  </div>
                )}

                {translation.packaging_options && translation.packaging_options.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-gray-50/80 space-y-1.5">
                    <span className="block font-bold text-gray-500 uppercase tracking-wider text-[10px]">Packaging Options</span>
                    <div className="flex flex-wrap gap-1.5">
                      {translation.packaging_options.map((pkg) => (
                        <span key={pkg} className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[#1b3e2b] font-bold text-[10px]">
                          📦 {pkg}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : product.container_rules && product.container_rules.length > 0 ? (
                  <div className="p-2.5 rounded-xl bg-gray-50/80">
                    <span className="block font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-0.5">
                      Packaging Type
                    </span>
                    <span className="font-extrabold text-[#1b3e2b]">
                      {product.container_rules[0]?.package_type}
                    </span>
                  </div>
                ) : null}

                {product.certifications && product.certifications.length > 0 && (
                  <div className="pt-1">
                    <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">
                      Export Certifications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#1b3e2b] border border-emerald-200/60 text-[10px] font-black"
                        >
                          ✓ {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-emerald-900/10 my-8" />

        {/* SECTION 3: Availability By Season */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#1b3e2b]">
                Product Calendar & Availability
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                Availability may vary according to season, crop plan and customer specifications.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-relaxed font-medium">
              <strong>Note:</strong> This calendar is designed as an initial guide for buyers. Final programs and volumes are confirmed according to harvest conditions and export schedules.
            </div>
            {/* Mobile Scroll Hint */}
            <div className="flex items-center justify-between sm:hidden text-[11px] text-gray-400 font-medium px-1">
              <span>Monthly Export Cycle</span>
              <span className="text-[#228731] font-semibold flex items-center gap-1">Swipe to view all months →</span>
            </div>

            {/* Bar Chart Visualizer with smooth horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="flex items-end justify-between gap-2.5 sm:gap-4 h-44 pt-6 pb-2 px-1 min-w-[540px] sm:min-w-0 border-b border-gray-100">
                {MONTH_KEYS.map(({ key, label }) => {
                  const status = getMonthStatus(key);

                  // Determine height and background color based on month status
                  let barHeightClass = 'h-8';
                  let barBgClass = 'bg-[#eaefe9]'; // Out of season neutral

                  if (status === 'peak') {
                    barHeightClass = 'h-36';
                    barBgClass = 'bg-[#1b3e2b]'; // Dark forest green
                  } else if (status === 'available') {
                    barHeightClass = 'h-28';
                    barBgClass = 'bg-[#548c67]'; // Medium green
                  } else if (status === 'limited') {
                    barHeightClass = 'h-16';
                    barBgClass = 'bg-[#a8c8b2]'; // Sage light green
                  }

                  return (
                    <div key={key} className="flex-1 min-w-[34px] flex flex-col items-center gap-2 group cursor-pointer">
                      {/* Bar */}
                      <div className="w-full max-w-[42px] flex items-end justify-center h-36">
                        <div
                          className={`w-full rounded-2xl transition-all duration-500 group-hover:opacity-90 group-hover:scale-y-105 origin-bottom ${barHeightClass} ${barBgClass}`}
                          title={`${label}: ${status.toUpperCase()}`}
                        />
                      </div>
                      {/* Month Label */}
                      <span className="text-xs font-extrabold text-gray-700">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend Row */}
            <div className="flex items-center justify-start gap-6 flex-wrap text-xs font-extrabold text-gray-700 pt-2 px-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-[#1b3e2b]" />
                <span>Peak</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-[#548c67]" />
                <span>Available</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-[#a8c8b2]" />
                <span>Limited</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-[#eaefe9]" />
                <span>Out Of Season</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
