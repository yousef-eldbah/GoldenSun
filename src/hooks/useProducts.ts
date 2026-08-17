'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { services } from '@/services';
import { mockProducts } from '@/lib/mockData';

export function useProducts(categoryId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchProducts = async () => {
      try {
        const repoData = categoryId
          ? await services.productRepository.getByCategory(categoryId)
          : await services.productRepository.getAll();

        // Read local custom products saved from Admin Dashboard (for instant offline/demo sync)
        let localCustom: Product[] = [];
        if (typeof window !== 'undefined') {
          try {
            const saved = localStorage.getItem('sun_golden_custom_products');
            if (saved) {
              localCustom = JSON.parse(saved);
            }
          } catch {
            // Ignore parse errors
          }
        }

        // Combine repository data (Supabase) + local custom products from Admin Dashboard
        const combinedMap = new Map<string, Product>();

        // 1. Add local custom products from Admin
        localCustom.forEach((p) => combinedMap.set(p.id, p));

        // 2. Add Supabase repository database products
        if (repoData && repoData.length > 0) {
          repoData.forEach((p) => combinedMap.set(p.id, p));
        }

        let resultList = Array.from(combinedMap.values());

        if (categoryId) {
          resultList = resultList.filter((p) => p.category_id === categoryId);
        }

        if (isMounted) {
          setProducts(resultList);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setProducts([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();

    // Listen to custom storage event for instant tab sync
    const handleStorageChange = () => fetchProducts();
    if (typeof window !== 'undefined') {
      window.addEventListener('sun_golden_products_updated', handleStorageChange);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('sun_golden_products_updated', handleStorageChange);
      }
    };
  }, [categoryId]);

  return { products, isLoading, error };
}

export function useProductBySlug(slug: string) {
  const { products, isLoading, error } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products && slug) {
      const found = products.find(
        (p) =>
          p.slug === slug ||
          p.translations.en?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
      );
      setProduct(found || null);
    }
  }, [products, slug]);

  return { product, isLoading, error };
}
