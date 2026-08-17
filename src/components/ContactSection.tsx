'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { Locale } from '@/types';

export function ContactSection({ currentLocale }: { currentLocale: Locale }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        company: '',
        subject: '',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white text-gray-900 border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 tracking-tight font-serif">
            Contact Us
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-normal">
            Any question or remarks, Just write us a message!
          </p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Left Card: Contact Information (Order 2 on mobile, Order 1 on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md flex flex-col justify-between relative overflow-hidden min-h-[460px]">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1 font-sans">
                Contact Information
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-normal mb-8">
                Say something to start a live chat!
              </p>

              <div className="space-y-6 text-xs sm:text-sm text-gray-700 font-sans">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#23903F] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <a href="tel:+201287755522" className="hover:text-[#23903F] transition-colors font-medium">
                    +20 128 775 5522
                  </a>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#23903F] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href="mailto:sales@golden-sun-eg.com" className="hover:text-[#23903F] transition-colors font-medium">
                    sales@golden-sun-eg.com
                  </a>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#23903F] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-600 leading-snug">
                    Kasab Pedestrian Village, Badreshin Center, Giza, Egypt
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Social Icons & Decorative Plant */}
            <div className="pt-8">
              <div className="flex items-center gap-2.5 z-10 relative">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md bg-[#23903F] hover:bg-[#1E7D36] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md bg-[#23903F] hover:bg-[#1E7D36] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  aria-label="X Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md bg-[#23903F] hover:bg-[#1E7D36] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/201287755522"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md bg-[#23903F] hover:bg-[#1E7D36] text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.16 4.237 4.248-1.111z"/>
                  </svg>
                </a>
              </div>

              {/* Decorative Plant Image on bottom-right */}
              <Image
                src="/assets/img-contact.svg"
                width={200}
                height={200}
                style={{ width: 'auto', height: 'auto' }}
                alt="Plant Leaves Decoration"
                className="absolute bottom-0 right-0 max-w-[170px] sm:max-w-[200px] pointer-events-none opacity-90 transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Card: Contact Form (Order 1 on mobile, Order 2 on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-md flex flex-col justify-between">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <CheckCircle2 className="w-16 h-16 text-[#23903F] animate-bounce" />
                <h3 className="text-2xl font-bold text-gray-900 font-serif">Message Sent Successfully!</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Thank you for reaching out to Golden Sun Export. Our sales manager will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-emerald-200/80 focus:border-[#23903F] focus:ring-2 focus:ring-[#23903F]/20 text-sm outline-none transition-all placeholder:text-gray-300 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-emerald-200/80 focus:border-[#23903F] focus:ring-2 focus:ring-[#23903F]/20 text-sm outline-none transition-all placeholder:text-gray-300 text-gray-800"
                    />
                  </div>
                </div>

                {/* Row 2: Mobile Number & Company Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Your Mobile Number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-emerald-200/80 focus:border-[#23903F] focus:ring-2 focus:ring-[#23903F]/20 text-sm outline-none transition-all placeholder:text-gray-300 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                      Company Name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-emerald-200/80 focus:border-[#23903F] focus:ring-2 focus:ring-[#23903F]/20 text-sm outline-none transition-all placeholder:text-gray-300 text-gray-800"
                    />
                  </div>
                </div>

                {/* Row 3: Subject */}
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-emerald-200/80 focus:border-[#23903F] focus:ring-2 focus:ring-[#23903F]/20 text-sm outline-none transition-all placeholder:text-gray-300 text-gray-800"
                  />
                </div>

                {/* Row 4: Message */}
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-emerald-200/80 focus:border-[#23903F] focus:ring-2 focus:ring-[#23903F]/20 text-sm outline-none transition-all placeholder:text-gray-300 text-gray-800 resize-none"
                  />
                </div>

                {/* Row 5: Action Row (Centered Button + Hand-drawn Orange Arrow) */}
                <div className="flex items-center justify-center gap-3 pt-4 relative w-full text-center">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-[#23903F] hover:bg-[#1E7D36] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center"
                  >
                    Send Message
                  </button>

                  {/* Hand-drawn Orange Arrow SVG */}
                  <svg
                    width="85"
                    height="28"
                    viewBox="0 0 105 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden sm:block shrink-0 transition-transform duration-300 hover:scale-110"
                  >
                    <path
                      d="M0.607227 7.90421C3.70511 5.06147 6.96292 2.54651 10.5014 0.267522C11.4476 -0.345538 12.6007 0.609798 11.9789 1.63905C11.0742 3.12038 10.0739 4.44482 8.97507 5.68869C16.501 5.03866 24.1074 4.53979 31.6254 5.47979C34.6546 5.86588 38.1388 6.4595 41.4464 7.51985C41.8233 7.13795 42.2198 6.77217 42.6408 6.43291C48.3823 1.7887 56.3176 1.46665 63.2615 2.8772C79.5747 6.18155 94.5107 17.2632 104 30.7074C104.381 31.2484 103.612 31.8942 103.21 31.3627C96.4058 22.5566 88.1729 15.205 78.2517 10.0871C69.208 5.42369 57.1182 1.05654 47.2533 5.68195C45.8626 6.33255 44.5307 7.16913 43.3544 8.18551C46.4676 9.39574 49.3062 11.1043 51.2857 13.5366C58.7286 22.6802 43.6934 31.1682 38.5865 21.0361C36.5734 17.0325 37.4759 12.6915 39.9391 9.29721C39.3307 9.10877 38.7268 8.93074 38.1173 8.76769C27.8421 5.99511 16.9928 6.99103 6.55783 7.93792C5.62274 8.02133 5.11284 7.0265 5.61969 6.32373C4.95145 6.86175 4.28787 7.41011 3.63934 7.96419C6.49023 8.48054 9.02396 9.53919 11.5566 11.2605C12.6472 11.994 11.4651 13.6627 10.3698 12.9187C7.49993 10.9744 4.62805 9.96784 1.17204 9.68629C0.232709 9.62172 -0.0215796 8.47443 0.607227 7.90421ZM46.6917 23.8357C51.0786 22.9988 52.0748 20.0023 49.7113 14.832C48.2919 13.2845 46.6398 12.079 44.7457 11.1948C43.7625 10.7002 42.7208 10.2694 41.6667 9.89419C40.9493 10.7666 40.3607 11.7309 39.9308 12.7987C38.1425 17.3884 40.4698 24.7234 46.6917 23.8357Z"
                      fill="#FF9C00"
                    />
                  </svg>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
