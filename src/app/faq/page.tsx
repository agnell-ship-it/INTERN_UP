'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, Mail, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export default function FaqPage() {
  const [openIndices, setOpenIndices] = useState<Record<string, boolean>>({
    '0-0': true, // first one open by default
  });

  const toggleAccordion = (key: string) => {
    setOpenIndices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const faqData: FaqCategory[] = [
    {
      category: 'Enrollment & Program Duration',
      items: [
        {
          question: 'What is the exact program duration?',
          answer:
            'The program duration is exactly seven (7) calendar days from the moment you enroll in an active domain. Your personalized deadline is calculated and displayed on your student dashboard in Asia/Kolkata (IST) timezone.',
        },
        {
          question: 'Can I enroll in multiple domains simultaneously?',
          answer:
            'To ensure deep focus and high execution quality, a student may enroll in only one active domain at a time. Upon completing or finishing your ongoing sprint, you may enroll in another domain.',
        },
        {
          question: 'Who is eligible to participate in INTERN-UP?',
          answer:
            'Students, recent graduates, and self-taught developers of all backgrounds who wish to build hands-on practical skills are welcome to register and enroll.',
        },
      ],
    },
    {
      category: 'Tasks & GitHub Submissions',
      items: [
        {
          question: 'What are the task requirements?',
          answer:
            'Each of the 13 domains features 5 structured, progressive milestones. Each task must be fulfilled by building code and providing a valid, accessible HTTPS GitHub repository link.',
        },
        {
          question: 'Does INTERN-UP review or execute my code?',
          answer:
            'INTERN-UP is a task-submission and milestone-tracking platform. Submitting a link records that you have completed and published the deliverable; it does not claim to execute independent commercial code auditing or quality reviews.',
        },
        {
          question: 'Can I edit or update my GitHub links after submitting?',
          answer:
            'Yes! You can update your submitted repository links anytime prior to final certificate issuance directly from your student dashboard.',
        },
      ],
    },
    {
      category: 'LinkedIn Announcement',
      items: [
        {
          question: 'Why do I need to share on LinkedIn?',
          answer:
            'Public accountability helps reinforce your learning sprint and connects you with a community of peers. You must share your offer letter or enrollment announcement on LinkedIn and submit your public post URL for verification.',
        },
        {
          question: 'What if my LinkedIn submission is rejected?',
          answer:
            'If a link is inaccessible or invalid, the administrator will provide a clear rejection reason. You can review the feedback on your dashboard and resubmit a corrected link immediately.',
        },
      ],
    },
    {
      category: 'Payment & Direct UPI Fee',
      items: [
        {
          question: 'When do I pay the ₹100 fee?',
          answer:
            'At INTERN-UP, you build and learn first. The ₹100 certificate verification fee is strictly locked and only payable once you have submitted all 5 domain tasks and had your LinkedIn announcement approved by the administrator.',
        },
        {
          question: 'What is the program fee and how is it paid?',
          answer:
            'The one-time program administration fee is ₹100 per student. Payment is made via direct UPI (Google Pay, PhonePe, Paytm, BHIM, or any UPI app) using our official UPI ID or scanned QR code.',
        },
        {
          question: 'How is my payment verified?',
          answer:
            'Payment verification is performed manually by the administrator against actual bank records. Entering a UTR reference number or uploading a screenshot does not automatically approve payment.',
        },
      ],
    },
    {
      category: 'Enrollment Letters & Certificates',
      items: [
        {
          question: 'When do I get my Enrollment Letter?',
          answer:
            'Your personalized, server-signed PDF enrollment letter is generated and available for immediate download the moment you select your domain.',
        },
        {
          question: 'What happens if I miss the 7-day deadline: extension, retry, or fail?',
          answer:
            'We provide flexible student support: (1) 3-Day Extension: You can activate a one-time 3-calendar-day extension directly from your dashboard before deadline cutoff. (2) Free Retry: If your sprint expires before completing all 5 tasks, you can re-enroll in a fresh sprint cohort within 30 days at zero extra charge. (3) Work Preservation: Your previously submitted GitHub repositories remain saved. Enrollments are only marked failed after 30 days of inactivity or plagiarism.',
        },
        {
          question: 'How are my submitted task repositories reviewed?',
          answer:
            'Platform reviewers evaluate each task against our 5-point rubric: Repository Structure & Git Hygiene (20%), Deliverable Completeness (25%), Code Quality & Modularity (20%), README Documentation (20%), and Academic Integrity (15%). Reviewer feedback is visible directly on each task card.',
        },
        {
          question: 'What are the strict conditions for receiving the Completion Certificate?',
          answer:
            'To unlock your certificate, you must satisfy all requirements: (1) Active enrollment, (2) Approved LinkedIn announcement, (3) All 5 tasks submitted with valid GitHub links, and (4) Approved ₹100 direct UPI payment.',
        },
        {
          question: 'Can an employer verify my certificate?',
          answer:
            'Yes! Every certificate contains a unique cryptographically unguessable ID (e.g., INUP-2026-XXXX-XXXX) that can be verified by anyone on our public registry at /verify without exposing sensitive personal information.',
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Everything You Need to Know
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Find answers about our 7-calendar-day program, task milestones, payment, and certificates.
        </p>
      </div>

      <div className="space-y-8">
        {faqData.map((cat, cIdx) => (
          <div key={cat.category} className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
              {cat.category}
            </h2>

            <div className="space-y-2.5">
              {cat.items.map((item, iIdx) => {
                const key = `${cIdx}-${iIdx}`;
                const isOpen = !!openIndices[key];

                return (
                  <div
                    key={item.question}
                    className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() => toggleAccordion(key)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-slate-900 text-sm">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still have questions? */}
      <div className="p-6 sm:p-8 bg-blue-50/70 rounded-2xl border border-blue-200 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-900">Still have questions?</h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Reach out to our support team at{' '}
          <a
            href={`mailto:${COMPANY_INFO.supportEmail}`}
            className="text-blue-600 font-semibold underline"
          >
            {COMPANY_INFO.supportEmail}
          </a>
          . We are always ready to help.
        </p>
        <div className="pt-2">
          <Link href="/contact">
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
