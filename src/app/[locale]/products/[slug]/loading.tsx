import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-emerald-900/50 rounded-xl" />
        <div className="h-4 w-96 bg-emerald-900/30 rounded-xl" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-4/3 bg-emerald-900/40 rounded-2xl border border-emerald-800/40" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-emerald-900/40 rounded-lg" />
            <div className="h-10 w-full bg-emerald-900/50 rounded-xl" />
            <div className="h-24 w-full bg-emerald-900/30 rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-emerald-900/40 rounded-xl" />
              <div className="h-16 bg-emerald-900/40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
