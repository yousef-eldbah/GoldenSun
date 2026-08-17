'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle2, ShieldCheck, Trash2, Plus, Calendar as CalendarIcon, Package, Leaf } from 'lucide-react';
import { useRFQBasket } from '@/context/RFQBasketContext';
import { apiService } from '@/lib/supabase';
import { mockProducts } from '@/lib/mockData';
import { Locale } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

const rfqSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  company_name: z.string().optional(),
  street_address: z.string().min(3, 'Street address is required'),
  country: z.string().min(2, 'Country / Region is required'),
  state: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Valid phone number is required'),
  // Order details
  selected_product_id: z.string().optional(),
  box_size: z.string().optional(),
  quantity: z.string().optional(),
  incoterm: z.enum(['FOB', 'CIF', 'CFR']),
  shipping_method: z.string().optional(),
  target_delivery_date: z.string().optional(),
  notes: z.string().optional(),
  gdpr_consent: z.boolean().refine((val) => val === true, {
    message: 'Please accept the terms to send request.',
  }),
});

type RFQFormData = z.infer<typeof rfqSchema>;

export function RFQForm({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('rfq');
  const { items, clearBasket, updateQuantity, removeItem, addItem, incoterm, portOfDischarge } = useRFQBasket();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      incoterm: (incoterm as any) || 'FOB',
      shipping_method: 'Sea Reefer Container (40ft HC)',
      gdpr_consent: true,
    },
  });

  const selectedProductId = watch('selected_product_id');

  // Handle adding a product directly from the order form if basket is empty
  const handleSelectProduct = (productId: string) => {
    setValue('selected_product_id', productId);
    const prod = mockProducts.find((p) => p.id === productId);
    if (prod && !items.some((i) => i.product_id === prod.id)) {
      addItem(prod, 10);
    }
  };

  const onSubmit = async (data: RFQFormData) => {
    setIsSubmitting(true);

    try {
      // Build items payload from basket or form selection
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
                  mockProducts.find((p) => p.id === data.selected_product_id)?.translations[currentLocale]?.name ||
                  'Selected Produce',
                quantity_tons: Number(data.quantity) || 10,
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
        company_name: data.company_name || `${data.first_name} ${data.last_name}`,
        contact_name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phone_whatsapp: data.phone,
        country: `${data.country}${data.state ? `, ${data.state}` : ''}`,
        port_of_discharge: data.street_address || portOfDischarge || 'Primary Sea Port',
        incoterm: data.incoterm,
        estimated_etd: data.target_delivery_date || new Date().toISOString().split('T')[0],
        notes: `Shipping Method: ${data.shipping_method || 'N/A'}. ${data.notes || ''}`,
        gdpr_consent: true,
        items: itemsPayload,
      };

      const result = await apiService.submitRFQ(rfqPayload as any);
      setSuccessRef((result as any)?.rfq_number || `SG-${Date.now().toString().slice(-6)}`);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      clearBasket();
    } catch (err) {
      console.error('RFQ Submit Error:', err);
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (successRef && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [successRef]);

  if (successRef) {
    return (
      <section id="contact" className="py-20 bg-[#fafcf9] text-[#1b3e2b]">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6 bg-white p-10 rounded-[32px] border border-emerald-900/10 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#258746] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold font-serif text-[#1b3e2b]">
              Quote Request Sent Successfully!
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Reference Code:{' '}
              <span className="font-mono font-bold text-[#258746] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                {successRef}
              </span>
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed pt-2">
              Thank you! Our commercial export manager will review your shipment requirements and email your official Proforma Invoice within 24 business hours.
            </p>
          </div>
          <div className="pt-4">
            <button
              onClick={() => setSuccessRef(null)}
              className="px-8 py-3 bg-[#258746] hover:bg-[#1b6a36] text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Send Another Request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#fafdfa] text-[#1b3e2b] relative overflow-hidden">
      {/* Decorative Botanical Leaves top right (pawel-about.svg) */}
      <div className="absolute top-0 right-0 pointer-events-none z-0">
        <Image
          src="/assets/pawel-about.svg"
          alt="Natural Green Leaves"
          width={280}
          height={240}
          className="object-contain opacity-90"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black font-serif text-[#1b3e2b] tracking-tight">
            Request a Quote
          </h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Fill In Your Details And We'll Get Back To You Within 24 Hours.
          </p>
        </div>

        {/* Main Form Box */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* SECTION 1: CUSTOMER DETAILS */}
          <div className="space-y-6 bg-white p-6 sm:p-10 rounded-[32px] border border-emerald-900/10 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#1b3e2b] tracking-wide border-b border-gray-100 pb-3">
              Customer Details
            </h2>

            {/* Row 1: First Name, Last Name, Company Name */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">First name*</label>
                <input
                  type="text"
                  placeholder="Your first name"
                  {...register('first_name')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.first_name ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.first_name && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.first_name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Last name*</label>
                <input
                  type="text"
                  placeholder="Your last name"
                  {...register('last_name')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.last_name ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.last_name && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.last_name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Company Name (optional)</label>
                <input
                  type="text"
                  placeholder="Company name"
                  {...register('company_name')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all"
                />
              </div>
            </div>

            {/* Row 2: Street Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Street Address*</label>
              <input
                type="text"
                placeholder="Address"
                {...register('street_address')}
                className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                  errors.street_address ? 'border-red-400' : 'border-gray-200'
                } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
              />
              {errors.street_address && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.street_address.message}</p>}
            </div>

            {/* Row 3: Country & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Country / Region*</label>
                <select
                  {...register('country')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all cursor-pointer"
                >
                  <option value="">Select country...</option>
                  <option value="Germany">Germany (EU)</option>
                  <option value="Netherlands">Netherlands (Port of Rotterdam)</option>
                  <option value="Spain">Spain (Port of Valencia)</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Other">Other Country</option>
                </select>
                {errors.country && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.country.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">State / City (optional)</label>
                <input
                  type="text"
                  placeholder="Select state or city"
                  {...register('state')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all"
                />
              </div>
            </div>

            {/* Row 4: Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email*</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.email ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone*</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  {...register('phone')}
                  className={`w-full px-4 py-3 rounded-xl bg-[#fdfefd] border ${
                    errors.phone ? 'border-red-400' : 'border-gray-200'
                  } text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: ORDER DETAILS */}
          <div className="space-y-6 bg-white p-6 sm:p-10 rounded-[32px] border border-emerald-900/10 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
              <h2 className="text-lg font-extrabold text-[#1b3e2b] tracking-wide">
                Order Details
              </h2>

              {items.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#258746] text-xs font-black">
                  {items.length} Selected Produce Items
                </span>
              )}
            </div>

            {/* MULTIPLE SELECTED ITEMS BASKET LIST (When items chosen) */}
            {items.length > 0 && (
              <div className="space-y-3 bg-[#fbfdfa] p-4 sm:p-5 rounded-2xl border border-emerald-900/10 mb-6">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-2">
                  Selected Produce Items ({items.length})
                </span>

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
                            {item.preferred_packaging || 'Standard Packaging'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500">Qty:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity_tons}
                            onChange={(e) => updateQuantity(item.product_id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 px-2 py-1 text-center font-extrabold text-xs rounded-lg border border-gray-300 focus:border-[#258746] focus:outline-none"
                          />
                          <span className="text-xs font-bold text-gray-600">Tons</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ORDER PARAMETERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Product selector dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Product</label>
                <select
                  value={selectedProductId || ''}
                  onChange={(e) => handleSelectProduct(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all cursor-pointer"
                >
                  <option value="">Select produce item...</option>
                  {mockProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.translations[currentLocale]?.name || p.translations.en.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Box Size */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Box Size</label>
                <select
                  {...register('box_size')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all cursor-pointer"
                >
                  <option value="">Select box size...</option>
                  <option value="5kg Box">5kg Export Box</option>
                  <option value="10kg Box">10kg Telescope Carton</option>
                  <option value="15kg Box">15kg Open Top Carton</option>
                  <option value="20kg Box">20kg Bulk Packaging</option>
                  <option value="Custom Size">Custom Packaging Size</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Quantity (Boxes / Tons)</label>
                <input
                  type="text"
                  placeholder="e.g. 10 Boxes or 24 Metric Tons"
                  {...register('quantity')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all"
                />
              </div>

              {/* Incoterm */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Incoterm</label>
                <select
                  {...register('incoterm')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all cursor-pointer"
                >
                  <option value="FOB">FOB (Free on Board - Alexandria / Port Said)</option>
                  <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                  <option value="CFR">CFR (Cost & Freight)</option>
                </select>
              </div>

              {/* Shipping Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Shipping Method</label>
                <select
                  {...register('shipping_method')}
                  className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all cursor-pointer"
                >
                  <option value="Sea Reefer Container (40ft HC)">Sea Reefer Container (40ft High Cube)</option>
                  <option value="Sea Reefer Container (20ft)">Sea Reefer Container (20ft)</option>
                  <option value="Air Freight">Air Freight (Express Produce)</option>
                  <option value="Land Transport">Land Reefer Truck</option>
                </select>
              </div>

              {/* Target Delivery Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Target Delivery Date</label>
                <div className="relative">
                  <input
                    type="date"
                    {...register('target_delivery_date')}
                    className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: ADDITIONAL INFO */}
          <div className="space-y-6 bg-white p-6 sm:p-10 rounded-[32px] border border-emerald-900/10 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#1b3e2b] tracking-wide border-b border-gray-100 pb-3">
              Additional Info
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Order Notes (Optional)</label>
              <textarea
                rows={4}
                placeholder="Notes about your order, e.g. special notes for delivery, Brix target, sizing preferences..."
                {...register('notes')}
                className="w-full px-4 py-3 rounded-xl bg-[#fdfefd] border border-gray-200 text-sm font-medium text-[#1b3e2b] focus:outline-none focus:border-[#258746] focus:ring-2 focus:ring-[#258746]/20 transition-all"
              />
            </div>

            {/* GDPR Consent */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('gdpr_consent')}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#258746] focus:ring-[#258746] cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-medium leading-relaxed">
                  I agree to the processing of my business data to process this quotation request in accordance with the{' '}
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
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md mx-auto py-4 px-8 bg-[#258746] hover:bg-[#1b6a36] text-white text-lg sm:text-xl font-extrabold font-serif rounded-full sm:rounded-2xl shadow-xl shadow-emerald-700/25 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Send Request</span>
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
