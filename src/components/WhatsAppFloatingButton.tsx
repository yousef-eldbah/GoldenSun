'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Locale } from '@/types';

interface WhatsAppFloatingButtonProps {
  currentLocale: Locale;
}

export function WhatsAppFloatingButton({ currentLocale }: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const phone = '201287755522';
  
  const greetingText = {
    en: 'Hello Golden Sun Export, I would like to inquire about fresh produce export and current FOB/CIF prices.',
    de: 'Hallo Golden Sun Export, ich möchte mich über den Agrarexport und aktuelle FOB/CIF-Preise informieren.',
    es: 'Hola Golden Sun Export, me gustaría solicitar información sobre exportación de productos agrícolas y precios FOB/CIF.',
  }[currentLocale] || 'Hello Golden Sun Export, I would like to inquire about fresh produce export.';

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(greetingText)}`;

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Tooltip on hover/open */}
      {isOpen && (
        <div className="bg-white text-gray-800 p-3 rounded-2xl shadow-2xl border border-emerald-500/30 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-950">Export Sales Online</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-md cursor-pointer"
              aria-label="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
            Need urgent shipping schedules, seasonal pricing, or proforma invoice? Chat directly with our sales manager.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 w-full py-2 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
          >
            <span>Start WhatsApp Chat</span>
          </a>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex items-center gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-emerald-500/20 group cursor-pointer"
          aria-label="Contact Golden Sun on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white text-[#25D366] transition-transform group-hover:rotate-12" />
        </a>
      </div>
    </aside>
  );
}
