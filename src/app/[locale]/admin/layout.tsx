import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Management Desk | Golden Sun Export',
  description: 'Internal administration portal for Golden Sun Agricultural Export.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-portal-wrapper min-h-screen bg-[#0d1f14]">{children}</div>;
}
