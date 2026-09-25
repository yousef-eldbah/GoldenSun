'use client';

import React, { useState } from 'react';
import { ContactInquiry } from '@/types';
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Search,
  CheckCircle2,
  Archive,
  Trash2,
  Eye,
  X,
  Download,
  MessageSquare,
  Clock
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { exportToCSV } from '@/lib/csvExport';

interface AdminContactsTabProps {
  contacts: ContactInquiry[];
  setContacts: React.Dispatch<React.SetStateAction<ContactInquiry[]>>;
  showToast: (msg: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Inquiries' },
  { value: 'new', label: 'New', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'contacted', label: 'Contacted', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
];

export function AdminContactsTab({
  contacts,
  setContacts,
  showToast,
}: AdminContactsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<ContactInquiry | null>(null);

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.mobile && c.mobile.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'archived') => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        showToast('Failed to update status');
        return;
      }
    }

    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedContact?.id === id) {
      setSelectedContact((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Inquiry status updated to ${newStatus}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
      if (error) {
        showToast('Failed to delete inquiry');
        return;
      }
    }

    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selectedContact?.id === id) {
      setSelectedContact(null);
    }
    showToast('Inquiry deleted successfully');
  };

  const handleExportCSV = () => {
    const csvData = filteredContacts.map((c) => ({
      ID: c.id,
      Date: new Date(c.created_at).toLocaleString(),
      Status: c.status,
      Name: c.name,
      Email: c.email,
      Mobile: c.mobile || '',
      Company: c.company || '',
      Subject: c.subject,
      Message: c.message,
    }));
    exportToCSV(csvData, `contact_inquiries_${new Date().toISOString().slice(0, 10)}`);
    showToast('Exported inquiries to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#163522] p-4 rounded-2xl border border-emerald-500/20">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0e2417] border border-emerald-500/30 rounded-xl text-xs text-white placeholder:text-emerald-400/50 outline-none focus:border-emerald-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#0e2417] p-1 rounded-xl border border-emerald-500/20 text-xs">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  statusFilter === opt.value
                    ? 'bg-[#258746] text-white shadow-sm'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#258746] hover:bg-[#1e6f39] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Inquiries List */}
      {filteredContacts.length === 0 ? (
        <div className="bg-[#163522] border border-emerald-500/20 rounded-2xl p-12 text-center text-emerald-300/60 flex flex-col items-center gap-3">
          <MessageSquare className="w-12 h-12 text-emerald-500/30" />
          <p className="text-sm font-semibold">No inquiries found matching your filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredContacts.map((contact) => {
            const isNew = contact.status === 'new';
            const cleanPhone = contact.mobile?.replace(/[^0-9+]/g, '');

            return (
              <div
                key={contact.id}
                className={`bg-[#163522] border rounded-2xl p-5 transition-all hover:border-emerald-400/40 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isNew ? 'border-emerald-400/50 bg-[#163522]/90 shadow-sm shadow-emerald-950' : 'border-emerald-500/20'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        contact.status === 'new'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : contact.status === 'contacted'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                      }`}
                    >
                      {contact.status}
                    </span>

                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{contact.name}</span>
                      {contact.company && (
                        <span className="text-xs text-emerald-300/70 font-normal flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {contact.company}
                        </span>
                      )}
                    </h3>

                    <span className="text-[11px] text-emerald-400/60 ml-auto md:ml-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(contact.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="text-xs text-emerald-200/90 font-medium">
                    <span className="text-emerald-400 font-bold">Subject:</span> {contact.subject}
                  </div>

                  <p className="text-xs text-emerald-300/70 line-clamp-2 pr-4">
                    {contact.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)} - Golden Sun Export`}
                      className="text-emerald-300 hover:text-emerald-100 flex items-center gap-1.5 transition-colors underline underline-offset-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{contact.email}</span>
                    </a>

                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-200 flex items-center gap-1.5 transition-colors font-medium"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp / Call ({contact.mobile})</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-emerald-500/20 pt-3 md:pt-0">
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="p-2.5 bg-[#0e2417] hover:bg-emerald-900/50 text-emerald-300 rounded-xl transition-all cursor-pointer border border-emerald-500/20"
                    title="View Message"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {contact.status !== 'contacted' && (
                    <button
                      onClick={() => handleStatusChange(contact.id, 'contacted')}
                      className="px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-emerald-500/30 flex items-center gap-1.5"
                      title="Mark as Contacted"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Contacted</span>
                    </button>
                  )}

                  {contact.status !== 'archived' && (
                    <button
                      onClick={() => handleStatusChange(contact.id, 'archived')}
                      className="p-2.5 bg-[#0e2417] hover:bg-emerald-900/50 text-emerald-300/70 hover:text-emerald-200 rounded-xl transition-all cursor-pointer border border-emerald-500/20"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl transition-all cursor-pointer border border-rose-500/20"
                    title="Delete Permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#163522] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-emerald-500/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      selectedContact.status === 'new'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : selectedContact.status === 'contacted'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                    }`}
                  >
                    {selectedContact.status}
                  </span>
                  <span className="text-xs text-emerald-300/60">
                    {new Date(selectedContact.created_at).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedContact.subject}</h2>
              </div>

              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 text-emerald-300/70 hover:text-white rounded-xl hover:bg-emerald-900/40 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0e2417] p-4 rounded-2xl border border-emerald-500/20 text-xs">
              <div>
                <span className="text-emerald-400 font-bold block mb-1">Sender Name:</span>
                <span className="text-white text-sm">{selectedContact.name}</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold block mb-1">Company:</span>
                <span className="text-white text-sm">{selectedContact.company || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold block mb-1">Email:</span>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                  className="text-emerald-300 underline"
                >
                  {selectedContact.email}
                </a>
              </div>
              <div>
                <span className="text-emerald-400 font-bold block mb-1">Mobile / WhatsApp:</span>
                {selectedContact.mobile ? (
                  <a
                    href={`https://wa.me/${selectedContact.mobile.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 font-medium underline"
                  >
                    {selectedContact.mobile}
                  </a>
                ) : (
                  <span className="text-emerald-300/50">Not provided</span>
                )}
              </div>
            </div>

            {/* Full Message Body */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Message Content
              </span>
              <div className="p-5 bg-[#0e2417] border border-emerald-500/20 rounded-2xl text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {selectedContact.message}
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-emerald-500/20">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)} - Golden Sun Export`}
                  className="px-4 py-2.5 bg-[#258746] hover:bg-[#1e6f39] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>

                {selectedContact.mobile && (
                  <a
                    href={`https://wa.me/${selectedContact.mobile.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedContact.status !== 'contacted' && (
                  <button
                    onClick={() => handleStatusChange(selectedContact.id, 'contacted')}
                    className="px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-emerald-500/30 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Contacted</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl transition-all cursor-pointer border border-rose-500/20"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
