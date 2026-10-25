import React from 'react';

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4"
    >
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">Loading platform data...</p>
        <p className="text-xs text-slate-400">Please wait while we prepare your workspace</p>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
