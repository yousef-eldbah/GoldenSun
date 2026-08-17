import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { RFQBasketProvider } from '@/context/RFQBasketContext';
import { Navbar } from '@/components/Navbar';
import { RFQDrawer } from '@/components/RFQDrawer';
import { WhatsAppFloatingButton } from '@/components/WhatsAppFloatingButton';
import { Footer } from '@/components/Footer';
import { Locale } from '@/types';

import { ScrollToTop } from '@/components/ScrollToTop';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<any>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <RFQBasketProvider>
        <ScrollToTop />
        <Navbar currentLocale={locale} />
        <RFQDrawer currentLocale={locale} />
        <WhatsAppFloatingButton currentLocale={locale} />
        <div className="flex-1">{children}</div>
        <Footer currentLocale={locale} />
      </RFQBasketProvider>
    </NextIntlClientProvider>
  );
}

