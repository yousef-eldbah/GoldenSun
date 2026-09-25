'use client';

import React from 'react';
import { RFQ, Product, ContactInquiry } from '@/types';
import { BarChart3, FileSpreadsheet, Package, CheckCircle2, Clock, Globe, ArrowUpRight, MessageSquare } from 'lucide-react';

interface AdminOverviewTabProps {
  rfqs: RFQ[];
  products: Product[];
  contacts?: ContactInquiry[];
  onSelectTab: (tab: 'rfqs' | 'contacts' | 'products' | 'categories' | 'settings') => void;
  onSelectRFQ: (rfq: RFQ) => void;
}

export function AdminOverviewTab({ rfqs, products, contacts = [], onSelectTab, onSelectRFQ }: AdminOverviewTabProps) {
  const newRFQs = rfqs.filter((r) => r.status === 'new' || !r.status);
  const inReviewRFQs = rfqs.filter((r) => r.status === 'in_review');
  const quotedRFQs = rfqs.filter((r) => r.status === 'quoted');
  const newContacts = contacts.filter((c) => c.status === 'new');

  const totalTonnage = rfqs.reduce((acc, r) => {
    return acc + (r.items?.reduce((s, i) => s + (Number(i.quantity_tons) || 0), 0) || 0);
  }, 0);

  const countries = Array.from(new Set(rfqs.map((r) => r.country).filter(Boolean)));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total RFQs */}
        <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300/70">
              Total Inquiries (RFQs)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-serif">{rfqs.length}</span>
            <span className="text-xs text-emerald-400 font-bold">Leads</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-300/60">
            {newRFQs.length} new inquiry awaiting response
          </p>
        </div>

        {/* Card 2: Active Pipeline */}
        <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300/70">
              In Review / Pending
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-serif">{inReviewRFQs.length}</span>
            <span className="text-xs text-amber-400 font-bold">In Review</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-300/60">
            {quotedRFQs.length} quotes sent
          </p>
        </div>

        {/* Card 3: Total Cargo Requested */}
        <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300/70">
              Total Cargo Demand
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-serif">{totalTonnage.toLocaleString()}</span>
            <span className="text-xs text-blue-400 font-bold">MT (Tons)</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-300/60">
            Across {countries.length} destination countries
          </p>
        </div>

        {/* Card 4: Contact Messages */}
        <div
          onClick={() => onSelectTab('contacts')}
          className="bg-[#163522] border border-emerald-500/20 hover:border-emerald-400/40 cursor-pointer rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300/70">
              Contact Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-serif">{contacts.length}</span>
            <span className="text-xs text-teal-400 font-bold">Messages</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-300/60">
            {newContacts.length} unread / new
          </p>
        </div>

        {/* Card 5: Catalog Produce */}
        <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300/70">
              Active Crops
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-serif">{products.length}</span>
            <span className="text-xs text-purple-400 font-bold">Products</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-300/60">
            Multi-lingual (EN, DE, ES)
          </p>
        </div>
      </div>

      {/* Recent RFQ Leads Table */}
      <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">Recent RFQ Inquiries</h3>
            <p className="text-xs text-emerald-300/70">Latest commercial requests from overseas importers</p>
          </div>
          <button
            onClick={() => onSelectTab('rfqs')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All RFQs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {rfqs.length === 0 ? (
          <div className="text-center py-12 text-emerald-400/60 text-sm">
            No inquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-emerald-100">
              <thead className="bg-[#0f2719] text-emerald-300/80 uppercase font-bold border-b border-emerald-800">
                <tr>
                  <th className="py-3 px-4">RFQ Ref</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Cargo / Tonnage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/50">
                {rfqs.slice(0, 6).map((rfq) => (
                  <tr key={rfq.id || rfq.rfq_number} className="hover:bg-emerald-900/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {rfq.rfq_number || 'SG-LEAD'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {rfq.company_name}
                    </td>
                    <td className="py-3 px-4 text-emerald-200/80">
                      <div>{rfq.contact_name}</div>
                      <div className="text-[10px] text-emerald-400/60">{rfq.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span>{rfq.port_of_discharge}, {rfq.country}</span>
                    </td>
                    <td className="py-3 px-4">
                      {rfq.items?.length || 0} product(s) (
                      {rfq.items?.reduce((s, i) => s + (Number(i.quantity_tons) || 0), 0)} MT)
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rfq.status === 'quoted'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : rfq.status === 'in_review'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {rfq.status || 'new'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectRFQ(rfq);
                          onSelectTab('rfqs');
                        }}
                        className="px-3 py-1 bg-emerald-700/60 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
