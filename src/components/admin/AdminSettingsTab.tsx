'use client';

import React from 'react';
import { SiteSettings } from '@/types';
import { Save, Globe } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AdminSettingsTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  showToast: (msg: string) => void;
}

export function AdminSettingsTab({ siteSettings, setSiteSettings, showToast }: AdminSettingsTabProps) {
  const saveSettings = async () => {
    if (isSupabaseConfigured && supabase) {
      for (const [key, value] of Object.entries(siteSettings)) {
        await supabase.from('site_settings').upsert(
          { key, value: JSON.stringify(value), updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      }
    }
    showToast('Site settings updated successfully!');
  };

  return (
    <div className="admin-card animate-in fade-in duration-300">
      <div className="admin-card-header">
        <div>
          <h2>Site Settings</h2>
          <p>Commercial contact channels and tracking configuration</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={saveSettings}>
          <Save style={{ width: '0.875rem', height: '0.875rem' }} /> Save Settings
        </button>
      </div>

      <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Company Legal Name</label>
          <input
            type="text"
            value={siteSettings.company_name}
            onChange={(e) => setSiteSettings({ ...siteSettings, company_name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Official Telephone</label>
          <input
            type="text"
            value={siteSettings.phone}
            onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Export WhatsApp (with country code)</label>
          <input
            type="text"
            value={siteSettings.whatsapp}
            onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Commercial Inquiries Email</label>
          <input
            type="text"
            value={siteSettings.email}
            onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Google Maps Embed / Location URL</label>
          <input
            type="text"
            value={siteSettings.google_maps_url}
            onChange={(e) => setSiteSettings({ ...siteSettings, google_maps_url: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Google Analytics ID</label>
          <input
            type="text"
            value={siteSettings.google_analytics_id || ''}
            onChange={(e) => setSiteSettings({ ...siteSettings, google_analytics_id: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Microsoft Clarity ID</label>
          <input
            type="text"
            value={siteSettings.clarity_id || ''}
            onChange={(e) => setSiteSettings({ ...siteSettings, clarity_id: e.target.value })}
          />
        </div>
      </div>

      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5a623', marginBottom: '0.75rem' }}>
        Social Media Presence
      </h3>
      <div className="form-grid">
        <div className="form-group">
          <label>LinkedIn Corporate URL</label>
          <input
            type="text"
            value={siteSettings.social_links.linkedin || ''}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                social_links: { ...siteSettings.social_links, linkedin: e.target.value },
              })
            }
          />
        </div>
        <div className="form-group">
          <label>Facebook Page URL</label>
          <input
            type="text"
            value={siteSettings.social_links.facebook || ''}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                social_links: { ...siteSettings.social_links, facebook: e.target.value },
              })
            }
          />
        </div>
        <div className="form-group">
          <label>Instagram URL</label>
          <input
            type="text"
            value={siteSettings.social_links.instagram || ''}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                social_links: { ...siteSettings.social_links, instagram: e.target.value },
              })
            }
          />
        </div>
        <div className="form-group">
          <label>YouTube Channel URL</label>
          <input
            type="text"
            value={siteSettings.social_links.youtube || ''}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                social_links: { ...siteSettings.social_links, youtube: e.target.value },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
