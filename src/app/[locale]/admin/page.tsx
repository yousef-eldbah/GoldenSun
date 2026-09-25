'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Package,
  FileSpreadsheet,
  Settings,
  BarChart3,
  Globe,
  LogOut,
  RefreshCw,
  FolderTree,
  MessageSquare
} from 'lucide-react';
import { mockProducts, mockCategories, mockSiteSettings } from '@/lib/mockData';
import { RFQ, Product, Category, SiteSettings, ContactInquiry } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminOverviewTab } from '@/components/admin/AdminOverviewTab';
import { AdminRFQsTab } from '@/components/admin/AdminRFQsTab';
import { AdminContactsTab } from '@/components/admin/AdminContactsTab';
import { AdminProductsTab } from '@/components/admin/AdminProductsTab';
import { AdminCategoriesTab } from '@/components/admin/AdminCategoriesTab';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';
import './admin.css';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'rfqs' | 'contacts' | 'products' | 'categories' | 'settings'>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  // Data states
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rfqsList, setRfqsList] = useState<RFQ[]>([]);
  const [contactsList, setContactsList] = useState<ContactInquiry[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(mockSiteSettings);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }, []);

  // 1. Check server-side session authentication status
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session');
      const data = await res.json();
      setIsAuthenticated(Boolean(data?.authenticated));
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  // 2. Load administrative data from Supabase (or mock fallback)
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const [productsRes, categoriesRes, rfqsRes, settingsRes, contactsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*, product_translations(*), product_images(*), container_rules(*)'),
          supabase.from('categories').select('*, category_translations(*)'),
          supabase.from('rfqs').select('*, rfq_items(*)').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*'),
          supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false }),
        ]);

        if (productsRes.data && productsRes.data.length > 0) {
          const transformed = productsRes.data.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            category_id: p.category_id,
            hs_code: p.hs_code || '',
            storage_temp: p.storage_temp || '',
            brix_level: p.brix_level || '',
            pdf_catalog_url: p.pdf_catalog_url || '',
            is_featured: p.is_featured || false,
            seasonality: p.seasonality || {},
            season_status: p.season_status || {},
            certifications: p.certifications || [],
            translations: (p.product_translations || []).reduce((acc: any, t: any) => {
              acc[t.locale] = t;
              return acc;
            }, {}),
            images: p.product_images || [],
            container_rules: p.container_rules || [],
          }));
          setProductsList(transformed);
        } else {
          setProductsList([...mockProducts]);
        }

        if (categoriesRes.data && categoriesRes.data.length > 0) {
          const transformedCats = categoriesRes.data.map((c: any) => ({
            id: c.id,
            slug: c.slug,
            translations: (c.category_translations || []).reduce((acc: any, t: any) => {
              acc[t.locale] = t;
              return acc;
            }, {}),
          }));
          setCategories(transformedCats);
        } else {
          setCategories([...mockCategories]);
        }

        if (rfqsRes.data) {
          const transformedRFQs = rfqsRes.data.map((r: any) => ({
            id: r.id,
            rfq_number: r.rfq_number,
            company_name: r.company_name,
            contact_name: r.contact_name,
            email: r.email,
            phone_whatsapp: r.phone_whatsapp,
            country: r.country,
            port_of_discharge: r.port_of_discharge,
            incoterm: r.incoterm,
            estimated_etd: r.estimated_etd,
            notes: r.notes,
            gdpr_consent: r.gdpr_consent,
            status: r.status,
            created_at: r.created_at,
            items: r.rfq_items || [],
          }));
          setRfqsList(transformedRFQs);
        }

        if (settingsRes.data && settingsRes.data.length > 0) {
          const settingsMap = settingsRes.data.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {});
          setSiteSettings({ ...mockSiteSettings, ...settingsMap });
        }

        if (contactsRes.data) {
          setContactsList(contactsRes.data as ContactInquiry[]);
        }
      } else {
        setProductsList([...mockProducts]);
        setCategories([...mockCategories]);
      }
    } catch (err) {
      console.error('Failed to load administrative data:', err);
      setProductsList([...mockProducts]);
      setCategories([...mockCategories]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
  };

  // Checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0d1f14] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  // Not authenticated -> show server-protected login modal
  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-page text-white">
      <div className="admin-container space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#258746]/20 border border-[#258746]/40 text-[#258746] flex items-center justify-center shadow-inner">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-serif tracking-tight text-white">
                Golden Sun Export
              </h1>
              <p className="text-xs text-emerald-300/70 font-medium">
                Admin Management Desk • {isSupabaseConfigured ? '🟢 Live Database' : '🟡 Mock Mode'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-[#163522] p-1.5 rounded-2xl border border-emerald-500/20 flex-wrap">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#258746] text-white shadow-md'
                  : 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('rfqs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'rfqs'
                  ? 'bg-[#258746] text-white shadow-md'
                  : 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>RFQs ({rfqsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'contacts'
                  ? 'bg-[#258746] text-white shadow-md'
                  : 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contacts ({contactsList.length})</span>
              {contactsList.some((c) => c.status === 'new') && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#258746] text-white shadow-md'
                  : 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({productsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#258746] text-white shadow-md'
                  : 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#258746] text-white shadow-md'
                  : 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-xs font-bold text-rose-300 hover:text-rose-100 hover:bg-rose-900/30 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
              title="End Secure Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </nav>
        </header>

        {/* Content Tabs */}
        <main>
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-emerald-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">Synchronizing administrative data...</span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <AdminOverviewTab
                  rfqs={rfqsList}
                  products={productsList}
                  contacts={contactsList}
                  onSelectTab={(tab) => setActiveTab(tab)}
                  onSelectRFQ={(rfq) => {
                    setSelectedRFQ(rfq);
                    setActiveTab('rfqs');
                  }}
                />
              )}

              {activeTab === 'rfqs' && (
                <AdminRFQsTab
                  rfqs={rfqsList}
                  setRfqs={setRfqsList}
                  selectedRFQ={selectedRFQ}
                  setSelectedRFQ={setSelectedRFQ}
                  showToast={showToast}
                />
              )}

              {activeTab === 'contacts' && (
                <AdminContactsTab
                  contacts={contactsList}
                  setContacts={setContactsList}
                  showToast={showToast}
                />
              )}

              {activeTab === 'products' && (
                <AdminProductsTab
                  products={productsList}
                  setProducts={setProductsList}
                  categories={categories}
                  showToast={showToast}
                />
              )}

              {activeTab === 'categories' && (
                <AdminCategoriesTab
                  categories={categories}
                  setCategories={setCategories}
                  showToast={showToast}
                />
              )}

              {activeTab === 'settings' && (
                <AdminSettingsTab
                  siteSettings={siteSettings}
                  setSiteSettings={setSiteSettings}
                  showToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-2xl border border-emerald-400/30 animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}
    </div>
  );
}
