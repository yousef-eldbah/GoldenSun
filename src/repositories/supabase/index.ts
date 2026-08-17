import { Product, Category, RFQ, SiteSettings, Locale } from '@/types';
import { IProductRepository, ICategoryRepository, IRFQRepository, ISettingsRepository } from '../base';
import { MockProductRepository } from '../mock';
import { supabase } from '@/lib/supabase';

// Helper: Transform Supabase row data to our Product type
function transformProduct(row: any): Product {
  const translations: any = {};
  if (row.product_translations) {
    for (const t of row.product_translations) {
      translations[t.locale as Locale] = {
        name: t.name,
        description: t.description,
        origin: t.origin,
        shelf_life: t.shelf_life,
        sizes: t.sizes || [],
        variety: t.variety || '',
        grade: t.grade || '',
        color: t.color || '',
        harvest_method: t.harvest_method || '',
        average_diameter: t.average_diameter || '',
      };
    }
  }
  return {
    id: row.id,
    slug: row.slug,
    category_id: row.category_id,
    hs_code: row.hs_code || '',
    storage_temp: row.storage_temp || '',
    brix_level: row.brix_level || '',
    pdf_catalog_url: row.pdf_catalog_url || '',
    is_featured: row.is_featured || false,
    seasonality: row.seasonality || {},
    season_status: row.season_status || {},
    translations,
    images: (row.product_images || []).map((img: any) => ({
      id: img.id,
      product_id: img.product_id,
      image_url: img.image_url,
      alt_text: img.alt_text || '',
      display_order: img.display_order || 0,
      is_cover: img.is_cover || false,
    })),
    container_rules: (row.container_rules || []).map((cr: any) => ({
      id: cr.id,
      product_id: cr.product_id,
      package_type: cr.package_type,
      net_weight_kg: cr.net_weight_kg || 0,
      gross_weight_kg: cr.gross_weight_kg || 0,
      cartons_per_pallet: cr.cartons_per_pallet || 0,
      pallets_per_40ft_reefer: cr.pallets_per_40ft_reefer || 0,
      pallets_per_20ft_reefer: cr.pallets_per_20ft_reefer || 0,
    })),
    certifications: row.certifications || [],
  };
}

function transformCategory(row: any): Category {
  const translations: any = {};
  if (row.category_translations) {
    for (const t of row.category_translations) {
      translations[t.locale as Locale] = {
        title: t.title,
        description: t.description || '',
      };
    }
  }
  return {
    id: row.id,
    slug: row.slug,
    translations,
  };
}

// ==========================================
// Supabase Product Repository
// ==========================================
export class SupabaseProductRepository implements IProductRepository {
  private get db() {
    if (!supabase) throw new Error('Supabase not configured');
    return supabase;
  }

  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await this.db
        .from('products')
        .select(`
          *,
          product_translations (*),
          product_images (*),
          container_rules (*)
        `)
        .order('display_order', { ascending: true });

