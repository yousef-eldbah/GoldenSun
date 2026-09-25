'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import {
  Send,
  CheckCircle2,
  Trash2,
  Plus,
  Package,
  Leaf,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Anchor,
  Globe,
  Building2,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { useRFQBasket } from '@/context/RFQBasketContext';
import { apiService } from '@/lib/supabase';
import { mockProducts, mockSiteSettings } from '@/lib/mockData';
import { Product, Locale, Incoterm } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

const rfqFormSchema = z.object({
  company_name: z.string().min(2, 'Company name is required for B2B export quotes'),
  contact_name: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Please enter a valid business email address'),
  phone_whatsapp: z.string().min(6, 'Valid WhatsApp / phone number with country code is required'),
  country: z.string().min(2, 'Destination country is required'),
  port_of_discharge: z.string().min(2, 'Destination sea/air port of discharge is required'),
  incoterm: z.enum(['FOB', 'CIF', 'CFR']),
  shipping_method: z.string().optional(),
  estimated_etd: z.string().optional(),
  notes: z.string().optional(),
  // Single-item fallback when basket is empty
  selected_product_id: z.string().optional(),
  box_size: z.string().optional(),
  quantity: z.string().optional(),
  gdpr_consent: z.boolean().refine((val) => val === true, {
    message: 'Please accept the data processing terms to proceed.',
  }),
});

type RFQFormData = z.infer<typeof rfqFormSchema>;

interface RFQFormProps {
  currentLocale: Locale;
  initialProducts?: Product[];
}

