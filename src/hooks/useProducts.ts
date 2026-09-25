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

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const repoData = categoryId
          ? await services.productRepository.getByCategory(categoryId)
          : await services.productRepository.getAll();

        if (isMounted) {
          if (repoData && repoData.length > 0) {
            setProducts(repoData);
          } else {
            // If repository is empty / offline demo fallback
            const filtered = categoryId
              ? mockProducts.filter((p) => p.category_id === categoryId)
              : mockProducts;
            setProducts(filtered);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          const filtered = categoryId
            ? mockProducts.filter((p) => p.category_id === categoryId)
            : mockProducts;
          setProducts(filtered);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
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