      if (error || !data) {
        return [];
      }
      return data.map(transformProduct);
    } catch {
      return [];
    }
  }

  async getBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await this.db
        .from('products')
        .select(`
          *,
          product_translations (*),
          product_images (*),
          container_rules (*)
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return null;
      }
      return transformProduct(data);
    } catch {
      return null;
    }
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await this.db
      .from('products')
      .select(`
        *,
        product_translations (*),
        product_images (*),
        container_rules (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return transformProduct(data);
  }

  async getByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await this.db
      .from('products')
      .select(`
        *,
        product_translations (*),
        product_images (*),
        container_rules (*)
      `)
      .eq('category_id', categoryId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data || []).map(transformProduct);
  }

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    // 1. Insert main product row
    const { data: productRow, error: productError } = await this.db
      .from('products')
      .insert({
        slug: productData.slug,
        category_id: productData.category_id,
        hs_code: productData.hs_code,
        storage_temp: productData.storage_temp,
        brix_level: productData.brix_level,
        pdf_catalog_url: productData.pdf_catalog_url,
        is_featured: productData.is_featured,
        seasonality: productData.seasonality,
        season_status: productData.season_status || {},
        certifications: productData.certifications,
      })
      .select()
      .single();

    if (productError || !productRow) throw productError || new Error('Failed to create product');

    const productId = productRow.id;

    // 2. Insert translations for all locales
    const locales: Locale[] = ['en', 'de', 'es'];
    const translationRows = locales
      .filter(locale => productData.translations[locale])
      .map(locale => ({
        product_id: productId,
        locale,
        name: productData.translations[locale].name,
        description: productData.translations[locale].description,
        origin: productData.translations[locale].origin,
        shelf_life: productData.translations[locale].shelf_life,
        sizes: productData.translations[locale].sizes,
        variety: productData.translations[locale].variety || '',
        grade: productData.translations[locale].grade || '',
        color: productData.translations[locale].color || '',
        harvest_method: productData.translations[locale].harvest_method || '',
        average_diameter: productData.translations[locale].average_diameter || '',
      }));

    if (translationRows.length > 0) {
      await this.db.from('product_translations').insert(translationRows);
    }

    // 3. Insert images
    if (productData.images && productData.images.length > 0) {
      const imageRows = productData.images.map(img => ({
        product_id: productId,
        image_url: img.image_url,
        alt_text: img.alt_text,
        display_order: img.display_order,
        is_cover: img.is_cover,
      }));
      await this.db.from('product_images').insert(imageRows);
    }

    // 4. Insert container rules
    if (productData.container_rules && productData.container_rules.length > 0) {
      const ruleRows = productData.container_rules.map(cr => ({
        product_id: productId,
        package_type: cr.package_type,
        net_weight_kg: cr.net_weight_kg,
        gross_weight_kg: cr.gross_weight_kg,
        cartons_per_pallet: cr.cartons_per_pallet,
        pallets_per_40ft_reefer: cr.pallets_per_40ft_reefer,
        pallets_per_20ft_reefer: cr.pallets_per_20ft_reefer,
      }));
      await this.db.from('container_rules').insert(ruleRows);
    }

    // Re-fetch the complete product
    return (await this.getById(productId))!;
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    // 1. Update main product fields
    const mainFields: any = {};
    if (productData.slug !== undefined) mainFields.slug = productData.slug;
    if (productData.category_id !== undefined) mainFields.category_id = productData.category_id;
    if (productData.hs_code !== undefined) mainFields.hs_code = productData.hs_code;
    if (productData.storage_temp !== undefined) mainFields.storage_temp = productData.storage_temp;
    if (productData.brix_level !== undefined) mainFields.brix_level = productData.brix_level;
    if (productData.pdf_catalog_url !== undefined) mainFields.pdf_catalog_url = productData.pdf_catalog_url;
    if (productData.is_featured !== undefined) mainFields.is_featured = productData.is_featured;
    if (productData.seasonality !== undefined) mainFields.seasonality = productData.seasonality;
    if (productData.season_status !== undefined) mainFields.season_status = productData.season_status;
    if (productData.certifications !== undefined) mainFields.certifications = productData.certifications;
    mainFields.updated_at = new Date().toISOString();

    if (Object.keys(mainFields).length > 1) {
      await this.db.from('products').update(mainFields).eq('id', id);
    }

    // 2. Upsert translations
    if (productData.translations) {
      const locales: Locale[] = ['en', 'de', 'es'];
      for (const locale of locales) {
        if (productData.translations[locale]) {
          const t = productData.translations[locale];
          await this.db
            .from('product_translations')
            .upsert({
              product_id: id,
              locale,
              name: t.name,
              description: t.description,
              origin: t.origin,
              shelf_life: t.shelf_life,
              sizes: t.sizes,
              variety: t.variety || '',
              grade: t.grade || '',
              color: t.color || '',
              harvest_method: t.harvest_method || '',
              average_diameter: t.average_diameter || '',
            }, { onConflict: 'product_id,locale' });
        }
      }
    }

    // 3. Replace images if provided
    if (productData.images) {
      await this.db.from('product_images').delete().eq('product_id', id);
      if (productData.images.length > 0) {
        const imageRows = productData.images.map(img => ({
          product_id: id,
          image_url: img.image_url,
          alt_text: img.alt_text,
          display_order: img.display_order,
          is_cover: img.is_cover,
        }));
        await this.db.from('product_images').insert(imageRows);
      }
    }

    // 4. Replace container rules if provided
    if (productData.container_rules) {
      await this.db.from('container_rules').delete().eq('product_id', id);
      if (productData.container_rules.length > 0) {
        const ruleRows = productData.container_rules.map(cr => ({
          product_id: id,
          package_type: cr.package_type,
          net_weight_kg: cr.net_weight_kg,
          gross_weight_kg: cr.gross_weight_kg,
          cartons_per_pallet: cr.cartons_per_pallet,
          pallets_per_40ft_reefer: cr.pallets_per_40ft_reefer,
          pallets_per_20ft_reefer: cr.pallets_per_20ft_reefer,
        }));
        await this.db.from('container_rules').insert(ruleRows);
      }
    }

    return (await this.getById(id))!;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.db.from('products').delete().eq('id', id);
    return !error;
  }
}

// ==========================================
// Supabase Category Repository
// ==========================================
export class SupabaseCategoryRepository implements ICategoryRepository {
  private get db() {
    if (!supabase) throw new Error('Supabase not configured');
    return supabase;
  }

