import { Product, Category, RFQ, SiteSettings } from '@/types';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getBySlug(slug: string): Promise<Product | null>;
  getById(id: string): Promise<Product | null>;
  getByCategory(categoryId: string): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<boolean>;
}

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
}

export interface IRFQRepository {
  getAll(): Promise<RFQ[]>;
  getById(id: string): Promise<RFQ | null>;
  create(rfq: Omit<RFQ, 'id' | 'created_at' | 'status'>): Promise<RFQ>;
  updateStatus(id: string, status: NonNullable<RFQ['status']>): Promise<RFQ>;
}

export interface ISettingsRepository {
  getSettings(): Promise<SiteSettings>;
  updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;
}
