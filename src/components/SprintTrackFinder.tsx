'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Code2,
  Clock,
  Compass,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/Button';
import { DomainLogo } from './DomainLogo';

interface Recommendation {
  domainSlug: string;
  domainName: string;
  tagline: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: string;
  technologies: string[];
  firstMilestone: string;
  whyMatched: string;
}

export const SprintTrackFinder: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [experience, setExperience] = useState<string>('');
  const [careerGoal, setCareerGoal] = useState<string>('');
  const [projectInterest, setProjectInterest] = useState<string>('');
  const [result, setResult] = useState<Recommendation | null>(null);

  const calculateRecommendation = (exp: string, goal: string, proj: string): Recommendation => {
    if (goal === 'ai_data' || proj === 'ml_classifier') {
      return {
        domainSlug: 'ai',
        domainName: 'Artificial Intelligence',
        tagline: 'Build machine learning pipelines, prompt engineering, and neural evaluation tools',
        difficulty: 'Intermediate',
        estimatedHours: '12 - 16 hrs',
        technologies: ['Python', 'PyTorch / Scikit-Learn', 'HuggingFace', 'NumPy'],
        firstMilestone: 'Task 1: AI Foundations & Data Pipeline Clean Room',
        whyMatched: 'Your focus on AI and data modeling aligns with our structured 5-milestone AI sprint.',
      };
    }

    if (goal === 'python_backend' || (exp === 'beginner' && proj === 'automation')) {
      return {
        domainSlug: 'python',
        domainName: 'Python Programming',
        tagline: 'Practical Python from CLI utilities to web scrapers and SQLite data managers',
        difficulty: 'Beginner',
        estimatedHours: '8 - 12 hrs',
        technologies: ['Python 3.12', 'SQLite', 'BeautifulSoup', 'Requests', 'pytest'],
        firstMilestone: 'Task 1: Structured Python CLI Utility with Argument Parser',
        whyMatched: 'Python provides the fastest ramp-up for beginners and automation engineers.',
      };
    }

    if (goal === 'cloud_devops' || proj === 'infrastructure') {
      return {
        domainSlug: 'cloud',
        domainName: 'Cloud Computing',
        tagline: 'Docker containerization, serverless functions, and resilient microservices',
        difficulty: 'Intermediate',
        estimatedHours: '10 - 14 hrs',
        technologies: ['Docker', 'AWS/GCP/Vercel', 'GitHub Actions', 'Microservices'],
        firstMilestone: 'Task 1: Dockerizing a Multi-Tier Web Application',
        whyMatched: 'High market demand for containerization and automated cloud deployments.',
      };
    }

    if (goal === 'mobile_ui' || proj === 'mobile_app') {
      return {
        domainSlug: 'android',
        domainName: 'Android Development',
        tagline: 'Interactive mobile user interfaces with clean architecture and local storage',
        difficulty: 'Intermediate',
        estimatedHours: '12 - 15 hrs',
        technologies: ['Kotlin / Flutter', 'Jetpack Compose', 'Room DB', 'Material 3'],
        firstMilestone: 'Task 1: Native Mobile View Architecture & State Holder',
        whyMatched: 'Ideal for building tangible smartphone apps you can showcase on your portfolio.',
      };
    }

    if (goal === 'security' || proj === 'sec_audit') {
      return {
        domainSlug: 'cybersecurity',
        domainName: 'Cybersecurity',
        tagline: 'Network penetration testing, vulnerability remediation, and crypto hygiene',
        difficulty: 'Advanced',
        estimatedHours: '14 - 18 hrs',
        technologies: ['Nmap', 'OWASP ZAP', 'Wireshark', 'Cryptography', 'Linux'],
        firstMilestone: 'Task 1: Security Reconnaissance & Port Vulnerability Mapping',
        whyMatched: 'Critical industry skillset for defensive computing and security auditing.',
      };
    }

    if (goal === 'iot_systems' || proj === 'iot_edge') {
      return {
        domainSlug: 'iot',
        domainName: 'Internet of Things',
        tagline: 'Edge sensor simulation, telemetry message protocols (MQTT/HTTP), and live monitoring',
        difficulty: 'Intermediate',
        estimatedHours: '12 - 16 hrs',
        technologies: ['ESP32/Arduino', 'MQTT', 'Python Telemetry', 'Sensors', 'Dashboard UI'],
        firstMilestone: 'Task 1: IoT Edge Architecture & Sensor Block Modeling',
        whyMatched: 'Your focus on smart devices and hardware telemetry connects directly to IoT industry standards.',
      };
    }

    // Default to Web Development
    return {
      domainSlug: 'web-dev',
      domainName: 'Web Development',
      tagline: 'Full-stack responsive web applications with modern APIs and state management',
      difficulty: 'Beginner',
      estimatedHours: '10 - 14 hrs',
      technologies: ['HTML5/CSS3', 'JavaScript / TypeScript', 'React / Next.js', 'REST APIs'],
      firstMilestone: 'Task 1: Semantic Responsive Landing Page with Flexbox/Grid',
      whyMatched: 'Our most versatile track, perfectly suited for rapid portfolio growth and interviews.',
    };
  };

  const handleNext = () => {
    if (step === 1 && experience) setStep(2);
    if (step === 2 && careerGoal) setStep(3);
    if (step === 3 && projectInterest) {
      const rec = calculateRecommendation(experience, careerGoal, projectInterest);
      setResult(rec);
      setStep(4);
    }
  };

  const handleReset = () => {
    setStep(1);
    setExperience('');
    setCareerGoal('');
    setProjectInterest('');
    setResult(null);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>INTERACTIVE SPRINT TRACK FINDER</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Your Ideal 7-Day Sprint Domain
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Answer 3 quick questions to receive a tailored engineering track recommendation with milestone tasks.
          </p>
        </div>

        {step > 1 && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1 flex items-center gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step >= num
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
            />
          </div>
        ))}
      </div>

      {/* STEP 1: Experience */}
      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
            Step 1 of 3: What is your current programming background?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'beginner',
                label: 'Beginner / First-Time Coder',
                desc: 'Familiar with basic logic; ready for hands-on guided projects.',
              },
              {
                id: 'student_cs',
                label: 'CS / Engineering College Student',
                desc: 'Know core syntax (C++, Java, or Python); need real portfolio code.',
              },
              {
                id: 'intermediate',
                label: 'Intermediate Developer',
                desc: 'Have written scripts/pages; want to master clean repos & deployment.',
              },
              {
                id: 'switcher',
                label: 'Career Transitioner',
                desc: 'Looking for verified verifiable platform credentials for resumes.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setExperience(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  experience === opt.id
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-600 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{opt.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <Button
              size="sm"
              disabled={!experience}
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Next: Career Interest
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Career Goal */}
      {step === 2 && (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
            Step 2 of 3: What technical field excites you the most?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'web_fullstack', title: 'Web & Full Stack', desc: 'Frontend UI, React, backend APIs' },
              { id: 'python_backend', title: 'Python & Automation', desc: 'Scripting, databases, CLI tools' },
              { id: 'ai_data', title: 'AI & Data Science', desc: 'Machine learning, analytics, neural models' },
              { id: 'cloud_devops', title: 'Cloud & Infrastructure', desc: 'Docker, microservices, cloud deployments' },
              { id: 'mobile_ui', title: 'Mobile & UI Design', desc: 'Android apps, responsive interfaces' },
              { id: 'security', title: 'Cybersecurity', desc: 'Security audits, network scanning, auth' },
              { id: 'iot_systems', title: 'IoT & Smart Devices', desc: 'Edge sensors, microcontrollers, telemetry' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCareerGoal(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  careerGoal === opt.id
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-600 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{opt.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-3">
            <Button size="sm" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              size="sm"
              disabled={!careerGoal}
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Next: Project Goal
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Project Interest */}
      {step === 3 && (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
            Step 3 of 3: What concrete project deliverable do you want in your GitHub portfolio?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'fullstack_portal', title: 'Interactive Web App', desc: 'A production web app with state management, API routes, and clean UI' },
              { id: 'automation', title: 'CLI & Automation Toolkit', desc: 'Modular scripts, data parsers, and SQLite schema managers' },
              { id: 'ml_classifier', title: 'Trained Machine Learning Model', desc: 'Data cleaning, feature engineering, and inference API' },
              { id: 'infrastructure', title: 'Dockerized Microservice', desc: 'Containerized service with environment configs and health monitoring' },
              { id: 'mobile_app', title: 'Native Mobile App', desc: 'Polished mobile UI with local offline persistence and smooth navigation' },
              { id: 'sec_audit', title: 'Security Recon & Remediation', desc: 'OWASP vulnerability analysis and cryptographic token protection' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setProjectInterest(opt.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  projectInterest === opt.id
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-600 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{opt.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-3">
            <Button size="sm" variant="ghost" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              size="sm"
              disabled={!projectInterest}
              onClick={handleNext}
              rightIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate Recommendation
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: RESULT */}
      {step === 4 && result && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-900 border-2 border-blue-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                  <DomainLogo slug={result.domainSlug} className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Recommended Track Match (100% Fit)
                  </span>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {result.domainName}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                  {result.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{result.estimatedHours}</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {result.tagline}
            </p>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Why this fits you:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {result.whyMatched}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                  Technologies Covered:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                  Your First 24-Hour Milestone:
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1">
                  {result.firstMilestone}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
            >
              &larr; Try other preferences
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/domains" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full">
                  Browse All 13 Domains
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />} className="w-full">
                  Enroll in {result.domainName}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
