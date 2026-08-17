-- ======================================================
-- GOLDEN SUN AGRICULTURAL EXPORT — Supabase Migration
-- Run this SQL in Supabase Dashboard → SQL Editor
-- ======================================================

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'de', 'es')),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  UNIQUE(category_id, locale)
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  hs_code TEXT DEFAULT '',
  storage_temp TEXT DEFAULT '',
  brix_level TEXT DEFAULT '',
  pdf_catalog_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  seasonality JSONB DEFAULT '{}',
  season_status JSONB DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'de', 'es')),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  origin TEXT DEFAULT '',
  shelf_life TEXT DEFAULT '',
  sizes TEXT[] DEFAULT '{}',
  variety TEXT DEFAULT '',
  grade TEXT DEFAULT '',
  color TEXT DEFAULT '',
  harvest_method TEXT DEFAULT '',
  average_diameter TEXT DEFAULT '',
  UNIQUE(product_id, locale)
);

-- 3. Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  is_cover BOOLEAN DEFAULT false
);

-- 4. Container Rules
CREATE TABLE IF NOT EXISTS container_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  package_type TEXT NOT NULL,
  net_weight_kg NUMERIC DEFAULT 0,
  gross_weight_kg NUMERIC DEFAULT 0,
  cartons_per_pallet INT DEFAULT 0,
  pallets_per_40ft_reefer INT DEFAULT 0,
  pallets_per_20ft_reefer INT DEFAULT 0
);

-- 5. RFQs (Request for Quote)
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_number TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_whatsapp TEXT DEFAULT '',
  country TEXT DEFAULT '',
  port_of_discharge TEXT DEFAULT '',
  incoterm TEXT DEFAULT 'FOB' CHECK (incoterm IN ('FOB', 'CIF', 'CFR')),
  estimated_etd TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  gdpr_consent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'quoted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rfq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  product_id TEXT DEFAULT '',
  product_name TEXT DEFAULT '',
  quantity_tons NUMERIC DEFAULT 0,
  preferred_packaging TEXT DEFAULT ''
);

-- 6. Site Settings (key-value approach)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ======================================================
-- PERMISSIONS & ROW LEVEL SECURITY (RLS) POLICIES
-- ======================================================

-- Grant table privileges to anon and authenticated roles
GRANT ALL ON TABLE categories TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE category_translations TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE products TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE product_translations TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE product_images TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE container_rules TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE rfqs TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE rfq_items TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE site_settings TO anon, authenticated, postgres, service_role;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE container_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public access categories" ON categories;
DROP POLICY IF EXISTS "Public access category_translations" ON category_translations;
DROP POLICY IF EXISTS "Public access products" ON products;
DROP POLICY IF EXISTS "Public access product_translations" ON product_translations;
DROP POLICY IF EXISTS "Public access product_images" ON product_images;
DROP POLICY IF EXISTS "Public access container_rules" ON container_rules;
DROP POLICY IF EXISTS "Public access rfqs" ON rfqs;
DROP POLICY IF EXISTS "Public access rfq_items" ON rfq_items;
DROP POLICY IF EXISTS "Public access site_settings" ON site_settings;

-- Create ALL permissions policies for all tables
CREATE POLICY "Public access categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access category_translations" ON category_translations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access product_translations" ON product_translations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access container_rules" ON container_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access rfqs" ON rfqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access rfq_items" ON rfq_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- Seed Categories
INSERT INTO categories (id, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'fruits'),
  ('00000000-0000-0000-0000-000000000002', 'vegetables')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO category_translations (category_id, locale, title, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'en', 'Fruits', 'Fresh Egyptian fruits exported worldwide'),
  ('00000000-0000-0000-0000-000000000001', 'de', 'Fruechte', 'Frische aegyptische Fruechte weltweit exportiert'),
  ('00000000-0000-0000-0000-000000000001', 'es', 'Frutas', 'Frutas frescas egipcias exportadas a todo el mundo'),
  ('00000000-0000-0000-0000-000000000002', 'en', 'Vegetables', 'Premium Egyptian vegetables'),
  ('00000000-0000-0000-0000-000000000002', 'de', 'Gemuese', 'Premium aegyptisches Gemuese'),
  ('00000000-0000-0000-0000-000000000002', 'es', 'Verduras', 'Verduras egipcias premium')
ON CONFLICT (category_id, locale) DO NOTHING;

-- ======================================================
-- STORAGE: Create product-images bucket
-- ======================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  2097152, -- 2MB
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product images
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated & anon to upload product images
CREATE POLICY "Allow upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Allow update of product images
CREATE POLICY "Allow update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

-- Allow delete of product images
CREATE POLICY "Allow delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
