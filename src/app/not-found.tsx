import React from 'react';
import Link from 'next/link';
import { Compass, Home, LayoutDashboard, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
            404 &bull; Page Not Found
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            We couldn&apos;t find that page
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page you requested may have moved, expired, or been removed. Explore our domain catalog
            or head back to the platform homepage.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/domains"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Browse 13 Domains</span>
          </Link>

          <Link
            href="/registry"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Certificate Registry</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