  async getAll(): Promise<Category[]> {
    const { data, error } = await this.db
      .from('categories')
      .select('*, category_translations(*)');

    if (error) throw error;
    return (data || []).map(transformCategory);
  }

  async getById(id: string): Promise<Category | null> {
    const { data, error } = await this.db
      .from('categories')
      .select('*, category_translations(*)')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return transformCategory(data);
  }
}

// ==========================================
// Supabase RFQ Repository
// ==========================================
export class SupabaseRFQRepository implements IRFQRepository {
  private get db() {
    if (!supabase) throw new Error('Supabase not configured');
    return supabase;
  }

  async getAll(): Promise<RFQ[]> {
    const { data, error } = await this.db
      .from('rfqs')
      .select('*, rfq_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      rfq_number: row.rfq_number,
      company_name: row.company_name,
      contact_name: row.contact_name,
      email: row.email,
      phone_whatsapp: row.phone_whatsapp,
      country: row.country,
      port_of_discharge: row.port_of_discharge,
      incoterm: row.incoterm,
      estimated_etd: row.estimated_etd,
      notes: row.notes,
      gdpr_consent: row.gdpr_consent,
      status: row.status,
      created_at: row.created_at,
      items: (row.rfq_items || []).map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity_tons: item.quantity_tons,
        preferred_packaging: item.preferred_packaging,
      })),
    }));
  }

  async getById(id: string): Promise<RFQ | null> {
    const { data, error } = await this.db
      .from('rfqs')
      .select('*, rfq_items(*)')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      rfq_number: data.rfq_number,
      company_name: data.company_name,
      contact_name: data.contact_name,
      email: data.email,
      phone_whatsapp: data.phone_whatsapp,
      country: data.country,
      port_of_discharge: data.port_of_discharge,
      incoterm: data.incoterm,
      estimated_etd: data.estimated_etd,
      notes: data.notes,
      gdpr_consent: data.gdpr_consent,
      status: data.status,
      created_at: data.created_at,
      items: (data.rfq_items || []).map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity_tons: item.quantity_tons,
        preferred_packaging: item.preferred_packaging,
      })),
    };
  }

  async create(rfqData: Omit<RFQ, 'id' | 'created_at' | 'status'>): Promise<RFQ> {
    const rfqNumber = `SG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: rfqRow, error: rfqError } = await this.db
      .from('rfqs')
      .insert({
        rfq_number: rfqNumber,
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

    if (rfqError || !rfqRow) throw rfqError || new Error('Failed to create RFQ');

    if (rfqData.items && rfqData.items.length > 0) {
      const itemRows = rfqData.items.map(item => ({
        rfq_id: rfqRow.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity_tons: item.quantity_tons,
        preferred_packaging: item.preferred_packaging,
      }));
      await this.db.from('rfq_items').insert(itemRows);
    }

    return (await this.getById(rfqRow.id))!;
  }

  async updateStatus(id: string, status: NonNullable<RFQ['status']>): Promise<RFQ> {
    await this.db.from('rfqs').update({ status }).eq('id', id);
    return (await this.getById(id))!;
  }
}

// ==========================================
// Supabase Settings Repository
// ==========================================
export class SupabaseSettingsRepository implements ISettingsRepository {
  private get db() {
    if (!supabase) throw new Error('Supabase not configured');
    return supabase;
  }

  async getSettings(): Promise<SiteSettings> {
    const { data, error } = await this.db
      .from('site_settings')
      .select('*');

    if (error || !data || data.length === 0) {
      // Return defaults
      return {
        company_name: 'Sun Golden Agricultural Export',
        tagline: { en: '', de: '', es: '' },
        address: { en: '', de: '', es: '' },
        phone: '',
        whatsapp: '',
        email: '',
        google_maps_url: '',
        social_links: {},
      };
    }

    const settingsMap: any = {};
    for (const row of data) {
      settingsMap[row.key] = row.value;
    }

    return {
      company_name: settingsMap.company_name || 'Sun Golden Agricultural Export',
      tagline: settingsMap.tagline || { en: '', de: '', es: '' },
      address: settingsMap.address || { en: '', de: '', es: '' },
      phone: settingsMap.phone || '',
      whatsapp: settingsMap.whatsapp || '',
      email: settingsMap.email || '',
      google_maps_url: settingsMap.google_maps_url || '',
      social_links: settingsMap.social_links || {},
      google_analytics_id: settingsMap.google_analytics_id || '',
      clarity_id: settingsMap.clarity_id || '',
    };
  }

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await this.db
        .from('site_settings')
        .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    }
    return this.getSettings();
  }
}
