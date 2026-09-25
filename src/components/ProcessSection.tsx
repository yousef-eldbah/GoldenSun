'use client';

import React from 'react';
import Image from 'next/image';
import { Locale } from '@/types';
import { LeafBadgeIcon } from '@/components/ui/LeafBadgeIcon';

const STAGES = [
  {
    stageNum: '01',
    title: 'Farm',
    description: 'Grown On Carefully Managed Golden Sun Farms, Using Sustainable Practices Suited To Each Crop And Season.',
    image: '/assets/Group1.png',
    imageFirst: false, // Text left, Image right
  },
  {
    stageNum: '02',
    title: 'Harvest',
    description: 'Hand-Picked At Peak Ripeness By Trained Teams, Timed Precisely For The Best Flavor And Shelf Life.',
    image: '/assets/gg.svg',
    imageFirst: true, // Image left, Text right
  },
  {
    stageNum: '03',
    title: 'Packing',
    description: 'Produce Is Carefully Packed In Ventilated Cartons Designed To Protect Quality Through Long-Distance Transport.',
    image: '/assets/Group3.png',
    imageFirst: false, // Text left, Image right
  },
  {
    stageNum: '04',
    title: 'Container Loading',
    description: 'Produce Is Loaded Into Temperature-Controlled Refrigerated Containers (Reefers) To Maintain The Cold Chain.',
    image: '/assets/image4.png',
    imageFirst: true, // Image left, Text right
  },
  {
    stageNum: '05',
    title: 'Delivery',
    description: 'Cartons Arrive At Their Destination And Are Handed Off To Distributors, Ready For Local Markets And Shelves.',
    image: '/assets/image5.png',
    imageFirst: false, // Text left, Image right
  },
];

const PIPELINE_STAGES = [
  { num: '01', title: 'Farm', desc: 'Sustainable Farming' },
  { num: '02', title: 'Harvest', desc: 'Peak Ripeness' },
  { num: '03', title: 'Washing', desc: 'Pure Sanitization' },
  { num: '04', title: 'Cooling', desc: 'Pre-Cooling Cold Chain' },
  { num: '05', title: 'Packing', desc: 'Ventilated Cartons' },
  { num: '06', title: 'Loading', desc: 'Reefer Monitoring' },
  { num: '07', title: 'Inspection', desc: 'Quality & Phytosanitary' },
  { num: '08', title: 'Delivery', desc: 'Global Ports Arrival' },
];

export function ProcessSection({ currentLocale }: { currentLocale: Locale }) {
  return (
    <section id="process" className="py-20 bg-white text-[#1b3e2b] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#17C548] text-xs font-bold uppercase tracking-wider">
            <LeafBadgeIcon className="w-4 h-4 text-[#17C548]" />
            <span>OUR EXPORT PROCESS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-serif text-[#1b3e2b] tracking-tight">
            From Farm To Your Door
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Every Shipment Moves Through Eight Carefully Controlled Stages, Built To Protect Freshness And Quality At Each Step.
          </p>

          {/* 8-Stage Overview Pipeline (Text-only without images) */}
          <div className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
              {PIPELINE_STAGES.map((s) => (
                <div
                  key={s.num}
                  className="bg-[#fafdfa] border border-[#e2efe1] hover:border-[#17C548] rounded-xl p-2.5 text-center transition-all duration-200 hover:shadow-sm"
                >
                  <span className="text-[10px] font-extrabold text-[#17C548] tracking-widest block">
                    STAGE {s.num}
                  </span>
                  <span className="text-xs font-bold text-[#1b3e2b] block mt-0.5 font-serif">
                    {s.title}
                  </span>
                  <span className="text-[10px] text-gray-500 block leading-tight mt-1">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stages Alternating Grid */}
        <div className="space-y-16 sm:space-y-24">
          {STAGES.map((stage) => (
            <div
              key={stage.stageNum}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Text Column */}
              <div
                className={`lg:col-span-5 space-y-4 ${
                  stage.imageFirst ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#17C548] text-xs font-bold uppercase tracking-wider">
                  <LeafBadgeIcon className="w-4 h-4 text-[#17C548]" />
                  <span>STAGE {stage.stageNum}</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black font-serif text-[#1b3e2b] tracking-tight">
                  {stage.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-md">
                  {stage.description}
                </p>
              </div>

              {/* Image Graphic Column */}
              <div
                className={`lg:col-span-7 ${
                  stage.imageFirst ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="relative w-full rounded-[28px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                  <Image
                    src={stage.image}
                    alt={`Stage ${stage.stageNum}: ${stage.title}`}
                    width={700}
                    height={450}
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
