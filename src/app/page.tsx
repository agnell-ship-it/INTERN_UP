import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  FileText,
  Award,
  ShieldCheck,
  Calendar,
  Globe,
  Code2,
  Coffee,
  Cpu,
  Binary,
  LineChart,
  BarChart3,
  Smartphone,
  Palette,
  Database,
  Cloud,
} from 'lucide-react';
import { COMPANY_INFO, INITIAL_DOMAINS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

// Domain icon mapper
const domainIconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-6 h-6 text-blue-600" />,
  Code2: <Code2 className="w-6 h-6 text-indigo-600" />,
  Coffee: <Coffee className="w-6 h-6 text-amber-600" />,
  Cpu: <Cpu className="w-6 h-6 text-purple-600" />,
  Binary: <Binary className="w-6 h-6 text-emerald-600" />,
  LineChart: <LineChart className="w-6 h-6 text-teal-600" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-cyan-600" />,
  Smartphone: <Smartphone className="w-6 h-6 text-rose-600" />,
  Palette: <Palette className="w-6 h-6 text-pink-600" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
  Cloud: <Cloud className="w-6 h-6 text-sky-600" />,
  Database: <Database className="w-6 h-6 text-violet-600" />,
};

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>7-CALENDAR-DAY STRUCTURED INTERNSHIP TRACK</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Build Practical Skills Through{' '}
              <span className="text-blue-600">Structured, Task-Based</span> Learning
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Choose a computer science domain, complete five structured learning tasks,
              submit your work links, and track your progress through INTERN-UP.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/register">
                <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Your 7-Day Track
                </Button>
              </Link>
              <Link href="/domains">
                <Button variant="outline" size="lg">
                  Explore 13 Domains
                </Button>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left border-t border-slate-200/80">
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-xl font-bold text-slate-900">13</div>
                <div className="text-xs text-slate-500 font-medium">CS Domains</div>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-xl font-bold text-slate-900">5 Tasks</div>
                <div className="text-xs text-slate-500 font-medium">Hands-On Milestones</div>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-xl font-bold text-slate-900">7 Days</div>
                <div className="text-xs text-slate-500 font-medium">Structured Timeline</div>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="text-xl font-bold text-emerald-600">₹100</div>
                <div className="text-xs text-slate-500 font-medium">Direct UPI Fee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How The Program Operates
          </h2>
          <p className="text-sm text-slate-500">
            A clear, straightforward learning workflow built around verified milestones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Select Domain & Enroll</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Register an account, choose your primary technical domain, and download your personalized offer letter.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Announce on LinkedIn</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Share your participation announcement on LinkedIn and submit your public URL for administrative review.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Complete 5 Tasks</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Build the 5 required practical projects and submit your individual GitHub repository links directly on your dashboard.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Pay ₹100 & Get Certificate</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete the ₹100 direct UPI fee. Once verified by the administrator, download your official verified completion certificate.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/how-it-works"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
          >
            <span>Read complete 11-step guide &rarr;</span>
          </Link>
        </div>
      </section>

      {/* 13 Domains Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Curriculum Tracks
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              13 Technical Internship Domains
            </h2>
          </div>
          <Link href="/domains">
            <Button variant="outline" size="sm">
              View All Tasks &rarr;
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_DOMAINS.map((domain) => (
            <div
              key={domain.slug}
              className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {domainIconMap[domain.icon_name] || <Code2 className="w-6 h-6 text-blue-600" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {domain.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">5 Structured Tasks</span>
                <Link
                  href={`/register`}
                  className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Enroll</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Document Highlights: Offer Letter & Certificate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>OFFICIAL ACCREDITED PLATFORM DOCUMENTS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Personalized Offer Letter & Verified Completion Certificate
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Receive server-generated, tamper-resistant PDF documents signed by founder{' '}
                <strong>{COMPANY_INFO.founderName}</strong>. Every completion certificate features
                a unique public ID verifiable through our registry.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Immediate Offer Letter download upon domain enrollment</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Completion Certificate after satisfying all 5 tasks & review</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Transparent ₹100 direct UPI program administration fee</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/register">
                  <Button variant="primary" size="md">
                    Enroll to Get Offer Letter
                  </Button>
                </Link>
              </div>
            </div>

            {/* Document preview mockup */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-sm tracking-tight">INTERN-UP</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">SAMPLE REGISTRY</span>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-400 font-medium">Document Preview:</div>
                <div className="text-sm font-bold text-slate-100">
                  Certificate of Accomplishment
                </div>
                <div className="text-xs text-blue-400 font-semibold">Web Development Track</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Awarded to Rahul Sharma upon successful completion of 5 task milestones and verified GitHub submissions.
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>ID: INUP-2026-X7K2-M9L4</span>
                  <span className="text-emerald-400 font-semibold">STATUS: VERIFIED</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/verify"
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Test public certificate verification portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Disclosures & Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Honest Educational Policy & Disclosures</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            INTERN-UP is an independent, task-driven skill-building platform. Submitting code links confirms
            completion of program tasks but does not imply third-party audit or guaranteed corporate placement.
            Our ₹100 direct UPI fee supports program operations, manual reviews, and document issuance.
          </p>
        </div>
      </section>
    </div>
  );
}
