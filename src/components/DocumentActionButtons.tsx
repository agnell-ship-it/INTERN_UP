'use client';

import React, { useState } from 'react';
import { Eye, FileDown, Award, FileText } from 'lucide-react';
import { PdfPreviewModal } from './PdfPreviewModal';

interface DocumentActionButtonsProps {
  title: string;
  documentType: 'Enrollment Letter' | 'Offer Letter' | 'Completion Certificate';
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

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://intern-up.com';

  const linkedinAddUrl = verificationId
    ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
        title
      )}&organizationName=INTERN-UP&certId=${encodeURIComponent(
        verificationId
      )}&certUrl=${encodeURIComponent(`${origin}/verify/${verificationId}`)}`
    : null;

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

        {/* LinkedIn Add to Profile Button (for certificates) */}
        {isCertificate && linkedinAddUrl && (
          <a
            href={linkedinAddUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0A66C2] hover:bg-[#004182] text-white shadow-xs transition-colors"
            title="Add this verified credential to your LinkedIn profile"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
            </svg>
            <span>Add to Profile</span>
          </a>
        )}
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
