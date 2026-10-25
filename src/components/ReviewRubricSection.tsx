import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileCode,
  GitBranch,
  BookOpen,
  Award,
  AlertCircle,
} from 'lucide-react';

export const ReviewRubricSection: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const criteria = [
    {
      title: '1. Repository Structure & Git Hygiene',
      weight: '20%',
      icon: <GitBranch className="w-4 h-4 text-blue-600" />,
      description:
        'Repository must be public with sensible branch structure, clear commit messages, and no committed binary secrets or node_modules.',
      passingStandard: 'Public GitHub repo, at least 2 distinct commits, clean directory layout.',
    },
    {
      title: '2. Deliverable Completeness',
      weight: '25%',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      description:
        'All required project files and features specified in the task prompt must be present and functional.',
      passingStandard: 'All core task deliverables implemented without syntax errors.',
    },
    {
      title: '3. Code Quality & Modularity',
      weight: '20%',
      icon: <FileCode className="w-4 h-4 text-purple-600" />,
      description:
        'Readable, idiomatic code adhering to domain conventions (semantic HTML, modular Python functions, proper exception handling).',
      passingStandard: 'Consistent formatting, descriptive variable naming, basic error handling.',
    },
    {
      title: '4. Documentation & README Quality',
      weight: '20%',
      icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      description:
        'A comprehensive README.md explaining the project purpose, architecture, setup/run commands, dependencies, and demo screenshots/links.',
      passingStandard: 'Project title, brief description, setup commands, and expected output.',
    },
    {
      title: '5. Academic Integrity & Originality',
      weight: '15%',
      icon: <ShieldCheck className="w-4 h-4 text-sky-600" />,
      description:
        'Self-authored solution demonstrating personal understanding. External libraries must be cited in the README.',
      passingStandard: 'Independent authorship without verbatim repo duplication.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-transparent dark:border-blue-800/60">
          <Award className="w-3.5 h-3.5" />
          <span>EVALUATION STANDARDS</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          How Your Submissions Are Reviewed
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Every task deliverable is evaluated against our standardized 5-point evaluation rubric by platform mentors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map((c) => (
          <div
            key={c.title}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                {c.icon}
                <span>{c.title}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-bold text-blue-700 dark:text-blue-400">
                {c.weight}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{c.description}</p>
            <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Passing Criteria: </strong>
              <span>{c.passingStandard}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span>Reviewer Feedback &amp; Resubmission Policy</span>
        </div>
        <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
          If a mentor flags an incomplete deliverable or broken GitHub link, constructive comments are posted
          directly on your dashboard task item with a &ldquo;Changes Requested&rdquo; badge. You can update your
          code, push to GitHub, and resubmit anytime during your sprint window without penalty.
        </p>
      </div>
    </div>
  );
};
