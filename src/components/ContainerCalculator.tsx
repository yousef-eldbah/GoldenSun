'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, Package, Truck, Plus, CheckCircle2, ArrowRight } from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import { useRFQBasket } from '@/context/RFQBasketContext';
import { Product, Locale, ContainerRule } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ContainerCalculatorProps {
  currentLocale: Locale;
  initialProducts?: Product[];
}

export function ContainerCalculator({ currentLocale, initialProducts }: ContainerCalculatorProps) {
  const t = useTranslations('calculator');
  const { addItem } = useRFQBasket();

  const productsList = initialProducts && initialProducts.length > 0 ? initialProducts : mockProducts;

  const [selectedProductId, setSelectedProductId] = useState<string>(productsList[0]?.id || mockProducts[0].id);
  const [containerType, setContainerType] = useState<'40ft' | '20ft'>('40ft');
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number>(0);
  const [palletCount, setPalletCount] = useState<number>(20);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const defaultFallbackRule: ContainerRule = {
    id: 'default-cr',
    package_type: 'Standard Export Carton',
    net_weight_kg: 10,
    gross_weight_kg: 10.5,
    cartons_per_pallet: 100,
    pallets_per_40ft_reefer: 20,
    pallets_per_20ft_reefer: 10,
  };

  const selectedProduct = productsList.find((p) => p.id === selectedProductId) || productsList[0] || mockProducts[0];
  const containerRules = selectedProduct.container_rules && selectedProduct.container_rules.length > 0
    ? selectedProduct.container_rules
    : [defaultFallbackRule];
  const currentRule: ContainerRule = containerRules[selectedRuleIndex] || containerRules[0] || defaultFallbackRule;

  const maxPallets = containerType === '40ft' ? currentRule.pallets_per_40ft_reefer : currentRule.pallets_per_20ft_reefer;

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    setSelectedRuleIndex(0);
    const prod = productsList.find((p) => p.id === prodId);
    if (prod && prod.container_rules && prod.container_rules.length > 0) {
      setPalletCount(containerType === '40ft' ? prod.container_rules[0].pallets_per_40ft_reefer : prod.container_rules[0].pallets_per_20ft_reefer);
    } else {
      setPalletCount(containerType === '40ft' ? 20 : 10);
    }
  };

  const handleContainerTypeChange = (type: '40ft' | '20ft') => {
    setContainerType(type);
    setPalletCount(type === '40ft' ? currentRule.pallets_per_40ft_reefer : currentRule.pallets_per_20ft_reefer);
  };

  const totalCartons = palletCount * currentRule.cartons_per_pallet;
  const totalNetWeightKg = totalCartons * currentRule.net_weight_kg;
  const totalGrossWeightKg = totalCartons * currentRule.gross_weight_kg;

  const totalNetWeightTons = Number((totalNetWeightKg / 1000).toFixed(2));
  const totalGrossWeightTons = Number((totalGrossWeightKg / 1000).toFixed(2));
  const utilizationPercentage = Math.min(100, Math.round((palletCount / maxPallets) * 100));

  const handleAddToRFQ = () => {
    addItem(selectedProduct, totalNetWeightTons, currentRule.package_type);
    setToastMessage(`Added ${totalNetWeightTons} MT of ${selectedProduct.translations.en.name} (${containerType} Reefer) to RFQ Basket!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <Card variant="elevated" padding="lg" className="space-y-8 bg-white border border-[var(--sg-sand)] shadow-md">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--sg-forest)] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[var(--sg-gold-light)] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Tool Header */}
      <div className="flex items-center gap-4 border-b border-[var(--sg-sand)] pb-6">
        <div className="w-12 h-12 rounded-xl bg-[var(--sg-forest)] text-white flex items-center justify-center font-black shadow-sm">
          <Calculator className="w-6 h-6 text-[var(--sg-gold-light)]" />
        </div>
        <div>
          <Badge variant="gold" size="sm">Export Logistics</Badge>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--sg-charcoal)]">{t('title')}</h2>
          <p className="text-xs text-[var(--sg-warm-gray)]">{t('subtitle')}</p>
        </div>
      </div>

      {/* Form Controls & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Select Product */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[var(--sg-charcoal)] uppercase tracking-wider">
              1. Select Export Produce
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full rounded-lg bg-[var(--sg-cream)] border border-[var(--sg-sand)] px-4 py-3 text-sm text-[var(--sg-charcoal)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--sg-forest)]/30 focus:border-[var(--sg-forest)] cursor-pointer"
            >
              {productsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.translations[currentLocale]?.name || p.translations.en?.name || p.slug} {p.hs_code ? `(HS ${p.hs_code})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Select Container Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[var(--sg-charcoal)] uppercase tracking-wider">
              2. Reefer Container Spec
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleContainerTypeChange('40ft')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  containerType === '40ft'
                    ? 'bg-[var(--sg-forest)] border-[var(--sg-forest)] text-white shadow-xs'
                    : 'bg-[var(--sg-cream)] border-[var(--sg-sand)] text-[var(--sg-charcoal)] hover:bg-[var(--sg-sand)]'
                }`}
              >
                <Truck className="w-4 h-4 text-[var(--sg-gold-light)]" />
                <span>40ft High Cube (20 Pallets)</span>
              </button>

              <button
                type="button"
                onClick={() => handleContainerTypeChange('20ft')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  containerType === '20ft'
                    ? 'bg-[var(--sg-forest)] border-[var(--sg-forest)] text-white shadow-xs'
                    : 'bg-[var(--sg-cream)] border-[var(--sg-sand)] text-[var(--sg-charcoal)] hover:bg-[var(--sg-sand)]'
                }`}
              >
                <Truck className="w-4 h-4 text-[var(--sg-gold-light)]" />
                <span>20ft Standard (10 Pallets)</span>
              </button>
            </div>
          </div>

          {/* Packaging Option Selector */}
          {containerRules.length > 1 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--sg-charcoal)] uppercase tracking-wider">
                3. Packaging Type
              </label>
              <div className="space-y-2">
                {containerRules.map((rule, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedRuleIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                      selectedRuleIndex === idx
                        ? 'bg-[var(--sg-forest)]/10 border-[var(--sg-forest)] font-bold text-[var(--sg-forest)]'
                        : 'bg-[var(--sg-cream)] border-[var(--sg-sand)] text-[var(--sg-charcoal)]'
                    }`}
                  >
                    <span>{rule.package_type}</span>
                    <span>{rule.net_weight_kg}kg Net ({rule.cartons_per_pallet} cartons/pallet)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pallet Range Slider */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--sg-cream)] border border-[var(--sg-sand)]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--sg-charcoal)] uppercase tracking-wider">Number of Loaded Pallets</span>
              <span className="font-black text-sm text-[var(--sg-forest)]">{palletCount} / {maxPallets} Pallets</span>
            </div>
            <input
              type="range"
              min={1}
              max={maxPallets}
              value={palletCount}
              onChange={(e) => setPalletCount(Number(e.target.value))}
              className="w-full accent-[var(--sg-forest)] cursor-pointer"
            />
          </div>

        </div>

        {/* Output Results Column */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 rounded-xl bg-[var(--sg-forest)] text-white space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="text-xs uppercase font-bold text-white/70 tracking-wider">Calculated Capacity</span>
              <Badge variant="gold" size="sm">{utilizationPercentage}% Loaded</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/10 border border-white/10">
                <span className="text-2xl font-black text-[var(--sg-gold-light)] block">{totalNetWeightTons} MT</span>
                <span className="text-xs text-white/80">Total Net Weight</span>
              </div>
              <div className="p-4 rounded-lg bg-white/10 border border-white/10">
                <span className="text-2xl font-black text-[var(--sg-gold-light)] block">{totalGrossWeightTons} MT</span>
                <span className="text-xs text-white/80">Total Gross Weight</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/10 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-white/90">
                <span>Total Export Cartons:</span>
                <span className="font-bold text-white">{totalCartons.toLocaleString()} Boxes</span>
              </div>
              <div className="flex justify-between text-white/90">
                <span>Cartons Per Pallet:</span>
                <span className="font-bold text-white">{currentRule.cartons_per_pallet} Boxes</span>
              </div>
              <div className="flex justify-between text-white/90">
                <span>Packaging Spec:</span>
                <span className="font-bold text-white">{currentRule.package_type}</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToRFQ}
            className="w-full bg-[var(--sg-gold)] hover:bg-[var(--sg-gold-dark)] text-white font-bold py-3.5 shadow-md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Calculation to RFQ Basket
          </Button>

        </div>

      </div>
    </Card>
  );
}
