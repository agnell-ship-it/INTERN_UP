'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Filter,
  Calendar,
} from 'lucide-react';
import { formatISTDate } from '@/lib/date-utils';
import { INITIAL_DOMAINS } from '@/lib/constants';

interface RegistryCert {
  certificate_id: string;
  student_name: string;
  domain_name: string;
  start_date: string;
  end_date: string;
  issue_date: string;
  status: 'issued' | 'revoked';
}

export default function CertificateRegistryPage() {
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [certificates, setCertificates] = useState<RegistryCert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistry = async (searchQ = query, filterD = domainFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQ.trim()) params.set('q', searchQ.trim());
      if (filterD && filterD !== 'all') params.set('domain', filterD);

      const res = await fetch(`/api/registry?${params.toString()}`);
      const data = await res.json();
      if (data.certificates) {
        setCertificates(data.certificates);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistry(query, domainFilter);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>DIGITAL CREDENTIAL DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Public Certificate Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Search and verify officially issued INTERN-UP completion certificates by student name,
          domain track, or unique certificate identifier.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by student name or certificate ID (e.g. INUP-2026)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <select
                aria-label="Filter certificates by domain"
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-700 font-medium"
              >
                <option value="all">All Domains (13)</option>
                {INITIAL_DOMAINS.map((d) => (
                  <option key={d.slug} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-900">{certificates.length}</strong> verified credential records
          </span>
          <Link href="/verify" className="text-blue-600 hover:underline font-medium">
            Single ID Direct Lookup &rarr;
          </Link>
        </div>
      </div>

      {/* Registry Results Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Searching official registry...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Certificates Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any certificates matching your search criteria. Try clearing filters or searching with another keyword.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.certificate_id}
              className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      cert.status === 'issued'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {cert.status === 'issued' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>Revoked</span>
                      </>
                    )}
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {cert.certificate_id.slice(-8)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base uppercase">
                    {cert.student_name}
                  </h3>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                    {cert.domain_name}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Issued: {formatISTDate(cert.issue_date)}</span>
                  </div>
                  <div className="font-mono text-slate-700 text-[11px] truncate">
                    ID: {cert.certificate_id}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href={`/verify/${encodeURIComponent(cert.certificate_id)}`}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center space-y-1">
        <strong className="text-slate-700">Privacy Safeguard Notice:</strong> Our registry allows
        employers to verify candidate credentials without exposing personal emails, contact numbers, or payment data.
      </div>
    </div>
  );
}
