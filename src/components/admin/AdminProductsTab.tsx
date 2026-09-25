'use client';

import React, { useState } from 'react';
import { Product, Category, Locale, ProductTranslation } from '@/types';
import {
  Plus,
  Trash2,
  Save,
  Search,
  Globe,
  Upload,
  Star,
  X,
  RefreshCw,
  Package,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { compressAndConvertToWebP } from '@/lib/imageCompression';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AdminProductsTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  showToast: (msg: string) => void;
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const EMPTY_TRANSLATION: ProductTranslation = {
  name: '',
  description: '',
  origin: 'Egypt',
  shelf_life: '',
  sizes: [],
  variety: '',
  grade: '',
  color: '',
  harvest_method: '',
  average_diameter: '',
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

export function AdminProductsTab({ products, setProducts, categories, showToast }: AdminProductsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<(Omit<Product, 'id'> & { id?: string }) | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [activeLang, setActiveLang] = useState<Locale>('en');
  const [isCompressing, setIsCompressing] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredProducts = products.filter((p) => {
    const name = p.translations.en?.name || p.slug;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !categoryFilter || p.category_id === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openNewProduct = () => {
    setEditingProduct(createEmptyProduct());
    setIsNewProduct(true);
    setActiveLang('en');
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(prod)));
    setIsNewProduct(false);
    setActiveLang('en');
  };

  const ensureBucketExists = async () => {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === 'product-images');
      if (!exists) {
        await supabase.storage.createBucket('product-images', {
          public: true,
          allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/gif'],
          fileSizeLimit: 2 * 1024 * 1024,
        });
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setIsCompressing(true);
    try {
      const fileList = Array.from(files);
      const newImages: any[] = [];
      const bucketReady = await ensureBucketExists();

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        let imageUrl = '';

        try {
          const compressed = await compressAndConvertToWebP(file, {
            maxSizeMB: 0.35,
            maxWidthOrHeight: 1600,
          });

          if (bucketReady && isSupabaseConfigured && supabase) {
            const fileName = `product-${Date.now()}-${i}.webp`;
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
      showToast(`Added ${newImages.length} image(s) to product`);
    } catch (err) {
      console.error(err);
      showToast('Image upload failed');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    if (!editingProduct) return;
    const filtered = editingProduct.images.filter((img) => img.id !== imageId);
    if (filtered.length > 0 && !filtered.some((img) => img.is_cover)) {
      filtered[0].is_cover = true;
    }
    setEditingProduct({ ...editingProduct, images: filtered });
  };

  const setCoverImage = (imageId: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      images: editingProduct.images.map((img) => ({
        ...img,
        is_cover: img.id === imageId,
      })),
    });
  };

  const updateTranslation = (field: keyof ProductTranslation, value: any) => {
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

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);

    try {
      if (isNewProduct) {
        const slug =
          editingProduct.translations.en.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || `crop-${Date.now()}`;

        let newId = `prod_${Date.now()}`;

        if (isSupabaseConfigured && supabase) {
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
              display_order: products.length,
            })
            .select()
            .single();

          if (error || !row) throw error;
          newId = row.id;

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
          ...(editingProduct as Product),
          id: newId,
          slug,
        };

        setProducts((prev) => [...prev, newProd]);
        showToast('Product created successfully!');
      } else {
        // Update existing
        if (isSupabaseConfigured && supabase && editingProduct.id) {
          await supabase
            .from('products')
            .update({
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
            })
            .eq('id', editingProduct.id);

          for (const locale of LOCALES) {
            const t = editingProduct.translations[locale.code];
            if (t) {
              await supabase.from('product_translations').upsert(
                {
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
                },
                { onConflict: 'product_id,locale' }
              );
            }
          }
        }

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? (editingProduct as Product) : p))
        );
        showToast('Product updated successfully!');
      }
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Save failed:', err);
      showToast('Error saving product: ' + (err?.message || 'Check connection.'));
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', productId);
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Controls Bar */}
      <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search produce name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white placeholder-emerald-700 text-xs focus:outline-none focus:border-emerald-400"
            />
            <Search className="w-4 h-4 text-emerald-500/60 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-emerald-200 text-xs focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.translations.en?.title || c.slug}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openNewProduct}
          className="w-full sm:w-auto px-4 py-2 bg-[#258746] hover:bg-[#1f733b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Produce</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="bg-[#0f2719] text-emerald-300/80 uppercase font-bold border-b border-emerald-800">
              <tr>
                <th className="py-3.5 px-4">Crop Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">HS Code</th>
                <th className="py-3.5 px-4">Storage Temp</th>
                <th className="py-3.5 px-4">Brix</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/50">
              {filteredProducts.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                return (
                  <tr key={p.id} className="hover:bg-emerald-900/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{p.translations.en?.name || p.slug}</div>
                      <div className="text-[10px] text-emerald-400/60">{p.slug}</div>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-200/80">
                      {cat?.translations.en?.title || 'General'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-300">
                      {p.hs_code || '—'}
                    </td>
                    <td className="py-3.5 px-4">{p.storage_temp || '—'}</td>
                    <td className="py-3.5 px-4">{p.brix_level || '—'}</td>
                    <td className="py-3.5 px-4">
                      {p.is_featured ? (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" /> Yes
                        </span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="px-3 py-1 bg-emerald-700/60 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1 text-rose-400/60 hover:text-rose-400 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#163522] border border-emerald-500/30 rounded-3xl w-full max-w-4xl p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
              <h3 className="text-xl font-bold font-serif">
                {isNewProduct ? '✨ Add New Export Produce' : `Edit: ${editingProduct.translations.en?.name || editingProduct.slug}`}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-emerald-300/70 hover:text-white hover:bg-emerald-800/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-3">
              <span className="text-xs text-emerald-400 font-bold mr-2 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Language:
              </span>
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => setActiveLang(loc.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeLang === loc.code
                      ? 'bg-[#258746] text-white shadow'
                      : 'bg-[#0f2719] text-emerald-300 hover:bg-emerald-900/50'
                  }`}
                >
                  <span>{loc.flag}</span>
                  <span>{loc.label}</span>
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-6 text-xs">
              {/* Row 1: Name, Category, HS Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">
                    Crop Name ({activeLang.toUpperCase()})*
                  </label>
                  <input
                    type="text"
                    value={editingProduct.translations[activeLang]?.name || ''}
                    onChange={(e) => updateTranslation('name', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Category</label>
                  <select
                    value={editingProduct.category_id}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.translations.en?.title || c.slug}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-300 font-bold mb-1">HS Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 0805.10"
                    value={editingProduct.hs_code || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, hs_code: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Storage Temp, Brix, Shelf Life */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Storage / Transport Temp</label>
                  <input
                    type="text"
                    placeholder="e.g. +3°C to +5°C"
                    value={editingProduct.storage_temp || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, storage_temp: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Brix Level</label>
                  <input
                    type="text"
                    placeholder="e.g. 11° - 14°"
                    value={editingProduct.brix_level || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brix_level: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-bold mb-1">Shelf Life</label>
                  <input
                    type="text"
                    placeholder="e.g. 60–90 Days"
                    value={editingProduct.translations[activeLang]?.shelf_life || ''}
                    onChange={(e) => updateTranslation('shelf_life', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-emerald-300 font-bold mb-1">
                  Description ({activeLang.toUpperCase()})
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.translations[activeLang]?.description || ''}
                  onChange={(e) => updateTranslation('description', e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Seasonality Grid */}
              <div className="bg-[#0f2719] p-4 rounded-2xl border border-emerald-900/60 space-y-2">
                <label className="block text-emerald-300 font-bold">
                  Annual Availability Season (Check active months)
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {MONTH_KEYS.map((mKey, idx) => {
                    const active = Boolean(editingProduct.seasonality?.[mKey]);
                    return (
                      <button
                        key={mKey}
                        type="button"
                        onClick={() => toggleSeason(mKey)}
                        className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          active
                            ? 'bg-[#258746] text-white shadow'
                            : 'bg-[#0a180f] text-gray-500 hover:text-white'
                        }`}
                      >
                        {MONTHS[idx]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Images */}
              <div className="bg-[#0f2719] p-4 rounded-2xl border border-emerald-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-emerald-300 font-bold">Product Photography (WebP Auto-Compression)</label>
                  <label className="px-3 py-1.5 bg-[#258746] hover:bg-[#1f733b] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isCompressing ? 'Compressing...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {editingProduct.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative rounded-xl overflow-hidden border border-emerald-800/80 bg-black/40 group aspect-video"
                    >
                      <img
                        src={img.image_url}
                        alt={img.alt_text || 'crop'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCoverImage(img.id)}
                          className={`p-1.5 rounded-lg text-xs ${
                            img.is_cover ? 'bg-amber-500 text-black font-bold' : 'bg-white/20 text-white'
                          }`}
                          title="Set as Cover"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="p-1.5 rounded-lg bg-rose-600/80 text-white hover:bg-rose-600"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {img.is_cover && (
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-amber-500 text-black text-[9px] font-black rounded-md">
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-800">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveProduct}
                className="px-6 py-2 bg-[#258746] hover:bg-[#1f733b] text-white font-bold rounded-xl transition-all cursor-pointer text-xs flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Produce</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
