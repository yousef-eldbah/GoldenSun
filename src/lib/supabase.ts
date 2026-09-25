import { createClient } from '@supabase/supabase-js';
import { mockProducts, mockCategories, mockSiteSettings, mockArticles } from './mockData';
import { Product, Category, SiteSettings, Article, RFQ } from '@/types';

// Polyfill WebSocket for SSR / Node environment to prevent @supabase/realtime-js crash
if (typeof window === 'undefined' && typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  // @ts-expect-error WebSocket polyfill for SSR
  globalThis.WebSocket = class {};
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: typeof window !== 'undefined',
      },
    })
  : null;
// Helper Data Services with automatic fallback to mockData
export const apiService = {
  async getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_translations (*),
          product_images (*),
          container_rules (*)
        `);
      if (error || !data) return [];
      return data as Product[];
    } catch {
      return [];
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockCategories;
    }
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, category_translations(*)');
      if (error || !data || data.length === 0) return mockCategories;
      return data as Category[];
    } catch {
      return mockCategories;
    }
  },

  async getSiteSettings(): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      return mockSiteSettings;
    }
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error || !data || data.length === 0) return mockSiteSettings;
      // Convert key-value pairs
      const settingsMap = data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as any);
      return { ...mockSiteSettings, ...settingsMap };
    } catch {
      return mockSiteSettings;
    }
  },

  async getArticles(): Promise<Article[]> {
    if (!isSupabaseConfigured || !supabase) {
      return mockArticles;
    }
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*, article_translations(*)');
      if (error || !data || data.length === 0) return mockArticles;
      return data as Article[];
    } catch {
      return mockArticles;
    }
  },

  async submitRFQ(rfqData: RFQ): Promise<{ success: boolean; rfq_number: string; error?: string }> {
    // If called in browser, delegate to the dedicated server route handler
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/rfq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rfqData),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to record quote request');
        }
        return { success: true, rfq_number: json.rfq_number };
      } catch (err: any) {
        console.error('API submission error:', err);
        throw err;
      }
    }

    // Direct server-side call fallback
    const generatedRfqNumber = `SG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (isSupabaseConfigured && supabase) {
      const { data: rfqRow, error: rfqError } = await supabase
        .from('rfqs')
        .insert({
          rfq_number: generatedRfqNumber,
          company_name: rfqData.company_name,
          contact_name: rfqData.contact_name,
          email: rfqData.email,
          phone_whatsapp: rfqData.phone_whatsapp,
          country: rfqData.country,
          port_of_discharge: rfqData.port_of_discharge,
          incoterm: rfqData.incoterm,
          estimated_etd: rfqData.estimated_etd,
          notes: rfqData.notes,
          gdpr_consent: rfqData.gdpr_consent,
          status: 'new',
        })
        .select()
        .single();

      if (rfqError || !rfqRow) {
        throw new Error(rfqError?.message || 'Failed to submit RFQ to database');
      }

      if (rfqData.items && rfqData.items.length > 0) {
        const itemsToInsert = rfqData.items.map((item) => ({
          rfq_id: rfqRow.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity_tons: item.quantity_tons,
          preferred_packaging: item.preferred_packaging,
        }));
        await supabase.from('rfq_items').insert(itemsToInsert);
      }

      return { success: true, rfq_number: generatedRfqNumber };
    }

    throw new Error('Supabase database is not configured');
  },
};

