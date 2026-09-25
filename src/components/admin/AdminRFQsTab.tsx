'use client';

import React, { useState } from 'react';
import { RFQ } from '@/types';
import {
  Download,
  Search,
  Eye,
  Trash2,
  FileText,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Anchor,
  Calendar,
  X,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { exportToCSV } from '@/lib/csvExport';
import jsPDF from 'jspdf';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AdminRFQsTabProps {
  rfqs: RFQ[];
  setRfqs: React.Dispatch<React.SetStateAction<RFQ[]>>;
  selectedRFQ: RFQ | null;
  setSelectedRFQ: (rfq: RFQ | null) => void;
  showToast: (msg: string) => void;
}

const STATUS_OPTIONS: { value: NonNullable<RFQ['status']>; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'in_review', label: 'In Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { value: 'quoted', label: 'Quoted', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
];

export function AdminRFQsTab({
  rfqs,
  setRfqs,
  selectedRFQ,
  setSelectedRFQ,
  showToast,
}: AdminRFQsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch =
      rfq.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rfq.rfq_number && rfq.rfq_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      rfq.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (rfqId: string | undefined, newStatus: NonNullable<RFQ['status']>) => {
    if (!rfqId) return;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rfqs').update({ status: newStatus }).eq('id', rfqId);
      } catch (err) {
        console.error('Failed to update status in supabase:', err);
      }
    }

    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, status: newStatus } : r))
    );

    if (selectedRFQ && selectedRFQ.id === rfqId) {
      setSelectedRFQ({ ...selectedRFQ, status: newStatus });
    }

    showToast(`RFQ status updated to "${newStatus}"`);
  };

  const handleExportCSV = () => {
    const dataToExport = rfqs.map((rfq) => ({
      'RFQ Reference': rfq.rfq_number || 'N/A',
      'Company Name': rfq.company_name,
      'Contact Person': rfq.contact_name,
      'Business Email': rfq.email,
      'Phone / WhatsApp': rfq.phone_whatsapp,
      'Country': rfq.country,
      'Port of Discharge': rfq.port_of_discharge,
      'Incoterm': rfq.incoterm,
      'ETD': rfq.estimated_etd,
      'Items Count': rfq.items?.length || 0,
      'Total Metric Tons': rfq.items?.reduce((s, i) => s + (Number(i.quantity_tons) || 0), 0) || 0,
      'Items Summary': rfq.items?.map((i) => `${i.product_name} (${i.quantity_tons} MT, ${i.preferred_packaging})`).join('; ') || '',
      'Status': rfq.status || 'new',
      'Created Date': rfq.created_at || '',
      'Notes': rfq.notes || '',
    }));

    exportToCSV(dataToExport, `Golden_Sun_RFQs_${new Date().toISOString().split('T')[0]}`);
    showToast('Exported CSV with UTF-8 BOM for Excel successfully!');
  };

  const exportPDF = (rfq: RFQ) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('GOLDEN SUN AGRICULTURAL EXPORT', 14, 20);
    doc.setFontSize(12);
    doc.text(`Official RFQ Summary — Ref: ${rfq.rfq_number || 'N/A'}`, 14, 30);
    doc.setLineWidth(0.5);
    doc.line(14, 34, 196, 34);

    doc.setFontSize(10);
    doc.text(`Company: ${rfq.company_name}`, 14, 44);
    doc.text(`Contact: ${rfq.contact_name}`, 14, 52);
    doc.text(`Email: ${rfq.email}`, 14, 60);
    doc.text(`Phone/WhatsApp: ${rfq.phone_whatsapp}`, 14, 68);
    doc.text(`Destination: ${rfq.port_of_discharge}, ${rfq.country}`, 14, 76);
    doc.text(`Trade Incoterm: ${rfq.incoterm}`, 14, 84);
    doc.text(`Estimated ETD: ${rfq.estimated_etd || 'Immediate'}`, 14, 92);
    doc.text(`Status: ${rfq.status || 'new'}`, 14, 100);

    doc.line(14, 106, 196, 106);
    doc.text('Requested Produce Cargo & Packaging:', 14, 114);

    let y = 124;
    rfq.items?.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.product_name} — ${item.quantity_tons} Metric Tons (${item.preferred_packaging})`,
        14,
        y
      );
      y += 8;
    });

    if (rfq.notes) {
      y += 6;
      doc.text(`Special Notes: ${rfq.notes}`, 14, y);
    }

    doc.save(`RFQ_${rfq.rfq_number || 'export'}.pdf`);
    showToast('Generated official PDF quotation summary!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Controls Bar */}
      <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by company, country, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-white placeholder-emerald-700 text-xs focus:outline-none focus:border-emerald-400"
          />
          <Search className="w-4 h-4 text-emerald-500/60 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filters & Export */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0d2215] border border-emerald-500/30 rounded-xl text-emerald-200 text-xs focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="quoted">Quoted</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#258746] hover:bg-[#1f733b] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV (Excel Safe)</span>
          </button>
        </div>
      </div>

      {/* RFQ Table */}
      <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl shadow-xl overflow-hidden">
        {filteredRFQs.length === 0 ? (
          <div className="text-center py-16 text-emerald-400/60 text-sm">
            No RFQ inquiries found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-emerald-100">
              <thead className="bg-[#0f2719] text-emerald-300/80 uppercase font-bold border-b border-emerald-800">
                <tr>
                  <th className="py-3.5 px-4">Ref #</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Port / Country</th>
                  <th className="py-3.5 px-4">Tonnage</th>
                  <th className="py-3.5 px-4">Incoterm</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/50">
                {filteredRFQs.map((rfq) => {
                  const currentStatus = rfq.status || 'new';
                  const statusConfig =
                    STATUS_OPTIONS.find((s) => s.value === currentStatus) || STATUS_OPTIONS[0];

                  return (
                    <tr
                      key={rfq.id || rfq.rfq_number}
                      className="hover:bg-emerald-900/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {rfq.rfq_number}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {rfq.company_name}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-200/80">
                        <div>{rfq.contact_name}</div>
                        <div className="text-[10px] text-emerald-400/60">{rfq.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {rfq.port_of_discharge}, {rfq.country}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white">
                          {rfq.items?.reduce((s, i) => s + (Number(i.quantity_tons) || 0), 0)} MT
                        </span>{' '}
                        <span className="text-[10px] text-emerald-300/60">
                          ({rfq.items?.length || 0} items)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 rounded font-bold">
                          {rfq.incoterm || 'FOB'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            updateStatus(rfq.id, e.target.value as NonNullable<RFQ['status']>)
                          }
                          className={`text-[10px] font-bold uppercase rounded-lg px-2 py-1 border cursor-pointer focus:outline-none ${statusConfig.color}`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-[#0f2719] text-white"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedRFQ(rfq)}
                            className="p-1.5 bg-emerald-800/50 hover:bg-emerald-700 text-emerald-200 rounded-lg transition-colors cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => exportPDF(rfq)}
                            className="p-1.5 bg-emerald-800/50 hover:bg-emerald-700 text-emerald-200 rounded-lg transition-colors cursor-pointer"
                            title="Generate PDF Proforma"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RFQ Detail Modal */}
      {selectedRFQ && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#163522] border border-emerald-500/30 rounded-3xl w-full max-w-2xl p-6 sm:p-8 text-white space-y-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
                  {selectedRFQ.rfq_number}
                </span>
                <h3 className="text-xl font-bold font-serif">{selectedRFQ.company_name}</h3>
              </div>
              <button
                onClick={() => setSelectedRFQ(null)}
                className="p-2 text-emerald-300/70 hover:text-white hover:bg-emerald-800/50 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0f2719] p-3.5 rounded-xl border border-emerald-900/60 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <User className="w-3 h-3" /> Contact Person
                </span>
                <p className="font-semibold text-white">{selectedRFQ.contact_name}</p>
                <p className="text-emerald-200/70">{selectedRFQ.email}</p>
                <p className="text-emerald-200/70">{selectedRFQ.phone_whatsapp}</p>
              </div>

              <div className="bg-[#0f2719] p-3.5 rounded-xl border border-emerald-900/60 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <Anchor className="w-3 h-3" /> Shipment Specs
                </span>
                <p className="font-semibold text-white">
                  Port: {selectedRFQ.port_of_discharge}, {selectedRFQ.country}
                </p>
                <p className="text-emerald-200/70">Trade Term: {selectedRFQ.incoterm}</p>
                <p className="text-emerald-200/70">ETD: {selectedRFQ.estimated_etd || 'Immediate'}</p>
              </div>
            </div>

            {/* Produce Items list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">
                Requested Cargo & Packaging
              </h4>
              <div className="space-y-2">
                {selectedRFQ.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#0f2719] p-3 rounded-xl border border-emerald-900/60 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{item.product_name}</span>
                      <span className="text-[11px] text-emerald-300/60">
                        Packaging: {item.preferred_packaging || 'Standard Box'}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                      {item.quantity_tons} MT
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedRFQ.notes && (
              <div className="bg-[#0f2719] p-3.5 rounded-xl border border-emerald-900/60 text-xs space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Commercial Notes</span>
                <p className="text-emerald-100">{selectedRFQ.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-800">
              <a
                href={`https://wa.me/${selectedRFQ.phone_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedRFQ.contact_name}, this is Golden Sun Export regarding your quote inquiry #${selectedRFQ.rfq_number}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25d366] hover:bg-[#20ba59] text-gray-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => exportPDF(selectedRFQ)}
                className="px-4 py-2 bg-[#258746] hover:bg-[#1f733b] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
