import React from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Compass,
  FileDown,
  Share2,
  CheckCircle2,
  Clock,
  Code2,
  GitBranch,
  IndianRupee,
  ShieldCheck,
  Award,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ReviewRubricSection } from '@/components/ReviewRubricSection';

export default function HowItWorksPage() {
  const steps = [
    {
      num: 1,
      title: 'Register Student Account',
      desc: 'Create an account with your full name, email, and academic details. No admin role can ever be self-assigned during registration.',
      icon: <UserPlus className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      num: 2,
      title: 'Select a Computer Science Domain',
      desc: 'Browse our catalog of 13 technology domains. Enroll in one active domain per 7-calendar-day sprint.',
      icon: <Compass className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200',
    },
    {
      num: 3,
      title: 'Download Official Enrollment Letter',
      desc: 'Instantly download your server-signed PDF enrollment letter featuring your name, selected track, start date, and deadline.',
      icon: <FileDown className="w-5 h-5 text-sky-600" />,
      color: 'bg-sky-50 border-sky-200',
    },
    {
      num: 4,
      title: 'Wait for Administrator Approval',
      desc: 'The administrator reviews your submission to confirm your post is accessible. If rejected, resubmission with feedback is allowed.',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200',
    },
    {
      num: 5,
      title: 'Complete Five Practical Tasks',
      desc: 'Work through the five structured milestones specified in your domain syllabus. Build achievable, hands-on projects.',
      icon: <Code2 className="w-5 h-5 text-violet-600" />,
      color: 'bg-violet-50 border-violet-200',
    },
    {
      num: 6,
      title: 'Submit GitHub Repository Links',
      desc: 'Push your project code to GitHub and submit the direct HTTPS repository link for each of the 5 tasks.',
      icon: <GitBranch className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      num: 7,
      title: 'Pay ₹100 Certificate Fee (When Complete)',
      desc: 'As soon as you submit all 5 tasks, the payment step unlocks. Pay the ₹100 certificate fee via UPI.',
      icon: <IndianRupee className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200',
    },
    {
      num: 8,
      title: 'Manual Administrator Payment Verification',
      desc: 'Submit your UTR / Transaction Reference. The administrator manually verifies the incoming funds in bank statements before approval.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200',
    },
    {
      num: 9,
      title: 'Download Verified Completion Certificate',
      desc: 'Once your 5 tasks are submitted and your payment is verified by the administrator, your official completion certificate unlocks for download.',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <span>STEP-BY-STEP PROCESS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How INTERN-UP Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Our seven-calendar-day program follows a rigorous 11-step journey ensuring structured
          execution, public accountability, and transparent verification.
        </p>
      </div>

      {/* Important Disclosure Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Important Notice Regarding Task Submissions:</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            Submitting a GitHub repository link proves completion and tracking of your required milestones.
            It does not automatically imply that your code has undergone independent commercial code auditing,
            nor does it guarantee employment or university credits.
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <div className="flex items-center gap-3 shrink-0">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                {step.num}
              </span>
              <div className={`p-2.5 rounded-xl border ${step.color}`}>{step.icon}</div>
            </div>

            <div className="flex-1 space-y-1">
              <h2 className="text-base font-bold text-slate-900">{step.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Review Rubric Section */}
      <ReviewRubricSection />

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link href="/register">
          <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Ready to Begin? Enroll Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
