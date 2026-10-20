'use client';

import React, { useState } from 'react';
import { Eye, FileDown, Award, FileText } from 'lucide-react';
import { PdfPreviewModal } from './PdfPreviewModal';

interface DocumentActionButtonsProps {
  title: string;
  documentType: 'Offer Letter' | 'Completion Certificate';
  pdfUrl: string;
  verificationId?: string;
  isUnlocked?: boolean;
  className?: string;
}

export const DocumentActionButtons: React.FC<DocumentActionButtonsProps> = ({
  title,
  documentType,
  pdfUrl,
  verificationId,
  isUnlocked = true,
  className = '',
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!isUnlocked) {
    return null;
  }

  const isCertificate = documentType === 'Completion Certificate';

  return (
    <>
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {/* Preview Button */}
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
            isCertificate
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
          }`}
          title="Preview Document in Browser"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        {/* Download Button */}
        <a
          href={pdfUrl}
          download
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
            isCertificate
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isCertificate ? (
            <Award className="w-3.5 h-3.5" />
          ) : (
            <FileDown className="w-3.5 h-3.5" />
          )}
          <span>Download PDF</span>
        </a>
      </div>

      {/* PDF In-Browser Preview Modal */}
      <PdfPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        pdfUrl={pdfUrl}
        documentType={documentType}
        verificationId={verificationId}
      />
    </>
  );
};
