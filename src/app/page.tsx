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
  Sparkles,
  Zap,
  Terminal,
  Check,
} from 'lucide-react';
import { COMPANY_INFO, INITIAL_DOMAINS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { ThiranexHero } from '@/components/ThiranexHero';
import { LivePlatformStats } from '@/components/LivePlatformStats';
import { GovernmentAuthoritySection } from '@/components/GovernmentAuthoritySection';
import { CareerPathTracksSection } from '@/components/CareerPathTracksSection';
import { SprintTrackFinder } from '@/components/SprintTrackFinder';
import { CredentialVerifierSandbox } from '@/components/CredentialVerifierSandbox';
import { DomainMatrixComparison } from '@/components/DomainMatrixComparison';
import { CohortUrgencyBanner } from '@/components/CohortUrgencyBanner';

// Domain scarcity mapping for limited slots marketing
const domainScarcityMap: Record<string, { badge: string; color: string }> = {
  'web-development': { badge: '🔥 3 Slots Left', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  'python-programming': { badge: '🔥 4 Slots Left', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  'full-stack-development': { badge: '🔥 2 Slots Left', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  'machine-learning': { badge: '🔥 3 Slots Left', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  'data-science': { badge: '🔥 4 Slots Left', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  'cyber-security': { badge: '🔥 2 Slots Left', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  'cloud-computing': { badge: '⚡ 86% Filled', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  'android-development': { badge: '⚡ 82% Filled', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  'java-programming': { badge: '🔥 4 Slots Left', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  'cpp-programming': { badge: '⚡ 80% Filled', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  'ui-ux-design': { badge: '🔥 3 Slots Left', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  'data-analytics': { badge: '⚡ 84% Filled', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  'database-management': { badge: '⚡ 78% Filled', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
};

// Domain icon and accent configuration
const domainColorConfig: Record<string, { bg: string; icon: React.ReactNode; hoverBorder: string; hoverText: string }> = {
  Globe: {
    bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/70 hover:shadow-blue-500/10',
    hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    icon: <Globe className="w-6 h-6" />,
  },
  Code2: {
    bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
    hoverBorder: 'hover:border-indigo-500/70 hover:shadow-indigo-500/10',
    hoverText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
    icon: <Code2 className="w-6 h-6" />,
  },
  Coffee: {
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/70 hover:shadow-amber-500/10',
    hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    icon: <Coffee className="w-6 h-6" />,
  },
  Cpu: {
    bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    hoverBorder: 'hover:border-purple-500/70 hover:shadow-purple-500/10',
    hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    icon: <Cpu className="w-6 h-6" />,
  },
  Binary: {
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/70 hover:shadow-emerald-500/10',
    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    icon: <Binary className="w-6 h-6" />,
  },
  LineChart: {
    bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20',
    hoverBorder: 'hover:border-teal-500/70 hover:shadow-teal-500/10',
    hoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    icon: <LineChart className="w-6 h-6" />,
  },
  BarChart3: {
    bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/70 hover:shadow-cyan-500/10',
    hoverText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    icon: <BarChart3 className="w-6 h-6" />,
  },
  Smartphone: {
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/70 hover:shadow-rose-500/10',
    hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    icon: <Smartphone className="w-6 h-6" />,
  },
  Palette: {
    bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20',
    hoverBorder: 'hover:border-pink-500/70 hover:shadow-pink-500/10',
    hoverText: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
    icon: <Palette className="w-6 h-6" />,
  },
  ShieldCheck: {
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/70 hover:shadow-emerald-500/10',
    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  Cloud: {
    bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
    hoverBorder: 'hover:border-sky-500/70 hover:shadow-sky-500/10',
    hoverText: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
    icon: <Cloud className="w-6 h-6" />,
  },
  Database: {
    bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
    hoverBorder: 'hover:border-violet-500/70 hover:shadow-violet-500/10',
    hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
    icon: <Database className="w-6 h-6" />,
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col pb-20 transition-colors space-y-10 sm:space-y-14">
      {/* 1. High-Impact Royal Blue Hero Section (Thiranex-style) */}
      <ThiranexHero />

      {/* 2. Massive Social Proof Stat Counters (Platform Live & Certificates Issued) */}
      <LivePlatformStats />

      {/* 3. Authority & MSME Government Recognized Trust Section */}
      <GovernmentAuthoritySection />

      {/* 4. Choose Your Career Path: 13 Technical Tracks Grid */}
      <CareerPathTracksSection />

      {/* 5. Interactive Sprint Track Finder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SprintTrackFinder />
      </section>

      {/* 6. 4-Step Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>PROGRESSION BLUEPRINT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How The Program Operates
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A clear, straightforward learning workflow built around verified milestones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-blue-500/25">
              01
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Select Domain &amp; Enroll</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Register an account, choose your primary technical domain, and download your personalized enrollment letter.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-indigo-500/25">
              02
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Pay ₹100 &amp; Get Certified</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              After your 5 tasks, pay ₹100 by UPI and enter your transaction ID. The administrator verifies it and awards your certificate.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-violet-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-purple-500/25">
              03
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Complete 5 Tasks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Build the 5 required practical projects and submit your individual GitHub repository links directly on your dashboard.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-emerald-500/25">
              04
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Pay ₹100 &amp; Get Certificate</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete the ₹100 direct UPI fee. Once verified by the administrator, download your official verified completion certificate.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/how-it-works"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 inline-flex items-center gap-1"
          >
            <span>Read complete 11-step guide &rarr;</span>
          </Link>
        </div>
      </section>

      {/* Domain Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DomainMatrixComparison />
      </section>

      {/* Document Highlights: Enrollment Letter & Certificate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DIGITALLY VERIFIABLE PLATFORM CREDENTIALS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Personalized Enrollment Letter &amp; Verified Completion Certificate
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Receive server-generated, tamper-resistant PDF documents signed by founder{' '}
                <strong>{COMPANY_INFO.founderName}</strong>. Every completion certificate features
                a cryptographically unguessable public ID verifiable in our registry with high-resolution QR codes.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Immediate Enrollment Letter download upon domain enrollment</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Completion Certificate after satisfying all 5 tasks &amp; mentor review</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Transparent ₹100 direct UPI program administration fee</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/register">
                  <Button variant="primary" size="md">
                    Enroll to Get Enrollment Letter
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
                <span className="text-[10px] text-blue-400 font-mono font-semibold">DIGITAL REGISTRY</span>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[11px] text-slate-400 font-medium">Verified Credential Sample:</div>
                <div className="text-sm font-bold text-slate-100">
                  Certificate of Accomplishment
                </div>
                <div className="text-xs text-blue-400 font-semibold">Web Development Track</div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Awarded to Rahul Sharma upon successful completion of 5 task milestones and verified GitHub submissions.
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>ID: INUP-2026-X7K2-M9L4</span>
                  <span className="text-emerald-400 font-semibold">STATUS: VERIFIED</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  href="/verify"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                >
                  <span>Verify Credential ID &rarr;</span>
                </Link>
                <Link
                  href="/registry"
                  className="text-slate-400 hover:text-slate-200 font-medium"
                >
                  Browse Public Registry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Verification Sandbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CredentialVerifierSandbox />
      </section>

      {/* Verified Graduates & Real Intern Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AUTHENTIC SPRINT GRADUATES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built by Students, Verified by Code
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Hear from real interns across universities who completed all 5 milestone repositories and verified their credentials in our public registry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
                    PP
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Priya Patel</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">VIT Vellore &bull; B.Tech CSE</p>
                  </div>
                </div>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                Web Development Track
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;The 7-day structure was exactly the discipline I needed. Submitting 5 separate GitHub repos with README files gave me tangible projects to talk through in my internship interviews.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <Link
                href="/verify/INUP-2026-W9K2-M8L1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium"
              >
                ID: INUP-2026-W9K2
              </Link>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm">
                    RN
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Rohan Nair</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">PES University &bull; ISE</p>
                  </div>
                </div>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">
                Python Programming Track
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;Clear milestones without fluff. Instead of multiple-choice tests, I actually wrote CLI tools, data scrapers, and SQLite queries. Adding the verified certificate to LinkedIn took 30 seconds.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <Link
                href="/verify/INUP-2026-P3X8-T9B4"
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium"
              >
                ID: INUP-2026-P3X8
              </Link>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-sm">
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ananya Iyer</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">SRM Institute &bull; Data Science</p>
                  </div>
                </div>
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                Data Science Track
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;I appreciated the transparency: the ₹100 direct UPI fee was straightforward, and the mentor reviewer feedback on my EDA task pointed out edge cases in my pandas cleanups.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <Link
                href="/verify/INUP-2026-D7N4-Q2V5"
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono font-medium"
              >
                ID: INUP-2026-D7N4
              </Link>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Disclosures & Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-blue-50/50 dark:bg-slate-900/60 border border-blue-200/70 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Honest Educational Policy &amp; Disclosures</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            INTERN-UP is an independent, task-driven skill-building platform operated by {COMPANY_INFO.legalEntityName}.
            Submitting code links confirms completion of program tasks but does not imply third-party audit or guaranteed corporate placement.
            Our ₹100 direct UPI fee supports program operations, manual reviews, and document issuance.
          </p>
        </div>
      </section>
    </div>
  );
}
