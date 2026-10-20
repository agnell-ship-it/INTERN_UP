'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  IndianRupee,
  CheckCircle2,
  Building2,
  UserCheck,
} from 'lucide-react';

interface DynamicUpiQrCardProps {
  upiId?: string;
  programFee?: number;
  qrImageUrl?: string;
  instructions?: string;
}

export const DynamicUpiQrCard: React.FC<DynamicUpiQrCardProps> = ({
  programFee = 100,
  qrImageUrl,
  instructions,
}) => {
  const [copied, setCopied] = useState(false);
  const [generatedQr, setGeneratedQr] = useState<string>('');

  // Official Public Identity displayed to students
  const publicPayeeName = 'Dr. Jonath Watson';
  const publicPayeeTitle = 'Founder & Program Director, INTERN-UP';
  const publicDisplayHandle = 'jonath.watson@internup';

  // Secure payment routing target (Routes to your bank account with Payee Name as Jonath Watson)
  const receivingVpa = 'agnelvishwak02@okaxis';
  const gpayAccountId = 'uGICAgOCA3Z25ZA';

  // Construct official standard UPI URI with Payee Name = Jonath Watson
  const upiUri = `upi://pay?pa=${encodeURIComponent(
    receivingVpa
  )}&pn=${encodeURIComponent(
    'Jonath Watson'
  )}&aid=${encodeURIComponent(
    gpayAccountId
  )}&am=${programFee}&cu=INR&tn=${encodeURIComponent(
    'INTERN-UP Certificate Verification Fee'
  )}`;

  useEffect(() => {
    // Generate clean, high-resolution vector QR code without personal branding
    QRCode.toDataURL(upiUri, {
      width: 360,
      margin: 1,
      color: {
        dark: '#0f172a', // Slate 900
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setGeneratedQr(url))
      .catch((err) => console.error('Failed to generate UPI QR code:', err));
  }, [upiUri]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicDisplayHandle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
              Official Program Payment Gateway
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Scan to Pay Certificate Verification Fee
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Supported via Google Pay, PhonePe, Paytm, BHIM, and all UPI mobile applications
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-extrabold shadow-2xs">
          <IndianRupee className="w-4 h-4" />
          <span>Pay Exactly ₹{programFee}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Scannable Clean QR Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>INTERN-UP Official QR</span>
          </div>

          <div className="relative p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {generatedQr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={generatedQr}
                alt="INTERN-UP Official UPI QR Code"
                className="w-52 h-52 object-contain rounded-xl"
              />
            ) : qrImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrImageUrl}
                alt="Official UPI QR Code"
                className="w-52 h-52 object-contain rounded-xl"
              />
            ) : (
              <div className="w-52 h-52 flex flex-col items-center justify-center text-slate-400 space-y-2">
                <QrCode className="w-12 h-12 text-slate-300 animate-pulse" />
                <span className="text-xs">Generating Secure QR...</span>
              </div>
            )}

            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs whitespace-nowrap">
              Payee: {publicPayeeName}
            </div>
          </div>

          <div className="space-y-1 pt-1 text-center">
            <span className="text-xs font-bold text-slate-800 block">
              Scan with Any UPI Application
            </span>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>Google Pay</span>
              <span>&bull;</span>
              <span>PhonePe</span>
              <span>&bull;</span>
              <span>Paytm</span>
              <span>&bull;</span>
              <span>BHIM</span>
            </div>
          </div>

          {/* Pay on Mobile Button (Deep links directly to UPI app on phones with payee Jonath Watson) */}
          <a
            href={upiUri}
            className="w-full inline-flex md:hidden items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            <span>Open in UPI App on this Device</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>

        {/* Payee Info & Steps */}
        <div className="space-y-5">
          {/* Beneficiary Identity Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Official Program Beneficiary
            </span>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  JW
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{publicPayeeName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {publicPayeeTitle}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                Verified
              </span>
            </div>
          </div>

          {/* Official Channel */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Payment Reference Account
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs font-bold text-slate-800 truncate select-all">
                {publicDisplayHandle}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
                title="Copy Handle"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Step Instructions */}
          <div className="space-y-2 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block">3 Easy Steps to Complete:</span>
            <ol className="list-decimal pl-4 space-y-2 text-slate-600">
              <li>
                Open <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or your mobile banking app.
              </li>
              <li>
                <strong>Scan the official QR code</strong> on the left (Payee: <strong className="text-slate-900">{publicPayeeName}</strong>).
              </li>
              <li>
                Confirm the amount <strong className="text-slate-900">₹{programFee}</strong> and complete payment. Copy the 12-digit <strong>UTR / UPI Transaction ID</strong> from your payment receipt and submit below.
              </li>
            </ol>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {instructions ||
                'All transactions are securely routed to INTERN-UP and reconciled manually by the administrator against bank statements. Ensure your UTR reference is accurate to prevent verification delays.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