export function RFQForm({ currentLocale, initialProducts }: RFQFormProps) {
  const t = useTranslations('rfq');
  const { items, clearBasket, updateQuantity, removeItem, addItem, incoterm, portOfDischarge } = useRFQBasket();

  const productsList = initialProducts && initialProducts.length > 0 ? initialProducts : mockProducts;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<{
    rfq_number: string;
    company_name: string;
    items_summary: string;
    country: string;
    port: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<RFQFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqFormSchema),
    defaultValues: {
      company_name: '',
      contact_name: '',
      email: '',
      phone_whatsapp: '',
      country: '',
      port_of_discharge: portOfDischarge || '',
      incoterm: (incoterm as Incoterm) || 'FOB',
      shipping_method: 'Sea Reefer Container (40ft HC)',
      gdpr_consent: true,
      quantity: '1',
    },
  });

  const selectedProductId = watch('selected_product_id');

  const handleSelectProduct = (productId: string) => {
    setValue('selected_product_id', productId);
    const prod = productsList.find((p) => p.id === productId);
    if (prod && !items.some((i) => i.product_id === prod.id)) {
      addItem(prod, 1);
    }
  };

  const onSubmit = async (data: RFQFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setLastSubmittedData(data);

    try {
      // Build items payload from basket or single form selector
      const itemsPayload =
        items.length > 0
          ? items.map((i) => ({
              product_id: i.product_id,
              product_name: i.product_name,
              quantity_tons: i.quantity_tons,
              preferred_packaging: i.preferred_packaging || data.box_size || 'Standard Export Box',
            }))
          : data.selected_product_id
          ? [
              {
                product_id: data.selected_product_id,
                product_name:
                  productsList.find((p) => p.id === data.selected_product_id)?.translations[currentLocale]?.name ||
                  'Selected Produce',
                quantity_tons: Number(data.quantity) || 1,
                preferred_packaging: data.box_size || 'Standard Export Box',
              },
            ]
          : [];

      if (itemsPayload.length === 0) {
        alert('Please select at least one produce item for your quote request!');
        setIsSubmitting(false);
        return;
      }

      const rfqPayload = {
        company_name: data.company_name,
        contact_name: data.contact_name,
        email: data.email,
        phone_whatsapp: data.phone_whatsapp,
        country: data.country,
        port_of_discharge: data.port_of_discharge,
        incoterm: data.incoterm,
        estimated_etd: data.estimated_etd || new Date().toISOString().split('T')[0],
        notes: `Shipping Method: ${data.shipping_method || 'N/A'}. ${data.notes || ''}`.trim(),
        gdpr_consent: true,
        items: itemsPayload,
      };

      const result = await apiService.submitRFQ(rfqPayload as any);

      if (result.success) {
        const summaryText = itemsPayload.map((i) => `${i.product_name} (${i.quantity_tons} ${i.quantity_tons === 1 ? 'Container' : 'Containers'})`).join(', ');
        setSuccessInfo({
          rfq_number: result.rfq_number,
          company_name: data.company_name,
          items_summary: summaryText,
          country: data.country,
          port: data.port_of_discharge,
        });
        clearBasket();
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (err: any) {
      console.error('RFQ Submit Error:', err);
      setSubmitError(err?.message || 'We could not save your request to the database right now.');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsAppNumber = (mockSiteSettings.whatsapp || '+201013562660').replace(/[^0-9]/g, '');

  // SUCCESS CONFIRMATION SCREEN (High conversion B2B page with WhatsApp push)
  if (successInfo) {
    const waText = encodeURIComponent(
      `Hello Golden Sun Export Team,\n\nI just submitted an official Request for Quotation (RFQ) on your website.\n\n📌 RFQ Reference: ${successInfo.rfq_number}\n🏢 Company: ${successInfo.company_name}\n📦 Cargo: ${successInfo.items_summary}\n⚓ Destination Port: ${successInfo.port}, ${successInfo.country}\n\nPlease confirm receipt and send our commercial Proforma Invoice at your earliest convenience.`
    );
    const waLink = `https://wa.me/${cleanWhatsAppNumber}?text=${waText}`;

    return (
      <section className="py-20 bg-gradient-to-b from-[#f4fbf6] to-[#fafdfa] text-center px-4">
        <div className="max-w-2xl mx-auto bg-white border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#258746] flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-[#1b6a36] text-xs font-bold rounded-full uppercase tracking-wider">
              RFQ Confirmed & Saved
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1b3e2b]">
              Quotation Request Received!
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Official Reference Number:{' '}
              <span className="font-mono font-black text-[#258746] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                {successInfo.rfq_number}
              </span>
            </p>
            <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed pt-2">
              Thank you, <strong className="text-gray-900">{successInfo.company_name}</strong>! Your requirements have been logged directly into our export management desk. Our commercial export manager will email your official Proforma Invoice within <strong>24 business hours</strong>.
            </p>
          </div>

          {/* Quick WhatsApp Action Box */}
          <div className="bg-[#1b3e2b] text-white p-6 rounded-2xl space-y-3 text-left shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#25d366]/20 text-[#25d366] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Need an urgent freight rate / ETD?</h4>
                <p className="text-xs text-emerald-200/80">Connect directly with our Export Sales Desk via WhatsApp.</p>
              </div>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#25d366] hover:bg-[#20ba59] text-gray-950 font-black rounded-xl transition-all shadow-md hover:scale-[1.01]"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Send Order Reference on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setSuccessInfo(null)}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Submit Another Inquiry
            </button>
            <Link
              href={`/${currentLocale}/products`}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#258746] hover:bg-[#1b6a36] text-white text-xs font-bold rounded-xl transition-all"
            >
              Browse More Produce
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#fafdfa] text-[#1b3e2b] relative overflow-hidden">
      {/* Botanical background element */}
      <div className="absolute top-0 right-0 pointer-events-none z-0">
        <Image
          src="/assets/pawel-about.png"
          alt="Natural Green Leaves"
          width={280}
          height={240}
          className="object-contain opacity-85"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#258746] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            B2B Commercial Desk
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-serif text-[#1b3e2b] tracking-tight">
            Request an Export Quotation
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Direct Egyptian agricultural export supply. Proforma invoices issued within 24 business hours.
          </p>
        </div>

        {/* ERROR BANNER IF SERVER FAILED (No silent false success) */}
        {submitError && (
          <div className="p-5 bg-rose-50 border-2 border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-rose-900 animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Submission Issue: {submitError}</h4>
                <p className="text-xs text-rose-700">
                  Don't worry, you can forward your specifications directly to our export manager on WhatsApp right now:
                </p>
              </div>
            </div>
            {lastSubmittedData && (
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                  `Hello Golden Sun, I encountered a connection issue on the website. I would like a quote for:\nCompany: ${lastSubmittedData.company_name}\nPort: ${lastSubmittedData.port_of_discharge}, ${lastSubmittedData.country}\nIncoterm: ${lastSubmittedData.incoterm}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 bg-[#25d366] text-gray-950 font-bold text-xs rounded-xl shadow hover:bg-[#20ba59] transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send via WhatsApp Now</span>
              </a>
            )}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* SECTION 1: COMMERCIAL BUYER DETAILS */}
          <div className="space-y-6 bg-white p-6 sm:p-10 rounded-[32px] border border-emerald-900/10 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-extrabold text-[#1b3e2b] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#258746]" />
                <span>Commercial Buyer Profile</span>
              </h2>
              <span className="text-xs text-gray-400 font-medium">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Company / Importer Name*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nordic Agro Imports GmbH"
                  {...register('company_name')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.company_name ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.company_name && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{errors.company_name.message}</p>
                )}
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Contact Person Full Name*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hans Mueller"
                  {...register('contact_name')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.contact_name ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.contact_name && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{errors.contact_name.message}</p>
                )}
              </div>

              {/* Business Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>Business Email*</span>
                </label>
                <input
                  type="email"
                  placeholder="purchasing@company.com"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.email ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email.message}</p>
                )}
              </div>

              {/* WhatsApp / Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>WhatsApp / Direct Phone (with country code)*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+49 170 555 4321"
                  {...register('phone_whatsapp')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.phone_whatsapp ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.phone_whatsapp && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{errors.phone_whatsapp.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: DESTINATION & SHIPPING TERMS */}
          <div className="space-y-6 bg-white p-6 sm:p-10 rounded-[32px] border border-emerald-900/10 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-extrabold text-[#1b3e2b] flex items-center gap-2">
                <Anchor className="w-5 h-5 text-[#258746]" />
                <span>Shipping & Destination Specs</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Destination Country */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  <span>Destination Country*</span>
                </label>
                <select
                  {...register('country')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.country ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all cursor-pointer`}
                >
                  <option value="">Select country...</option>
                  <option value="Netherlands">Netherlands (Port of Rotterdam)</option>
                  <option value="Germany">Germany (Hamburg / Bremerhaven)</option>
                  <option value="United Kingdom">United Kingdom (London Gateway / Felixstowe)</option>
                  <option value="Spain">Spain (Valencia / Algeciras)</option>
                  <option value="Italy">Italy (Genoa / Trieste)</option>
                  <option value="France">France (Marseille / Le Havre)</option>
                  <option value="United States">United States</option>
                  <option value="Saudi Arabia">Saudi Arabia (Jeddah / Dammam)</option>
                  <option value="United Arab Emirates">United Arab Emirates (Jebel Ali)</option>
                  <option value="Other">Other Global Destination</option>
                </select>
                {errors.country && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{errors.country.message}</p>
                )}
              </div>

              {/* Port of Discharge (replaces street_address) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Anchor className="w-3.5 h-3.5 text-gray-400" />
                  <span>Port of Discharge (POD)*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rotterdam / Hamburg / Jebel Ali"
                  {...register('port_of_discharge')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.port_of_discharge ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.port_of_discharge && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{errors.port_of_discharge.message}</p>
                )}
              </div>

              {/* Incoterm */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Trade Incoterm*</label>
                <select
                  {...register('incoterm')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all cursor-pointer"
                >
                  <option value="FOB">FOB (Alexandria / Damietta Port)</option>
                  <option value="CIF">CIF (Cost, Insurance & Freight to POD)</option>
                  <option value="CFR">CFR (Cost and Freight)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Shipping Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Freight Mode</label>
                <select
                  {...register('shipping_method')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all cursor-pointer"
                >
                  <option value="Sea Reefer Container (40ft HC)">Sea Reefer Container (40ft High Cube ~20-25 MT)</option>
                  <option value="Sea Reefer Container (20ft)">Sea Reefer Container (20ft ~10-12 MT)</option>
                  <option value="Air Freight Express">Air Freight (High-Value / Express Produce)</option>
                  <option value="Land Reefer Truck">Land Reefer Truck (Regional MENA)</option>
                </select>
              </div>

              {/* Target ETD / Delivery */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Estimated Shipment Date (ETD)</label>
                <input
                  type="date"
                  {...register('estimated_etd')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PRODUCE & TONNAGE */}
          <div className="space-y-6 bg-white p-6 sm:p-10 rounded-[32px] border border-emerald-900/10 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
              <h2 className="text-lg font-extrabold text-[#1b3e2b] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#258746]" />
                <span>Requested Produce Items</span>
              </h2>

              {items.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#258746] text-xs font-black">
                  {items.length} Item(s) in Quote Basket
                </span>
              )}
            </div>

            {/* If basket has items */}
            {items.length > 0 ? (
              <div className="space-y-3 bg-[#fbfdfa] p-4 sm:p-5 rounded-2xl border border-emerald-900/10">
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs flex-wrap gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#258746] flex items-center justify-center font-bold text-xs">
                          <Leaf className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#1b3e2b]">{item.product_name}</h4>
                          <span className="text-[11px] text-gray-500 font-medium">
                            Packaging: {item.preferred_packaging || 'Standard Export Box'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-[#fdfefd] px-2 py-1">
                          <input
                            type="number"
                            min="1"
                            max="5000"
                            value={item.quantity_tons}
                            onChange={(e) => updateQuantity(item.product_id, Math.max(1, Number(e.target.value)))}
                            className="w-14 text-center font-bold text-xs text-[#1b3e2b] focus:outline-none"
                          />
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{item.quantity_tons === 1 ? 'Container' : 'Containers'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product_id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Fallback selector when basket is empty */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Primary Produce*</label>
                  <select
                    value={selectedProductId || ''}
                    onChange={(e) => handleSelectProduct(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] transition-all cursor-pointer"
                  >
                    <option value="">Choose Egyptian crop...</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.translations[currentLocale]?.name || p.translations.en?.name || p.slug}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Containers (40ft Reefer)*</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...register('quantity')}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: NOTES & GDPR */}
          <div className="space-y-5 bg-white p-6 sm:p-10 rounded-[32px] border border-emerald-900/10 shadow-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Special Technical Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Mention required counts/calibers, Brix levels, specific carton labels, or certifications required (GLOBALG.A.P., SMETA, etc.)..."
                {...register('notes')}
                className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('gdpr_consent')}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#258746] focus:ring-[#258746] cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-medium leading-relaxed">
                  I agree to the processing of our commercial inquiry details for the purpose of receiving an official export quotation in accordance with the{' '}
                  <Link href={`/${currentLocale}/privacy-policy`} className="underline font-bold text-[#258746]">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
              {errors.gdpr_consent && (
                <p className="text-xs text-red-500 font-semibold mt-1">{errors.gdpr_consent.message}</p>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md mx-auto py-4 px-8 bg-[#258746] hover:bg-[#1b6a36] text-white text-lg sm:text-xl font-extrabold font-serif rounded-full shadow-xl shadow-emerald-700/25 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting to Export Desk...</span>
              ) : (
                <>
                  <span>Submit Official RFQ</span>
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
