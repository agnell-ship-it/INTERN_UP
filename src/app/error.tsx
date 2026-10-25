'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring if configured
    console.error('Application Error Caught by Root Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Something Went Wrong</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            An unexpected error occurred while processing your request. You can try refreshing the
            action or navigate back to the home page.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-slate-400">Error Digest: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
