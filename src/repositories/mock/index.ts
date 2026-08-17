import { Product, Category, RFQ, SiteSettings } from '@/types';
import { IProductRepository, ICategoryRepository, IRFQRepository, ISettingsRepository } from '../base';
import { mockProducts, mockCategories, mockSiteSettings } from '@/lib/mockData';

export class MockProductRepository implements IProductRepository {
  private products: Product[] = [...mockProducts];

  async getAll(): Promise<Product[]> {
    return Promise.resolve([...this.products]);
  }

  async getBySlug(slug: string): Promise<Product | null> {
    if (slug === 'test') {
      const baseProduct = this.products[0] || mockProducts[0];
      return Promise.resolve({
        ...baseProduct,
        id: 'prod-test',
        slug: 'test',
        images: [
          {
            id: 'img-test-1',
            image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=80',
            alt_text: 'Fresh Farm Produce Overview',
            display_order: 1,
            is_cover: true,
          },
          {
            id: 'img-test-2',
            image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
            alt_text: 'Sliced Citrus & Quality Inspection',
            display_order: 2,
            is_cover: false,
          },
          {
            id: 'img-test-3',
            image_url: 'https://images.unsplash.com/photo-1582979512210-99b6a53385f9?auto=format&fit=crop&w=800&q=80',
            alt_text: 'Harvested Produce Basket',
            display_order: 3,
            is_cover: false,
          },
          {
            id: 'img-test-4',
            image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
            alt_text: 'Cold Storage & Packaging Facilities',
            display_order: 4,
            is_cover: false,
          },
        ],
        translations: {
          ...baseProduct.translations,
          en: {
            ...baseProduct.translations.en,
            name: 'TEST PRODUCT (PREMIUM EXPORT)',
            description: 'Demonstration produce item featuring multi-image gallery showcase (1 cover main image and 4 gallery thumbnails below).',
          },
        },
      });
    }
    const product = this.products.find(
      (p) => p.slug === slug || p.id === slug || p.translations.en.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
    return Promise.resolve(product || null);
  }

  async getById(id: string): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    return Promise.resolve(product || null);
  }

  async getByCategory(categoryId: string): Promise<Product[]> {
    const filtered = this.products.filter((p) => p.category_id === categoryId);
    return Promise.resolve(filtered);
  }

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
    };
    this.products.push(newProduct);
    return Promise.resolve(newProduct);
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.products[index] = { ...this.products[index], ...productData };
    return Promise.resolve(this.products[index]);
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return Promise.resolve(this.products.length < initialLen);
  }
}

export class MockCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    return Promise.resolve([...mockCategories]);
  }

  async getById(id: string): Promise<Category | null> {
    return Promise.resolve(mockCategories.find((c) => c.id === id) || null);
  }
}

export class MockRFQRepository implements IRFQRepository {
  private rfqs: RFQ[] = [];

  async getAll(): Promise<RFQ[]> {
    return Promise.resolve([...this.rfqs]);
  }

  async getById(id: string): Promise<RFQ | null> {
    return Promise.resolve(this.rfqs.find((r) => r.id === id) || null);
  }

  async create(rfqData: Omit<RFQ, 'id' | 'created_at' | 'status'>): Promise<RFQ> {
    const newRfq: RFQ = {
      ...rfqData,
      id: `rfq_${Date.now()}`,
      rfq_number: `SG-RFQ-${Date.now().toString().slice(-4)}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    this.rfqs.push(newRfq);
    return Promise.resolve(newRfq);
  }

  async updateStatus(id: string, status: NonNullable<RFQ['status']>): Promise<RFQ> {
    const index = this.rfqs.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('RFQ not found');
    this.rfqs[index] = { ...this.rfqs[index], status };
    return Promise.resolve(this.rfqs[index]);
  }
}

export class MockSettingsRepository implements ISettingsRepository {
  private settings: SiteSettings = { ...mockSiteSettings };

  async getSettings(): Promise<SiteSettings> {
    return Promise.resolve({ ...this.settings });
  }

  async updateSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
    this.settings = { ...this.settings, ...newSettings };
    return Promise.resolve({ ...this.settings });
  }
}
