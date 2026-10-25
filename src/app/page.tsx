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
import { SprintTrackFinder } from '@/components/SprintTrackFinder';
import { CredentialVerifierSandbox } from '@/components/CredentialVerifierSandbox';
import { DomainMatrixComparison } from '@/components/DomainMatrixComparison';

// Domain icon mapper
const domainIconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  Code2: <Code2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
  Coffee: <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
  Cpu: <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
  Binary: <Binary className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
  LineChart: <LineChart className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
  BarChart3: <BarChart3 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
  Smartphone: <Smartphone className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
  Palette: <Palette className="w-6 h-6 text-pink-600 dark:text-pink-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
  Cloud: <Cloud className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
  Database: <Database className="w-6 h-6 text-violet-600 dark:text-violet-400" />,
};

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-16 sm:space-y-24 pb-20 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 mesh-gradient-hero border-b border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span>7-CALENDAR-DAY TASK-BASED SPRINT TRACK</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Build Real Software Skills Through{' '}
              <span className="text-gradient">Structured Engineering</span> Tasks
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Select one of 13 engineering domains, build five practical project milestones,
              submit verifiable GitHub repositories, and earn digitally verifiable credentials.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/register">
                <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start 7-Day Sprint
                </Button>
              </Link>
              <Link href="/domains">
                <Button variant="outline" size="lg">
                  Explore 13 Domains
                </Button>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left border-t border-slate-200/80 dark:border-slate-800">
              <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">13</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">CS Engineering Domains</div>
              </div>
              <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">5 Tasks</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Curriculum Milestones</div>
              </div>
              <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">7 Days</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Strict Sprint Horizon</div>
              </div>
              <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">₹100</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Direct UPI Program Fee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sprint Track Finder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SprintTrackFinder />
      </section>

      {/* 4-Step Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How The Program Operates
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A clear, straightforward learning workflow built around verified milestones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative hover:border-blue-400 transition-all">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Select Domain &amp; Enroll</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Register an account, choose your primary technical domain, and download your personalized enrollment letter.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative hover:border-indigo-400 transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Announce on LinkedIn</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Share your participation announcement on LinkedIn and submit your public URL for administrative review.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative hover:border-purple-400 transition-all">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Complete 5 Tasks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Build the 5 required practical projects and submit your individual GitHub repository links directly on your dashboard.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative hover:border-emerald-400 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Pay ₹100 & Get Certificate</h3>
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

      {/* 13 Domains Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Curriculum Tracks
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {domainIconMap[domain.icon_name] || <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {domain.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">5 Structured Tasks</span>
                <Link
                  href={`/register`}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Enroll</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
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
