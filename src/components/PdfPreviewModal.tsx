'use client';

import React, { useState } from 'react';
import {
  FileText,
  X,
  FileDown,
  ExternalLink,
  Printer,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  documentType?: 'Offer Letter' | 'Completion Certificate';
  verificationId?: string;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  pdfUrl,
  documentType = 'Document',
  verificationId,
}) => {
  const [loading, setLoading] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-preview-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 truncate">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">
                {documentType} &bull; {verificationId ? `ID: ${verificationId}` : 'Official Vector PDF'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Open in new tab */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Open in Full Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Print button */}
            <button
              onClick={handlePrint}
              type="button"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer hidden sm:block"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download button */}
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer Frame */}
        <div className="relative flex-1 bg-slate-100 min-h-[500px] overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-xs text-slate-500 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Rendering PDF Document...</span>
            </div>
          )}

          <iframe
            id="pdf-preview-iframe"
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full min-h-[580px] border-0"
            onLoad={() => setLoading(false)}
            title={title}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">
            Official server-generated document signed by <strong>INTERN-UP</strong>.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
