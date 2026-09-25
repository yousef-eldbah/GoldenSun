'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RFQItem, Incoterm, Product } from '@/types';

interface RFQBasketContextType {
  items: RFQItem[];
  addItem: (product: Product, quantityTons?: number, packaging?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantityTons: number) => void;
  clearBasket: () => void;
  incoterm: Incoterm;
  setIncoterm: (incoterm: Incoterm) => void;
  portOfDischarge: string;
  setPortOfDischarge: (port: string) => void;
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
  totalTonnage: number;
}

const RFQBasketContext = createContext<RFQBasketContextType | undefined>(undefined);

export function RFQBasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RFQItem[]>([]);
  const [incoterm, setIncoterm] = useState<Incoterm>('FOB');
  const [portOfDischarge, setPortOfDischarge] = useState<string>('');
  const [isBasketOpen, setIsBasketOpen] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sun_golden_rfq_basket');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    try {
      localStorage.setItem('sun_golden_rfq_basket', JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const addItem = (product: Product, quantityTons: number = 1, packaging?: string) => {
    const defaultPackage = packaging || product.container_rules?.[0]?.package_type || product.translations?.en?.packaging_options?.[0] || 'Standard Carton';
    const productName = product.translations?.en?.name || Object.values(product.translations || {})[0]?.name || 'Produce Item';

    setItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity_tons: item.quantity_tons + quantityTons }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: productName,
          quantity_tons: quantityTons,
          preferred_packaging: defaultPackage,
        },
      ];
    });

    setIsBasketOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantityTons: number) => {
    if (quantityTons <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity_tons: quantityTons } : item
      )
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const totalTonnage = items.reduce((sum, item) => sum + item.quantity_tons, 0);

  return (
    <RFQBasketContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        incoterm,
        setIncoterm,
        portOfDischarge,
        setPortOfDischarge,
        isBasketOpen,
        setIsBasketOpen,
        totalTonnage,
      }}
    >
      {children}
    </RFQBasketContext.Provider>
  );
}

export function useRFQBasket() {
  const context = useContext(RFQBasketContext);
  if (!context) {
    throw new Error('useRFQBasket must be used within an RFQBasketProvider');
  }
  return context;
}
