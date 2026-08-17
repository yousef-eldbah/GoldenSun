'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Package, FileSpreadsheet, Settings, Download, Plus, Trash2,
  CheckCircle2, Upload, BarChart3, Eye, EyeOff, ChevronDown, ChevronUp,
  Star, GripVertical, X, Save, RefreshCw, Globe, Search
} from 'lucide-react';
import { mockProducts, mockCategories, mockSiteSettings } from '@/lib/mockData';
import { compressAndConvertToWebP } from '@/lib/imageCompression';
import { RFQ, Product, Category, Locale, SiteSettings, ProductTranslation } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import './admin.css';

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const STATUS_OPTIONS: { value: NonNullable<RFQ['status']>; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'closed', label: 'Closed' },
];

const EMPTY_TRANSLATION: ProductTranslation = {
  name: '', description: '', origin: '', shelf_life: '',
  sizes: [], variety: '', grade: '', color: '',
  harvest_method: '', average_diameter: '',
};

function createEmptyProduct(): Omit<Product, 'id'> & { id?: string } {
  return {
    slug: '',
    category_id: '',
    hs_code: '',
    storage_temp: '',
    brix_level: '',
    pdf_catalog_url: '',
    is_featured: false,
    seasonality: {},
    season_status: {},
    translations: {
      en: { ...EMPTY_TRANSLATION },
      de: { ...EMPTY_TRANSLATION },
      es: { ...EMPTY_TRANSLATION },
    },
    images: [],
    container_rules: [],
    certifications: [],
  };
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'rfqs' | 'products' | 'settings'>('overview');
  const [loading, setLoading] = useState(false);

  // Data
  const [rfqsList, setRfqsList] = useState<RFQ[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(mockSiteSettings);

  // Product Editor
  const [editingProduct, setEditingProduct] = useState<(Omit<Product, 'id'> & { id?: string }) | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [activeLang, setActiveLang] = useState<Locale>('en');
  const [imageCompressing, setImageCompressing] = useState(false);
  const [newCertification, setNewCertification] = useState('');

  // RFQ
  const [expandedRFQ, setExpandedRFQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Load from Supabase
        const [productsRes, categoriesRes, rfqsRes, settingsRes] = await Promise.all([
          supabase.from('products').select('*, product_translations(*), product_images(*), container_rules(*)').order('display_order'),
          supabase.from('categories').select('*, category_translations(*)'),
          supabase.from('rfqs').select('*, rfq_items(*)').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*'),
        ]);

        if (productsRes.data) {
          // Strip out invalid blob: URLs that expired from previous sessions
          const products = productsRes.data.map(transformSupabaseProduct).map(p => ({
            ...p,
            images: p.images.filter(img => !img.image_url.startsWith('blob:')),
          }));
          setProductsList(products);
        }
        if (categoriesRes.data) {
          setCategories(categoriesRes.data.map(transformSupabaseCategory));
        }
        if (rfqsRes.data) {
          setRfqsList(rfqsRes.data.map(transformSupabaseRFQ));
        }
      } else {
        // Load from mock data
        setProductsList([...mockProducts]);
        setCategories([...mockCategories]);
        // Load RFQs from localStorage
        try {
          const stored = localStorage.getItem('sun_golden_rfqs');
          if (stored) {
            setRfqsList(JSON.parse(stored));
          } else {
            setRfqsList(getSampleRFQs());
          }
        } catch {
          setRfqsList(getSampleRFQs());
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setProductsList([...mockProducts]);
      setCategories([...mockCategories]);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'admin' || password === '') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password. Try "admin123" or leave blank for demo.');
    }
  };

  // ==================== RFQ Functions ====================
  const updateRFQStatus = async (rfqId: string, newStatus: NonNullable<RFQ['status']>) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('rfqs').update({ status: newStatus }).eq('id', rfqId);
    }
    setRfqsList(prev => prev.map(r => r.id === rfqId ? { ...r, status: newStatus } : r));
    showToast(`RFQ status updated to ${newStatus}`);
  };

  const exportToExcel = () => {
    const dataToExport = rfqsList.map(rfq => ({
      'RFQ Number': rfq.rfq_number,
      'Company': rfq.company_name,
      'Contact': rfq.contact_name,
      'Email': rfq.email,
      'Phone/WhatsApp': rfq.phone_whatsapp,
      'Country': rfq.country,
      'Port': rfq.port_of_discharge,
      'Incoterm': rfq.incoterm,
      'ETD': rfq.estimated_etd,
      'Products': rfq.items.length,
      'Total MT': rfq.items.reduce((s, i) => s + i.quantity_tons, 0),
      'Status': rfq.status,
      'Date': rfq.created_at || '',
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RFQ Leads');
    XLSX.writeFile(wb, `Golden_Sun_RFQs_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Excel exported successfully!');
  };

  const exportRFQToPDF = (rfq: RFQ) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('SUN GOLDEN AGRICULTURAL EXPORT', 14, 20);
    doc.setFontSize(12);
    doc.text(`RFQ Summary - ${rfq.rfq_number}`, 14, 30);
    doc.setLineWidth(0.5);
    doc.line(14, 34, 196, 34);
    doc.setFontSize(10);
    doc.text(`Company: ${rfq.company_name}`, 14, 44);
    doc.text(`Contact: ${rfq.contact_name}`, 14, 52);
    doc.text(`Email: ${rfq.email}`, 14, 60);
    doc.text(`Phone: ${rfq.phone_whatsapp}`, 14, 68);
    doc.text(`Country: ${rfq.country}`, 14, 76);
    doc.text(`Port: ${rfq.port_of_discharge}`, 14, 84);
    doc.text(`Incoterm: ${rfq.incoterm}`, 14, 92);
    doc.text(`ETD: ${rfq.estimated_etd}`, 14, 100);
    doc.line(14, 106, 196, 106);
    doc.text('Products:', 14, 114);
    let y = 124;
    rfq.items.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.product_name} - ${item.quantity_tons} MT (${item.preferred_packaging})`, 14, y);
      y += 8;
    });
    doc.save(`RFQ_${rfq.rfq_number}.pdf`);
  };

  // ==================== Product Functions ====================
  const openNewProduct = () => {
    setEditingProduct(createEmptyProduct());
    setIsNewProduct(true);
    setActiveLang('en');
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsNewProduct(false);
    setActiveLang('en');
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setLoading(true);

    try {
      if (isNewProduct) {
        // Generate slug from EN name
        const slug = editingProduct.translations.en.name
          .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        if (isSupabaseConfigured && supabase) {
          // Create in Supabase
          const { data: row, error } = await supabase
            .from('products')
            .insert({
              slug,
              category_id: editingProduct.category_id || null,
              hs_code: editingProduct.hs_code,
              storage_temp: editingProduct.storage_temp,
              brix_level: editingProduct.brix_level,
              pdf_catalog_url: editingProduct.pdf_catalog_url,
              is_featured: editingProduct.is_featured,
              seasonality: editingProduct.seasonality,
              season_status: editingProduct.season_status || {},
              certifications: editingProduct.certifications,
              display_order: productsList.length,
            })
            .select()
            .single();

          if (error || !row) throw error;

          // Insert translations
          for (const locale of LOCALES) {
            const t = editingProduct.translations[locale.code];
            if (t && t.name) {
              await supabase.from('product_translations').insert({
                product_id: row.id,
                locale: locale.code,
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
              });
            }
          }

          // Insert images
          for (const img of editingProduct.images) {
            await supabase.from('product_images').insert({
              product_id: row.id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              display_order: img.display_order,
              is_cover: img.is_cover,
            });
          }
        }

        const newProd: Product = {
          ...editingProduct as Product,
          id: editingProduct.id || `prod_${Date.now()}`,
          slug,
        };
        
        setProductsList(prev => {
          const updated = [...prev, newProd];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('sun_golden_custom_products', JSON.stringify(updated));
              window.dispatchEvent(new Event('sun_golden_products_updated'));
            } catch {}
          }
          return updated;
        });

        showToast('Product created successfully!');
      } else {
        // Update existing
        if (isSupabaseConfigured && supabase && editingProduct.id) {
          await supabase.from('products').update({
            slug: editingProduct.slug,
            category_id: editingProduct.category_id || null,
            hs_code: editingProduct.hs_code,
            storage_temp: editingProduct.storage_temp,
            brix_level: editingProduct.brix_level,
            pdf_catalog_url: editingProduct.pdf_catalog_url,
            is_featured: editingProduct.is_featured,
            seasonality: editingProduct.seasonality,
            season_status: editingProduct.season_status || {},
            certifications: editingProduct.certifications,
            updated_at: new Date().toISOString(),
          }).eq('id', editingProduct.id);

          // Upsert translations
          for (const locale of LOCALES) {
            const t = editingProduct.translations[locale.code];
            if (t) {
              await supabase.from('product_translations').upsert({
                product_id: editingProduct.id,
                locale: locale.code,
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

          // ✅ FIX: Sync images — re-upload any blob URLs, then delete old & re-insert all
          await ensureBucketExists();
          const sb = supabase!; // already guarded by outer if
          const resolvedImages = await Promise.all(
            editingProduct.images.map(async (img, i) => {
              let imageUrl = img.image_url;
              // If still a local blob URL, try to re-upload to Supabase Storage
              if (imageUrl.startsWith('blob:')) {
                try {
                  const res = await fetch(imageUrl);
                  const blob = await res.blob();
                  const fileName = `product-${editingProduct.id}-${Date.now()}-${i}.webp`;
                  const { data, error } = await sb.storage
                    .from('product-images')
                    .upload(fileName, blob, { contentType: 'image/webp', upsert: true });
                  if (!error && data) {
                    const { data: urlData } = sb.storage
                      .from('product-images')
                      .getPublicUrl(data.path);
                    imageUrl = urlData.publicUrl;
                  }
                } catch {
                  // keep blob URL as-is if re-upload fails
                }
              }
              return { ...img, image_url: imageUrl };
            })
          );


          // Delete old image rows and re-insert current set
          await supabase.from('product_images').delete().eq('product_id', editingProduct.id);
          if (resolvedImages.length > 0) {
            await supabase.from('product_images').insert(
              resolvedImages.map((img, i) => ({
                product_id: editingProduct.id,
                image_url: img.image_url,
                alt_text: img.alt_text || '',
                display_order: img.display_order ?? i,
                is_cover: img.is_cover ?? i === 0,
              }))
            );
          }

          // Update local state with resolved (permanent) URLs
          setProductsList(prev => {
            const updated = prev.map(p =>
              p.id === editingProduct.id
                ? { ...(editingProduct as Product), images: resolvedImages }
                : p
            );
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('sun_golden_custom_products', JSON.stringify(updated));
                window.dispatchEvent(new Event('sun_golden_products_updated'));
              } catch {}
            }
            return updated;
          });

          showToast('Product updated successfully!');
        } else {
          // No Supabase — just update local state
          setProductsList(prev => {
            const updated = prev.map(p => p.id === editingProduct.id ? (editingProduct as Product) : p);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('sun_golden_custom_products', JSON.stringify(updated));
                window.dispatchEvent(new Event('sun_golden_products_updated'));
              } catch {}
            }
            return updated;
          });
          showToast('Product updated successfully!');
        } // end else (no Supabase)
      } // end else (update existing)
    } catch (err: any) {
      console.error('Save failed:', err);
      if (err?.code === '42501' || err?.message?.includes('permission denied')) {
        showToast('🔒 Permission denied by Supabase! Run supabase_migration.sql in Supabase SQL Editor.');
      } else {
        showToast('Error saving product: ' + (err?.message || 'Check console.'));
      }
    } finally {
      setLoading(false);
      setEditingProduct(null);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', productId);
    }
    setProductsList(prev => {
      const updated = prev.filter(p => p.id !== productId);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('sun_golden_custom_products', JSON.stringify(updated));
          window.dispatchEvent(new Event('sun_golden_products_updated'));
        } catch {}
      }
      return updated;
    });
    showToast('Product deleted');
  };

  // Ensure storage bucket exists (auto-create on first use)
  const ensureBucketExists = async () => {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some(b => b.name === 'product-images');
      if (!exists) {
        const { error } = await supabase.storage.createBucket('product-images', {
          public: true,
          allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/gif'],
          fileSizeLimit: 2 * 1024 * 1024, // 2MB
        });
        if (error && !error.message?.includes('already exists')) {
          console.warn('Could not create bucket:', error.message);
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  };

  // Multi-Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setImageCompressing(true);
    try {
      const fileList = Array.from(files);
      const newImages: Array<{
        id: string;
        image_url: string;
        alt_text: string;
        display_order: number;
        is_cover: boolean;
      }> = [];

      // Ensure bucket exists before uploading
      const bucketReady = await ensureBucketExists();

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        let imageUrl = '';

        try {
          const compressed = await compressAndConvertToWebP(file, {
            maxSizeMB: 0.35,
            maxWidthOrHeight: 1600,
          });

          // Try to upload to Supabase Storage first
          if (bucketReady && isSupabaseConfigured && supabase) {
            const fileName = `product-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}.webp`;
            const { data, error } = await supabase.storage
              .from('product-images')
              .upload(fileName, compressed, { contentType: 'image/webp', upsert: true });

            if (!error && data) {
              const { data: urlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(data.path);
              imageUrl = urlData.publicUrl;
            }
          }

          // Fallback to blob URL if upload failed or no Supabase
          if (!imageUrl) {
            imageUrl = URL.createObjectURL(compressed);
          }
        } catch {
          imageUrl = URL.createObjectURL(file);
        }

        newImages.push({
          id: `img-${Date.now()}-${i}`,
          image_url: imageUrl,
          alt_text: file.name,
          display_order: editingProduct.images.length + i + 1,
          is_cover: editingProduct.images.length === 0 && i === 0,
        });
      }

      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, ...newImages],
      });

      showToast(`📸 Added ${newImages.length} image(s) to product!`);
    } catch (err) {
      console.error(err);
      showToast('Image upload failed');
    } finally {
      setImageCompressing(false);
      e.target.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    if (!editingProduct) return;
    const filtered = editingProduct.images.filter(img => img.id !== imageId);
    // If cover was removed, make first one cover
    if (filtered.length > 0 && !filtered.some(img => img.is_cover)) {
      filtered[0].is_cover = true;
    }
    setEditingProduct({ ...editingProduct, images: filtered });
  };

  const setCoverImage = (imageId: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      images: editingProduct.images.map(img => ({
        ...img,
        is_cover: img.id === imageId,
      })),
    });
  };

  // Translation field updater
  const updateTranslation = (field: keyof ProductTranslation, value: string | string[]) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      translations: {
        ...editingProduct.translations,
        [activeLang]: {
          ...editingProduct.translations[activeLang],
          [field]: value,
        },
      },
    });
  };

  // Seasonality toggle
  const toggleSeason = (monthKey: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      seasonality: {
        ...editingProduct.seasonality,
        [monthKey]: !editingProduct.seasonality[monthKey],
      },
    });
  };

  // Certification
  const addCertification = () => {
    if (!editingProduct || !newCertification.trim()) return;
    setEditingProduct({
      ...editingProduct,
      certifications: [...editingProduct.certifications, newCertification.trim()],
    });
    setNewCertification('');
  };

  const removeCertification = (index: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      certifications: editingProduct.certifications.filter((_, i) => i !== index),
    });
  };

  // ==================== Statistics ====================
  const totalProducts = productsList.length;
  const totalRFQs = rfqsList.length;
  const newRFQs = rfqsList.filter(r => r.status === 'new').length;
  const quotedRFQs = rfqsList.filter(r => r.status === 'quoted').length;
  const totalTonnage = rfqsList.reduce((sum, r) => sum + r.items.reduce((s, i) => s + i.quantity_tons, 0), 0);

  // Filtered RFQs
  const filteredRFQs = searchQuery
    ? rfqsList.filter(r =>
        r.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rfq_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rfqsList;

  // Top products
  const productRequestCounts: Record<string, number> = {};
  rfqsList.forEach(r => r.items.forEach(item => {
    productRequestCounts[item.product_name] = (productRequestCounts[item.product_name] || 0) + 1;
  }));
  const topProducts = Object.entries(productRequestCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <main className="admin-login">
        <form onSubmit={handleLogin} className="admin-login-card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '3.5rem', height: '3.5rem', borderRadius: '1rem',
              background: 'linear-gradient(135deg, #f5a623, #e8951e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
            }}>
              <Shield style={{ width: '1.5rem', height: '1.5rem', color: '#0d1f1a' }} />
            </div>
            <h1>Sun Golden Admin</h1>
            <p>Enter password to access the dashboard</p>
          </div>

          <div className="form-group">
            <label>Admin Password</label>
            <input
              type="password"
              placeholder='Enter password (or leave blank for demo)'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" style={{ marginTop: '0.5rem' }}>
            Access Dashboard
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span className={`connection-badge ${isSupabaseConfigured ? 'connected' : 'mock'}`}>
              <span className={`connection-dot ${isSupabaseConfigured ? 'online' : 'offline'}`} />
              {isSupabaseConfigured ? 'Supabase Connected' : 'Demo Mode (Mock Data)'}
            </span>
          </div>
        </form>
      </main>
    );
  }

  // ==================== MAIN DASHBOARD ====================
  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* Header */}
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #f5a623, #e8951e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Shield style={{ width: '1.25rem', height: '1.25rem', color: '#0d1f1a' }} />
            </div>
            <div className="admin-header-title">
              <h1>Sun Golden Admin</h1>
              <p>
                Product Catalog • Lead Pipeline • Analytics
                <span className={`connection-badge ${isSupabaseConfigured ? 'connected' : 'mock'}`} style={{ marginLeft: '0.75rem' }}>
                  <span className={`connection-dot ${isSupabaseConfigured ? 'online' : 'offline'}`} />
                  {isSupabaseConfigured ? 'Live' : 'Demo'}
                </span>
              </p>
            </div>
          </div>

          <div className="admin-tabs">
            {([
              { key: 'overview', label: 'Overview', icon: <BarChart3 style={{ width: '0.875rem', height: '0.875rem' }} /> },
              { key: 'rfqs', label: `RFQs (${rfqsList.length})`, icon: <FileSpreadsheet style={{ width: '0.875rem', height: '0.875rem' }} /> },
              { key: 'products', label: `Products (${productsList.length})`, icon: <Package style={{ width: '0.875rem', height: '0.875rem' }} /> },
              { key: 'settings', label: 'Settings', icon: <Settings style={{ width: '0.875rem', height: '0.875rem' }} /> },
            ] as const).map(tab => (
              <button
                key={tab.key}
                className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>
                  <Package style={{ width: '1.25rem', height: '1.25rem', color: '#60a5fa' }} />
                </div>
                <div className="stat-value">{totalProducts}</div>
                <div className="stat-label">Total Products</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(245,166,35,0.15)' }}>
                  <FileSpreadsheet style={{ width: '1.25rem', height: '1.25rem', color: '#f5a623' }} />
                </div>
                <div className="stat-value">{totalRFQs}</div>
                <div className="stat-label">Total RFQs</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', color: '#4ade80' }} />
                </div>
                <div className="stat-value">{quotedRFQs}</div>
                <div className="stat-label">Quoted</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.15)' }}>
                  <BarChart3 style={{ width: '1.25rem', height: '1.25rem', color: '#a855f7' }} />
                </div>
                <div className="stat-value">{totalTonnage.toLocaleString()}</div>
                <div className="stat-label">Total Tonnage (MT)</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {/* RFQ Status Breakdown */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h2>RFQ Pipeline Status</h2>
                    <p>Breakdown by current stage</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {STATUS_OPTIONS.map(s => {
                    const count = rfqsList.filter(r => r.status === s.value).length;
                    return (
                      <div key={s.value} style={{
                        padding: '1rem', borderRadius: '0.75rem',
                        background: 'rgba(6,78,40,0.15)', border: '1px solid rgba(34,135,49,0.15)',
                        textAlign: 'center'
                      }}>
                        <span className={`status-badge status-${s.value}`}>{s.label}</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginTop: '0.5rem' }}>{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Requested Products */}
              {topProducts.length > 0 && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h2>Top Requested Products</h2>
                      <p>Most popular items across all RFQs</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {topProducts.map(([name, count], i) => (
                      <div key={name} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
                        background: 'rgba(6,78,40,0.15)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <span style={{
                            width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem',
                            background: i === 0 ? 'rgba(245,166,35,0.2)' : 'rgba(34,135,49,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 700,
                            color: i === 0 ? '#f5a623' : '#4ade80',
                          }}>
                            {i + 1}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>{name}</span>
                        </div>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 700, color: '#f5a623',
                          padding: '0.125rem 0.5rem', borderRadius: '2rem',
                          background: 'rgba(245,166,35,0.1)',
                        }}>
                          {count} requests
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h2>Recent Activity</h2>
                    <p>Latest RFQ submissions</p>
                  </div>
                </div>
                <div className="activity-feed">
                  {rfqsList.slice(0, 5).map(rfq => (
                    <div key={rfq.id} className="activity-item">
                      <div className="activity-dot" style={{
                        background: rfq.status === 'new' ? '#60a5fa' :
                                   rfq.status === 'quoted' ? '#4ade80' :
                                   rfq.status === 'in_review' ? '#f5a623' : '#94a3b8'
                      }} />
                      <div>
                        <div className="activity-text">
                          <strong style={{ color: '#f5a623' }}>{rfq.company_name}</strong> submitted RFQ {rfq.rfq_number} — {rfq.items.reduce((s, i) => s + i.quantity_tons, 0)} MT
                        </div>
                        <div className="activity-time">
                          {rfq.created_at ? new Date(rfq.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==================== RFQS TAB ==================== */}
        {activeTab === 'rfqs' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Incoming Export Leads (RFQs)</h2>
                <p>View, manage status, and export importer inquiries</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search style={{
                    width: '0.875rem', height: '0.875rem', position: 'absolute',
                    left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b'
                  }} />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      padding: '0.5rem 0.75rem 0.5rem 2rem',
                      borderRadius: '0.625rem',
                      background: 'rgba(6,78,40,0.3)',
                      border: '1px solid rgba(34,135,49,0.3)',
                      color: '#fff', fontSize: '0.75rem', outline: 'none',
                      width: '14rem',
                    }}
                  />
                </div>
                <button className="btn btn-secondary btn-sm" onClick={exportToExcel}>
                  <Download style={{ width: '0.875rem', height: '0.875rem' }} /> Export Excel
                </button>
                <button className="btn btn-secondary btn-sm" onClick={loadData}>
                  <RefreshCw style={{ width: '0.875rem', height: '0.875rem' }} /> Refresh
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>RFQ Ref</th>
                    <th>Company & Contact</th>
                    <th>Country</th>
                    <th>Incoterm / ETD</th>
                    <th>Tons</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRFQs.map(rfq => {
                    const totalTons = rfq.items.reduce((s, i) => s + i.quantity_tons, 0);
                    const isExpanded = expandedRFQ === rfq.id;
                    return (
                      <React.Fragment key={rfq.id || rfq.rfq_number}>
                        <tr style={{ cursor: 'pointer' }} onClick={() => setExpandedRFQ(isExpanded ? null : rfq.id || null)}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f5a623' }}>{rfq.rfq_number}</td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{rfq.company_name}</div>
                            <div style={{ color: '#64748b', fontSize: '0.65rem' }}>{rfq.contact_name}</div>
                          </td>
                          <td style={{ color: '#e2e8f0' }}>{rfq.country}</td>
                          <td style={{ fontFamily: 'monospace', color: '#4ade80', fontSize: '0.7rem' }}>
                            {rfq.incoterm} • {rfq.estimated_etd}
                          </td>
                          <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{totalTons} MT</td>
                          <td>
                            <select
                              className="status-select"
                              value={rfq.status || 'new'}
                              onClick={e => e.stopPropagation()}
                              onChange={e => updateRFQStatus(rfq.id!, e.target.value as NonNullable<RFQ['status']>)}
                            >
                              {STATUS_OPTIONS.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={e => { e.stopPropagation(); exportRFQToPDF(rfq); }}
                                title="Download PDF"
                              >
                                <Download style={{ width: '0.75rem', height: '0.75rem' }} />
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={e => { e.stopPropagation(); setExpandedRFQ(isExpanded ? null : rfq.id || null); }}
                              >
                                {isExpanded ? <ChevronUp style={{ width: '0.75rem', height: '0.75rem' }} /> : <ChevronDown style={{ width: '0.75rem', height: '0.75rem' }} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={7} style={{ padding: '0 0.75rem 0.75rem' }}>
                              <div className="rfq-detail">
                                <dl className="rfq-detail-grid">
                                  <div><dt>Email</dt><dd>{rfq.email}</dd></div>
                                  <div><dt>Phone/WhatsApp</dt><dd>{rfq.phone_whatsapp}</dd></div>
                                  <div><dt>Port of Discharge</dt><dd>{rfq.port_of_discharge}</dd></div>
                                  <div><dt>GDPR Consent</dt><dd>{rfq.gdpr_consent ? '✅ Yes' : '❌ No'}</dd></div>
                                </dl>
                                {rfq.notes && (
                                  <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#94a3b8' }}>
                                    <strong style={{ color: '#f5a623' }}>Notes:</strong> {rfq.notes}
                                  </div>
                                )}
                                <div style={{ marginTop: '0.75rem' }}>
                                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                                    Requested Products
                                  </div>
                                  {rfq.items.map((item, i) => (
                                    <div key={i} style={{
                                      display: 'flex', justifyContent: 'space-between',
                                      padding: '0.375rem 0.625rem', borderRadius: '0.375rem',
                                      background: 'rgba(6,78,40,0.15)', marginBottom: '0.25rem',
                                      fontSize: '0.75rem',
                                    }}>
                                      <span style={{ color: '#e2e8f0' }}>{item.product_name}</span>
                                      <span style={{ color: '#f5a623', fontWeight: 700, fontFamily: 'monospace' }}>
                                        {item.quantity_tons} MT — {item.preferred_packaging}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredRFQs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
                No RFQ leads found.
              </div>
            )}
          </div>
        )}

        {/* ==================== PRODUCTS TAB ==================== */}
        {activeTab === 'products' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Agricultural Products Catalog</h2>
                <p>Manage products, translations, images & specifications</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={openNewProduct}>
                  <Plus style={{ width: '0.875rem', height: '0.875rem' }} /> Add Product
                </button>
                <button className="btn btn-secondary btn-sm" onClick={loadData}>
                  <RefreshCw style={{ width: '0.875rem', height: '0.875rem' }} /> Refresh
                </button>
              </div>
            </div>

            <div className="products-grid">
              {productsList.map((product, index) => (
                <div key={product.id} className="product-card">
                  <div className="product-card-img">
                    {product.images[0] && !product.images[0].image_url.startsWith('blob:') ? (
                      <img
                        src={product.images[0].image_url}
                        alt={product.translations.en.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f5a623;font-size:0.7rem">⚠️ Upload New Image</div>';
                        }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '0.75rem' }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <h3>{product.translations.en.name}</h3>
                  <div className="product-meta">
                    HS: <span>{product.hs_code || '—'}</span> • Brix: {product.brix_level || '—'}
                    {product.is_featured && (
                      <Star style={{ width: '0.75rem', height: '0.75rem', color: '#f5a623', display: 'inline', marginLeft: '0.25rem' }} />
                    )}
                  </div>
                  <div className="cert-tags" style={{ marginBottom: '0.75rem' }}>
                    {product.certifications.slice(0, 3).map((cert, i) => (
                      <span key={i} className="cert-tag">{cert}</span>
                    ))}
                  </div>
                  <div className="product-card-actions">
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEditProduct(product)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)}>
                      <Trash2 style={{ width: '0.75rem', height: '0.75rem' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {productsList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <Package style={{ width: '3rem', height: '3rem', margin: '0 auto 0.75rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.85rem' }}>No products yet. Click "Add Product" to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== SETTINGS TAB ==================== */}
        {activeTab === 'settings' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Site Settings</h2>
                <p>Manage company information, analytics & social links</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={async () => {
                if (isSupabaseConfigured && supabase) {
                  for (const [key, value] of Object.entries(siteSettings)) {
                    await supabase.from('site_settings').upsert(
                      { key, value: JSON.stringify(value), updated_at: new Date().toISOString() },
                      { onConflict: 'key' }
                    );
                  }
                }
                showToast('Settings saved!');
              }}>
                <Save style={{ width: '0.875rem', height: '0.875rem' }} /> Save Settings
              </button>
            </div>

            <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={siteSettings.company_name}
                  onChange={e => setSiteSettings({ ...siteSettings, company_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={siteSettings.phone}
                  onChange={e => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input
                  type="text"
                  value={siteSettings.whatsapp}
                  onChange={e => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  value={siteSettings.email}
                  onChange={e => setSiteSettings({ ...siteSettings, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Google Maps URL</label>
                <input
                  type="text"
                  value={siteSettings.google_maps_url}
                  onChange={e => setSiteSettings({ ...siteSettings, google_maps_url: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Google Analytics ID</label>
                <input
                  type="text"
                  value={siteSettings.google_analytics_id || ''}
                  onChange={e => setSiteSettings({ ...siteSettings, google_analytics_id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Microsoft Clarity ID</label>
                <input
                  type="text"
                  value={siteSettings.clarity_id || ''}
                  onChange={e => setSiteSettings({ ...siteSettings, clarity_id: e.target.value })}
                />
              </div>
            </div>

            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5a623', marginBottom: '0.75rem' }}>Social Links</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="text"
                  value={siteSettings.social_links.linkedin || ''}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    social_links: { ...siteSettings.social_links, linkedin: e.target.value }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="text"
                  value={siteSettings.social_links.facebook || ''}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    social_links: { ...siteSettings.social_links, facebook: e.target.value }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  value={siteSettings.social_links.instagram || ''}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    social_links: { ...siteSettings.social_links, instagram: e.target.value }
                  })}
                />
              </div>
              <div className="form-group">
                <label>YouTube</label>
                <input
                  type="text"
                  value={siteSettings.social_links.youtube || ''}
                  onChange={e => setSiteSettings({
                    ...siteSettings,
                    social_links: { ...siteSettings.social_links, youtube: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== PRODUCT EDITOR MODAL ==================== */}
        {editingProduct && (
          <div className="admin-modal-overlay" onClick={() => setEditingProduct(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>{isNewProduct ? '✨ New Product' : `Edit: ${editingProduct.translations.en.name}`}</h3>
                <button className="modal-close-btn" onClick={() => setEditingProduct(null)}>
                  <X style={{ width: '0.875rem', height: '0.875rem' }} />
                </button>
              </div>

              {/* Basic Info */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f5a623', marginBottom: '0.75rem' }}>
                  Basic Information
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={editingProduct.category_id}
                      onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.translations.en?.title || cat.slug}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>HS Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 0805.10"
                      value={editingProduct.hs_code}
                      onChange={e => setEditingProduct({ ...editingProduct, hs_code: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Storage Temp</label>
                    <input
                      type="text"
                      placeholder="e.g. 2-8°C"
                      value={editingProduct.storage_temp}
                      onChange={e => setEditingProduct({ ...editingProduct, storage_temp: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Brix Level</label>
                    <input
                      type="text"
                      placeholder="e.g. 11-14%"
                      value={editingProduct.brix_level}
                      onChange={e => setEditingProduct({ ...editingProduct, brix_level: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={editingProduct.is_featured}
                      onChange={e => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    />
                    <span>⭐ Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Translations */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f5a623', marginBottom: '0.75rem' }}>
                  <Globe style={{ width: '0.875rem', height: '0.875rem', display: 'inline', marginRight: '0.375rem' }} />
                  Multilingual Content
                </h4>

                <div className="lang-tabs">
                  {LOCALES.map(locale => (
                    <button
                      key={locale.code}
                      className={`lang-tab ${activeLang === locale.code ? 'active' : ''}`}
                      onClick={() => setActiveLang(locale.code)}
                    >
                      {locale.flag} {locale.label}
                    </button>
                  ))}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name ({activeLang.toUpperCase()})</label>
                    <input
                      type="text"
                      placeholder={`Product name in ${LOCALES.find(l => l.code === activeLang)?.label}`}
                      value={editingProduct.translations[activeLang]?.name || ''}
                      onChange={e => updateTranslation('name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Origin ({activeLang.toUpperCase()})</label>
                    <input
                      type="text"
                      placeholder="e.g. Nile Delta, Egypt"
                      value={editingProduct.translations[activeLang]?.origin || ''}
                      onChange={e => updateTranslation('origin', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label>Description ({activeLang.toUpperCase()})</label>
                  <textarea
                    placeholder={`Product description in ${LOCALES.find(l => l.code === activeLang)?.label}`}
                    value={editingProduct.translations[activeLang]?.description || ''}
                    onChange={e => updateTranslation('description', e.target.value)}
                  />
                </div>

                <div className="form-grid" style={{ marginTop: '0.75rem' }}>
                  <div className="form-group">
                    <label>Shelf Life ({activeLang.toUpperCase()})</label>
                    <input
                      type="text"
                      placeholder="e.g. 4-6 weeks"
                      value={editingProduct.translations[activeLang]?.shelf_life || ''}
                      onChange={e => updateTranslation('shelf_life', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Sizes ({activeLang.toUpperCase()}) — comma separated</label>
                    <input
                      type="text"
                      placeholder="e.g. 48-56mm, 56-64mm, 64-72mm"
                      value={(editingProduct.translations[activeLang]?.sizes || []).join(', ')}
                      onChange={e => updateTranslation('sizes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Variety</label>
                    <input
                      type="text"
                      value={editingProduct.translations[activeLang]?.variety || ''}
                      onChange={e => updateTranslation('variety', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Grade</label>
                    <input
                      type="text"
                      value={editingProduct.translations[activeLang]?.grade || ''}
                      onChange={e => updateTranslation('grade', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f5a623', marginBottom: '0.75rem' }}>
                  Product Images
                </h4>

                <label className="upload-zone" style={{ marginBottom: '0.75rem', cursor: 'pointer' }} htmlFor="product-image-upload">
                  <Upload style={{ width: '1.5rem', height: '1.5rem', color: '#f5a623', margin: '0 auto 0.25rem', display: 'block' }} />
                  <p>Drop or click to upload — Auto-compressed to WebP</p>
                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={imageCompressing}
                    style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, overflow: 'hidden' }}
                  />
                  {imageCompressing && (
                    <p style={{ color: '#f5a623', fontSize: '0.7rem', fontWeight: 700, marginTop: '0.5rem', animation: 'pulse 1.5s infinite' }}>
                      Compressing to WebP...
                    </p>
                  )}
                </label>

                {editingProduct.images.length > 0 && (
                  <div className="image-gallery">
                    {editingProduct.images.map(img => {
                      const isBroken = img.image_url.startsWith('blob:');
                      return (
                        <div key={img.id} className={`image-thumb ${img.is_cover ? 'cover' : ''}`} onClick={() => setCoverImage(img.id)}>
                          {isBroken ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '0.5rem', textAlign: 'center', padding: '0.25rem' }}>
                              ⚠️ Expired<br/>Re-upload
                            </div>
                          ) : (
                            <img
                              src={img.image_url}
                              alt={img.alt_text}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.insertAdjacentHTML('afterbegin', '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:rgba(239,68,68,0.15);color:#f87171;font-size:0.5rem;text-align:center;padding:0.25rem">⚠️ Broken</div>');
                              }}
                            />
                          )}
                          <button
                            className="image-thumb-delete"
                            onClick={e => { e.stopPropagation(); removeImage(img.id); }}
                          >
                            ✕
                          </button>
                          {img.is_cover && <div className="image-thumb-cover">COVER</div>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Seasonality */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f5a623', marginBottom: '0.75rem' }}>
                  Seasonality
                </h4>
                <div className="season-grid">
                  {MONTHS.map((month, i) => (
                    <button
                      key={month}
                      className={`season-cell ${editingProduct.seasonality[MONTH_KEYS[i]] ? 'active' : ''}`}
                      onClick={() => toggleSeason(MONTH_KEYS[i])}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f5a623', marginBottom: '0.75rem' }}>
                  Certifications
                </h4>
                <div className="cert-tags" style={{ marginBottom: '0.5rem' }}>
                  {editingProduct.certifications.map((cert, i) => (
                    <span key={i} className="cert-tag">
                      {cert}
                      <button onClick={() => removeCertification(i)}>✕</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. GLOBALG.A.P."
                    value={newCertification}
                    onChange={e => setNewCertification(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    style={{
                      flex: 1, padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                      background: 'rgba(6,78,40,0.3)', border: '1px solid rgba(34,135,49,0.3)',
                      color: '#fff', fontSize: '0.75rem', outline: 'none',
                    }}
                  />
                  <button className="btn btn-secondary btn-sm" onClick={addCertification}>
                    <Plus style={{ width: '0.75rem', height: '0.75rem' }} /> Add
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                className="btn btn-primary btn-full"
                onClick={saveProduct}
                disabled={loading || !editingProduct.translations.en.name}
                style={{ padding: '0.875rem', fontSize: '0.85rem' }}
              >
                {loading ? (
                  <RefreshCw style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Save style={{ width: '1rem', height: '1rem' }} />
                )}
                {isNewProduct ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="admin-toast">
            <CheckCircle2 style={{ width: '1rem', height: '1rem' }} />
            {toast}
          </div>
        )}
      </div>
    </main>
  );
}

// ==================== Helpers ====================

function transformSupabaseProduct(row: any): Product {
  const translations: any = {};
  if (row.product_translations) {
    for (const t of row.product_translations) {
      translations[t.locale] = {
        name: t.name, description: t.description, origin: t.origin,
        shelf_life: t.shelf_life, sizes: t.sizes || [],
        variety: t.variety || '', grade: t.grade || '',
        color: t.color || '', harvest_method: t.harvest_method || '',
        average_diameter: t.average_diameter || '',
      };
    }
  }
  return {
    id: row.id, slug: row.slug, category_id: row.category_id,
    hs_code: row.hs_code || '', storage_temp: row.storage_temp || '',
    brix_level: row.brix_level || '', pdf_catalog_url: row.pdf_catalog_url || '',
    is_featured: row.is_featured || false,
    seasonality: row.seasonality || {}, season_status: row.season_status || {},
    translations,
    images: (row.product_images || []).map((img: any) => ({
      id: img.id, product_id: img.product_id, image_url: img.image_url,
      alt_text: img.alt_text || '', display_order: img.display_order || 0,
      is_cover: img.is_cover || false,
    })),
    container_rules: (row.container_rules || []).map((cr: any) => ({
      id: cr.id, product_id: cr.product_id, package_type: cr.package_type,
      net_weight_kg: cr.net_weight_kg || 0, gross_weight_kg: cr.gross_weight_kg || 0,
      cartons_per_pallet: cr.cartons_per_pallet || 0,
      pallets_per_40ft_reefer: cr.pallets_per_40ft_reefer || 0,
      pallets_per_20ft_reefer: cr.pallets_per_20ft_reefer || 0,
    })),
    certifications: row.certifications || [],
  };
}

function transformSupabaseCategory(row: any): Category {
  const translations: any = {};
  if (row.category_translations) {
    for (const t of row.category_translations) {
      translations[t.locale] = { title: t.title, description: t.description || '' };
    }
  }
  return { id: row.id, slug: row.slug, translations };
}

function transformSupabaseRFQ(row: any): RFQ {
  return {
    id: row.id, rfq_number: row.rfq_number,
    company_name: row.company_name, contact_name: row.contact_name,
    email: row.email, phone_whatsapp: row.phone_whatsapp,
    country: row.country, port_of_discharge: row.port_of_discharge,
    incoterm: row.incoterm, estimated_etd: row.estimated_etd,
    notes: row.notes, gdpr_consent: row.gdpr_consent,
    status: row.status, created_at: row.created_at,
    items: (row.rfq_items || []).map((item: any) => ({
      product_id: item.product_id, product_name: item.product_name,
      quantity_tons: item.quantity_tons, preferred_packaging: item.preferred_packaging,
    })),
  };
}

function getSampleRFQs(): RFQ[] {
  return [
    {
      id: 'rfq-1', rfq_number: 'SG-2026-0042',
      company_name: 'Nordic Agro Importers GmbH', contact_name: 'Hans Mueller',
      email: 'h.mueller@nordic-agro.de', phone_whatsapp: '+49 170 555 4321',
      country: 'Germany', port_of_discharge: 'Hamburg Port',
      incoterm: 'CIF', estimated_etd: '2026-08-15',
      notes: 'Requires Brix > 12.0% & Telescope cartons 15kg.',
      gdpr_consent: true,
      items: [
        { product_id: 'prod-valencia-orange', product_name: 'Fresh Egyptian Valencia Oranges', quantity_tons: 48, preferred_packaging: 'Telescope Carton (15 KG Net)' }
      ],
      status: 'new', created_at: '2026-07-28T14:30:00Z',
    },
    {
      id: 'rfq-2', rfq_number: 'SG-2026-0039',
      company_name: 'Iberica Frutas S.L.', contact_name: 'Carlos Benitez',
      email: 'carlos@ibericafrutas.es', phone_whatsapp: '+34 612 345 678',
      country: 'Spain', port_of_discharge: 'Valencia Port',
      incoterm: 'FOB', estimated_etd: '2026-08-20',
      notes: 'IQF Strawberry Grade A 10x250g punnets',
      gdpr_consent: true,
      items: [
        { product_id: 'prod-iqf-strawberry', product_name: 'Egyptian IQF & Fresh Strawberries', quantity_tons: 22, preferred_packaging: 'Punnets 10 x 250g' }
      ],
      status: 'quoted', created_at: '2026-07-27T09:15:00Z',
    },
  ];
}
