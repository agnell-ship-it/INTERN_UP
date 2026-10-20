'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, ExternalLink, Award } from 'lucide-react';

interface LinkedInShareCertificateProps {
  certificateId: string;
  domainName: string;
  studentName: string;
  issuedAt?: string;
}

export const LinkedInShareCertificate: React.FC<LinkedInShareCertificateProps> = ({
  certificateId,
  domainName,
  studentName,
  issuedAt = new Date().toISOString(),
}) => {
  const [copied, setCopied] = useState(false);

  // Parse issue year and month
  const date = new Date(issuedAt);
  const issueYear = date.getFullYear();
  const issueMonth = date.getMonth() + 1; // 1-12

  // Base URL (origin aware)
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://internup.com';

  const verificationUrl = `${origin}/verify/${certificateId}`;

  // Official LinkedIn "Add Certification" Direct Deep Link
  const addCertUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    `7-Day Internship in ${domainName}`
  )}&organizationName=${encodeURIComponent(
    'INTERN-UP'
  )}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(
    verificationUrl
  )}&certId=${encodeURIComponent(certificateId)}`;

  // Official LinkedIn Feed Share Link
  const shareText = `I'm proud to share that I have successfully completed the 7-calendar-day task-based internship in ${domainName} at INTERN-UP!

Built 5 practical domain milestones and verified my deliverables.

Check out my verified completion certificate: ${verificationUrl}

#INTERNUP #Internship #${domainName.replace(/\s+/g, '')} #CareerDevelopment`;

  const shareFeedUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
    shareText
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-white border border-blue-200/80 shadow-2xs space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Showcase Your Achievement</span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">
            Add to LinkedIn &amp; Share with Your Network
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Boost your profile credibility by linking your official verified credential directly to LinkedIn.
          </p>
        </div>

        <div className="shrink-0 p-2 rounded-xl bg-blue-600 text-white font-bold">
          <Share2 className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* 1. Add to LinkedIn Profile button */}
        <a
          href={addCertUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold text-xs shadow-xs transition-colors"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
          </svg>
          <span>Add to LinkedIn</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </a>

        {/* 2. Share on Feed button */}
        <a
          href={shareFeedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs shadow-2xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-[#0A66C2]" />
          <span>Post on LinkedIn Feed</span>
          <ExternalLink className="w-3 h-3 ml-0.5 text-slate-400" />
        </a>

        {/* 3. Copy Verification Link button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Verify Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
