export type Locale = 'en' | 'de' | 'es';

export interface Category {
  id: string;
  slug: string;
  translations: Record<Locale, {
    title: string;
    description: string;
  }>;
}

export interface ProductImage {
  id: string;
  product_id?: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_cover: boolean;
}

export interface ContainerRule {
  id: string;
  product_id?: string;
  package_type: string;
  net_weight_kg: number;
  gross_weight_kg: number;
  cartons_per_pallet: number;
  pallets_per_40ft_reefer: number;
  pallets_per_20ft_reefer: number;
}

export interface ProductTranslation {
  name: string;
  description: string;
  origin?: string;
  shelf_life?: string;
  sizes?: string[];
  variety?: string;
  varieties?: string[];
  packaging_options?: string[];
  grade?: string;
  color?: string;
  harvest_method?: string;
  average_diameter?: string;
}

export interface Product {
  id: string;
  slug: string;
  category_id: string;
  hs_code?: string;
  storage_temp?: string;
  brix_level?: string;
  pdf_catalog_url?: string;
  is_featured: boolean;
  seasonality: Record<string, boolean>; // e.g. { "jan": true, "feb": true, ... }
  season_status?: Record<string, 'peak' | 'available' | 'limited' | 'off'>; // Monthly season status for chart
  translations: Record<Locale, ProductTranslation>;
  images: ProductImage[];
  container_rules?: ContainerRule[];
  certifications?: string[]; // e.g. ['GLOBALG.A.P.', 'GRASP', 'GCC']
}

export type Incoterm = 'FOB' | 'CIF' | 'CFR';

export interface RFQItem {
  product_id: string;
  product_name: string;
  quantity_tons: number;
  preferred_packaging: string;
}

export interface RFQ {
  id?: string;
  rfq_number?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone_whatsapp: string;
  country: string;
  port_of_discharge: string;
  incoterm: Incoterm;
  estimated_etd: string;
  notes?: string;
  gdpr_consent: boolean;
  items: RFQItem[];
  status?: 'new' | 'in_review' | 'quoted' | 'closed';
  created_at?: string;
}

export interface SiteSettings {
  company_name: string;
  tagline: Record<Locale, string>;
  address: Record<Locale, string>;
  phone: string;
  whatsapp: string;
  email: string;
  google_maps_url: string;
  social_links: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  google_analytics_id?: string;
  clarity_id?: string;
}

export interface Article {
  id: string;
  slug: string;
  image_url: string;
  created_at: string;
  translations: Record<Locale, {
    title: string;
    summary: string;
    content: string;
  }>;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  created_at: string;
}
