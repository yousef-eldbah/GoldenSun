'use client';

import React from 'react';
import { Category, Locale } from '@/types';
import { Plus, Trash2, Save, Globe } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AdminCategoriesTabProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  showToast: (msg: string) => void;
}

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export function AdminCategoriesTab({ categories, setCategories, showToast }: AdminCategoriesTabProps) {
  const [activeLang, setActiveLang] = React.useState<Locale>('en');

  const addCategory = () => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      slug: `new-category-${Date.now()}`,
      translations: {
        en: { title: 'New Category', description: '' },
        de: { title: 'Neue Kategorie', description: '' },
        es: { title: 'Nueva Categoría', description: '' },
      },
    };
    setCategories((prev) => [...prev, newCat]);
    showToast('New category added locally. Click save to persist.');
  };

  const removeCategory = async (catId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    if (isSupabaseConfigured && supabase) {
      await supabase.from('categories').delete().eq('id', catId);
    }
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast('Category deleted');
  };

  const saveCategories = async () => {
    if (isSupabaseConfigured && supabase) {
      for (const cat of categories) {
        await supabase.from('categories').upsert({ id: cat.id, slug: cat.slug });
        for (const [locale, trans] of Object.entries(cat.translations)) {
          await supabase.from('category_translations').upsert(
            {
              category_id: cat.id,
              locale,
              title: trans.title,
              description: trans.description,
            },
            { onConflict: 'category_id,locale' }
          );
        }
      }
    }
    showToast('All categories saved successfully!');
  };

  return (
    <div className="admin-card animate-in fade-in duration-300">
      <div className="admin-card-header">
        <div>
          <h2>Manage Categories</h2>
          <p>Configure product categories and their translations</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={addCategory}>
            <Plus style={{ width: '0.875rem', height: '0.875rem' }} /> Add Category
          </button>
          <button className="btn btn-primary btn-sm" onClick={saveCategories}>
            <Save style={{ width: '0.875rem', height: '0.875rem' }} /> Save Changes
          </button>
        </div>
      </div>

      {/* Language Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {LOCALES.map((loc) => (
          <button
            key={loc.code}
            className={`btn btn-sm ${activeLang === loc.code ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveLang(loc.code)}
          >
            <span>{loc.flag}</span>
            <span>{loc.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            style={{
              background: 'rgba(6, 78, 40, 0.2)',
              border: '1px solid rgba(34, 135, 49, 0.25)',
              borderRadius: '0.75rem',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#{idx + 1}</span>
                <input
                  type="text"
                  value={cat.slug}
                  onChange={(e) => {
                    const updated = [...categories];
                    updated[idx].slug = e.target.value;
                    setCategories(updated);
                  }}
                  placeholder="Slug (e.g. fresh-fruits)"
                  style={{
                    background: 'rgba(6, 78, 40, 0.4)',
                    border: '1px solid rgba(34, 135, 49, 0.3)',
                    color: '#fff',
                    borderRadius: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                  }}
                />
              </div>
              <button
                onClick={() => removeCategory(cat.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <Trash2 style={{ width: '0.875rem', height: '0.875rem' }} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Title ({activeLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={cat.translations[activeLang]?.title || ''}
                  onChange={(e) => {
                    const updated = [...categories];
                    if (!updated[idx].translations[activeLang]) {
                      updated[idx].translations[activeLang] = { title: '', description: '' };
                    }
                    updated[idx].translations[activeLang].title = e.target.value;
                    setCategories(updated);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Description ({activeLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={cat.translations[activeLang]?.description || ''}
                  onChange={(e) => {
                    const updated = [...categories];
                    if (!updated[idx].translations[activeLang]) {
                      updated[idx].translations[activeLang] = { title: '', description: '' };
                    }
                    updated[idx].translations[activeLang].description = e.target.value;
                    setCategories(updated);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
