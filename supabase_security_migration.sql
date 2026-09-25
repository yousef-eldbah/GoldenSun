-- ====================================================================
-- GOLDEN SUN EXPORT — HARDENED SECURITY & RLS POLICIES MIGRATION
-- Execute this script in your Supabase SQL Editor to enforce data protection.
-- ====================================================================

-- 1. Ensure RLS is active on all operational tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE container_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop overly permissive legacy "Public access" policies
DROP POLICY IF EXISTS "Public access categories" ON categories;
DROP POLICY IF EXISTS "Public access category_translations" ON category_translations;
DROP POLICY IF EXISTS "Public access products" ON products;
DROP POLICY IF EXISTS "Public access product_translations" ON product_translations;
DROP POLICY IF EXISTS "Public access product_images" ON product_images;
DROP POLICY IF EXISTS "Public access container_rules" ON container_rules;
DROP POLICY IF EXISTS "Public access rfqs" ON rfqs;
DROP POLICY IF EXISTS "Public access rfq_items" ON rfq_items;
DROP POLICY IF EXISTS "Public access site_settings" ON site_settings;

-- 3. PUBLIC READ-ONLY POLICIES FOR CATALOG DATA (Safe for visitors to view)
CREATE POLICY "Public read categories" ON categories
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read category_translations" ON category_translations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read products" ON products
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read product_translations" ON product_translations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read product_images" ON product_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read container_rules" ON container_rules
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read site_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- 4. RFQ SECURITY POLICIES:
-- Prospective clients (anon) can submit quote inquiries (INSERT),
-- but CANNOT view other clients' confidential RFQs or tamper with them (NO SELECT, NO UPDATE, NO DELETE).
CREATE POLICY "Public insert rfqs" ON rfqs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public insert rfq_items" ON rfq_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Authenticated staff & service_role have full management access over RFQs
CREATE POLICY "Staff manage rfqs" ON rfqs
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage rfq_items" ON rfq_items
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 5. STAFF-ONLY WRITE PERMISSIONS FOR CATALOG & SETTINGS
CREATE POLICY "Staff manage categories" ON categories
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage category_translations" ON category_translations
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage products" ON products
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage product_translations" ON product_translations
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage product_images" ON product_images
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage container_rules" ON container_rules
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

CREATE POLICY "Staff manage site_settings" ON site_settings
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- ====================================================================
-- DONE: Database is now protected against data tampering and leak of leads.
-- ====================================================================
