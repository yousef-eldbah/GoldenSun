'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';

interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
  farmerPhotoUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    quote:
      '“Diversity is a cornerstone of our farming philosophy. We carefully select a wide range of crops, ensuring a varied and balanced ecosystem. This not only helps to naturally deter pests and diseases but also promotes soil health by varying the nutrient demands of different plants.”',
    authorName: 'Muhammed Saeed',
    authorRole: 'Customer of our shop',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    farmerPhotoUrl: '/assets/feedback.jpeg',
  },
  {
    id: 'test-2',
    quote:
      '“Golden Sun has consistently delivered top-tier Egyptian Valencia oranges and fresh garlic to our European distribution centers. Their cold-chain integrity and packing accuracy are second to none.”',
    authorName: 'Hans Weber',
    authorRole: 'Import Director - Hamburg',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    farmerPhotoUrl: '/assets/feedback.jpeg',
  },
  {
    id: 'test-3',
    quote:
      '“Working with Golden Sun for IQF strawberries and pomegranates has transformed our seasonal supply chain. Highly reliable schedules, fast phytosanitary clearance, and premium quality.”',
    authorName: 'Carlos Mendoza',
    authorRole: 'Fresh Produce Buyer - Madrid',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    farmerPhotoUrl: '/assets/feedback.jpeg',
  },
];

export function TestimonialsSection({ currentLocale }: { currentLocale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white text-gray-900 border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="sg-section-header">
          <div className="sg-section-badge">
            <LeafBadgeIcon className="w-4 h-4 text-[#228731]" />
            <span>Client Testimonials</span>
          </div>

          <h2 className="sg-section-title">
            <span className="sg-section-title-dark">Our Importers </span>
            <span className="sg-section-title-green">Feedback & Trust</span>
          </h2>

          <p className="sg-section-subtitle">
            Real experiences from our global produce partners and international supermarket distribution networks.
          </p>
        </div>

        {/* Testimonial Card Container */}
        <div className="max-w-6xl mx-auto rounded-[32px] bg-[#EBF5EE] p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 relative overflow-hidden shadow-xs">
          
          {/* Left Side: Farmer Image */}
          <div className="md:w-5/12 overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm relative min-h-[300px] sm:min-h-[380px]">
            <Image
              src={current.farmerPhotoUrl}
              alt={current.authorName}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-top transition-all duration-700 hover:scale-105"
              priority
            />
          </div>

          {/* Right Side: Quote & Author Details */}
          <div className="md:w-7/12 flex flex-col justify-between p-2 sm:p-4 md:py-6 space-y-6 relative">
            
            {/* Quote Text */}
            <p className="italic text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-sans">
              {current.quote}
            </p>

            {/* Bottom Row: Author info + Green Leaf Quote Icon */}
            <div className="flex items-end justify-between pt-4">
              
              {/* Author Avatar & Title */}
              <div className="flex items-center gap-3">
                <img
                  src={current.avatarUrl}
                  alt={current.authorName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs"
                />
                <div>
                  <span className="text-xs text-gray-600 block font-sans">
                    {current.authorRole}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base font-sans">
                    {current.authorName}
                  </h3>
                </div>
              </div>

              {/* Decorative Green Leaves Quotation Marks */}
              <div className="flex items-center gap-1.5 opacity-90 shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left Quote Mark */}
                  <g clipPath="url(#quote-left)">
                    <path d="M12 44C6.5 44 2 39.5 2 34C2 24 10 12 24 8L26 12C16 16 12 24 12 30H24V44H12Z" fill="url(#leaf-grad-1)"/>
                  </g>
                  {/* Right Quote Mark */}
                  <g clipPath="url(#quote-right)">
                    <path d="M42 44C36.5 44 32 39.5 32 34C32 24 40 12 54 8L56 12C46 16 42 24 42 30H54V44H42Z" fill="url(#leaf-grad-2)"/>
                  </g>
                  <defs>
                    <linearGradient id="leaf-grad-1" x1="2" y1="8" x2="26" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#17C548"/>
                      <stop offset="1" stopColor="#0E782A"/>
                    </linearGradient>
                    <linearGradient id="leaf-grad-2" x1="32" y1="8" x2="56" y2="44" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#17C548"/>
                      <stop offset="1" stopColor="#0E782A"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setActiveIndex(i)}
                  className="p-2 flex items-center justify-center cursor-pointer min-w-[36px] min-h-[36px]"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <span
                    className={`h-2.5 rounded-full transition-all block ${
                      i === activeIndex
                        ? 'w-6 bg-[#15803d]'
                        : 'w-2.5 bg-emerald-200 hover:bg-emerald-300'
                    }`}
                  />
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
