'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Check } from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import { Locale } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function SeasonCalendar({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('calendar');

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Card variant="elevated" padding="lg" className="space-y-6 bg-white border border-[var(--sg-sand)] shadow-xs">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--sg-sand)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--sg-forest)] text-white flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5 text-[var(--sg-gold-light)]" />
          </div>
          <div>
            <Badge variant="gold" size="sm">Annual Timeline</Badge>
            <h3 className="text-xl font-bold text-[var(--sg-charcoal)]">{t('title')}</h3>
            <p className="text-xs text-[var(--sg-warm-gray)]">{t('subtitle')}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--sg-forest)]" />
            <span className="text-[var(--sg-charcoal)]">{t('peak_season')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--sg-sand)]" />
            <span className="text-[var(--sg-warm-gray)]">{t('off_season')}</span>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-[var(--sg-sand)] text-[11px] font-bold uppercase tracking-wider text-[var(--sg-warm-gray)]">
              <th className="py-3 px-4 w-48">{t('product')}</th>
              {monthLabels.map((m) => (
                <th key={m} className="py-3 px-2 text-center">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sg-sand)] text-xs">
            {mockProducts.map((product) => {
              const productName = product.translations[currentLocale]?.name || product.translations.en.name;
              return (
                <tr key={product.id} className="hover:bg-[var(--sg-cream)] transition-colors">
                  <td className="py-3 px-4 font-bold text-[var(--sg-charcoal)]">
                    {productName}
                  </td>
                  {months.map((m) => {
                    const isAvailable = product.seasonality[m];
                    return (
                      <td key={m} className="py-3 px-2 text-center">
                        {isAvailable ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--sg-forest)] text-white font-bold text-[10px] shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-[var(--sg-stone)]/40" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Official Season Disclaimer Note */}
      <div className="pt-2 border-t border-[var(--sg-sand)] text-xs text-gray-500 leading-relaxed">
        <p>
          <strong className="text-[#1b3e2b]">Note:</strong> This calendar is designed as an initial guide for buyers. Availability may vary according to season, crop plan, and customer specifications. Final export programs and volumes are confirmed according to actual harvest conditions.
        </p>
      </div>

    </Card>
  );
}
