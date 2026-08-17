import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { Locale } from '@/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  return {
    title: 'Privacy Policy & GDPR Compliance | Sun Golden Agricultural Export',
    description: 'Learn about how Sun Golden protects and processes personal data submitted via RFQ inquiry forms in full compliance with EU GDPR regulations.',
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  return (
    <main className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-emerald-950/80 border border-emerald-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="border-b border-emerald-800 pb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-emerald-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-400">
              Privacy Policy & GDPR Compliance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Sun Golden for Export & Agricultural Development (Sadat City, Menofia, Egypt)
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> 1. Data Collection & Purpose
            </h2>
            <p>
              When you submit a Request for Quotation (RFQ) on the Sun Golden Digital Export Platform, we collect business contact details including your company name, contact person name, business email, phone/WhatsApp number, target port of discharge (POD), and required produce quantities.
            </p>
            <p>
              This data is collected strictly for the purpose of communicating proforma export quotations, shipping schedules, phytosanitary specs, and cold-chain logistics options.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> 2. Explicit GDPR Consent
            </h2>
            <p>
              In compliance with European Union General Data Protection Regulation (GDPR Article 6(1)(a)), data is processed only after you explicitly check the non-preselected consent checkbox on the RFQ form.
            </p>
            <p>
              You have the right to withdraw your consent, request erasure of your company&apos;s inquiry records, or request a export data report at any time by emailing us at <span className="text-amber-400 underline">export@sungolden-eg.com</span>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> 3. Data Storage & Security
            </h2>
            <p>
              All submitted data is transmitted using 256-bit SSL encryption and stored securely in ISO-compliant Supabase PostgreSQL databases with strict Row Level Security (RLS) policies. We never sell or transfer your commercial inquiry data to third-party brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> 4. Contact Data Protection Officer
            </h2>
            <p>
              Sun Golden Export Department<br />
              Industrial Zone 3, Packaging Hub, Sadat City, Menofia, Egypt<br />
              Email: export@sungolden-eg.com | Phone: +20 100 123 4567
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
