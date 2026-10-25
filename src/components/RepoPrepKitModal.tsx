'use client';

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { INITIAL_DOMAINS } from '@/lib/constants';

interface RepoPrepKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomainSlug?: string;
}

export const RepoPrepKitModal: React.FC<RepoPrepKitModalProps> = ({
  isOpen,
  onClose,
  defaultDomainSlug = 'web-dev',
}) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'checklist'>('generator');
  const [selectedDomain, setSelectedDomain] = useState(defaultDomainSlug);
  const [milestoneNumber, setMilestoneNumber] = useState('1');
  const [projectName, setProjectName] = useState('Task Milestone Project');
  const [authorName, setAuthorName] = useState('Student Engineer');
  const [githubUser, setGithubUser] = useState('username');
  const [copied, setCopied] = useState(false);

  // Pre-submission checklist items
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    public: true,
    commits: true,
    readme: true,
    runnable: true,
    original: true,
  });

  const domain = INITIAL_DOMAINS.find((d) => d.slug === selectedDomain) || INITIAL_DOMAINS[0];

  const generatedReadme = `# ${projectName}

[![INTERN-UP Verified Milestone](https://img.shields.io/badge/INTERN--UP-Sprint%20Milestone%20${milestoneNumber}-2563eb?style=for-the-badge&logo=github)](https://intern-up.vercel.app/)
[![Domain Track: ${domain.name}](https://img.shields.io/badge/Domain-${encodeURIComponent(domain.name)}-10b981?style=for-the-badge)](https://intern-up.vercel.app/domains)

## 📌 Project Overview
This repository contains Milestone **Task ${milestoneNumber}** for the **7-Calendar-Day ${domain.name} Internship Sprint** at [INTERN-UP](https://intern-up.vercel.app/).

* **Author:** ${authorName} ([@${githubUser}](https://github.com/${githubUser}))
* **Domain Track:** ${domain.name}
* **Milestone:** ${milestoneNumber} of 5
* **Platform Registry:** [Verify Credential](https://intern-up.vercel.app/registry)

---

## 🎯 Learning Objectives & Deliverables
* Implemented core practical requirements as specified by the INTERN-UP curriculum rubric.
* Maintained clean Git hygiene with atomic, descriptive commits throughout the sprint.
* Validated edge cases and ensured full reproducibility.

---

## 🛠️ Technology Stack
* Primary Language / Framework: Relevant to ${domain.name}
* Version Control: Git & GitHub
* Tooling & Package Management: Modern standard dependencies

---

## 🚀 Getting Started

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/${githubUser}/${projectName.toLowerCase().replace(/\\s+/g, '-')}.git
cd ${projectName.toLowerCase().replace(/\\s+/g, '-')}
\`\`\`

### 2. Install dependencies
\`\`\`bash
# Install required packages
npm install  # or: pip install -r requirements.txt
\`\`\`

### 3. Run the application
\`\`\`bash
# Start development or run entry point
npm run dev  # or: python main.py
\`\`\`

---

## 📋 Evaluation Rubric Compliance
- [x] **Git Hygiene (20%):** Granular commit history following standard conventional commit tags.
- [x] **Deliverable Completeness (25%):** Satisfies all acceptance requirements for Milestone ${milestoneNumber}.
- [x] **Code Quality & Architecture (20%):** Modular separation of concerns, readable variable naming, zero lint warnings.
- [x] **Documentation (20%):** Exhaustive setup instructions, dependency documentation, and architecture description.
- [x] **Originality (15%):** 100% original student implementation without unauthorized boilerplate plagiarism.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedReadme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const checklistScore = Object.values(checklist).filter(Boolean).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GitHub Repository Preparation Kit"
    >
      <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>README Template Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pre-Submission Rubric Checklist ({checklistScore}/5)</span>
          </button>
        </div>

        {/* TAB 1: README GENERATOR */}
        {activeTab === 'generator' && (
          <div className="space-y-4">
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Generate an interview-ready, rubric-compliant README for your GitHub task submissions.
              Reviewers check for structured documentation before approving milestones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Domain Track
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  {INITIAL_DOMAINS.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Milestone Number
                </label>
                <select
                  value={milestoneNumber}
                  onChange={(e) => setMilestoneNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="1">Milestone 1 of 5</option>
                  <option value="2">Milestone 2 of 5</option>
                  <option value="3">Milestone 3 of 5</option>
                  <option value="4">Milestone 4 of 5</option>
                  <option value="5">Milestone 5 of 5</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Responsive E-Commerce Catalog"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your GitHub Username
                </label>
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  placeholder="octocat"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
            </div>

            {/* Markdown Preview Area */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  Generated README.md (Markdown)
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCopy}
                  leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
                </Button>
              </div>

              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 text-[11px] font-mono max-h-48 overflow-y-auto leading-relaxed select-all">
                {generatedReadme}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: PRE-SUBMISSION CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-blue-900 dark:text-blue-200">
                  Rubric Readiness: {checklistScore} / 5 Criteria Met
                </span>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                  {checklistScore === 5
                    ? '🎉 Excellent! Your repository complies with all 5 review rubric standards.'
                    : 'Review and confirm each item before submitting your GitHub link.'}
                </p>
              </div>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {Math.round((checklistScore / 5) * 100)}%
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'public',
                  title: '1. Repository is Publicly Accessible',
                  desc: 'GitHub visibility must be set to "Public" so mentors can inspect your commits and code.',
                },
                {
                  id: 'commits',
                  title: '2. Granular Git Commit History',
                  desc: 'Contains multiple descriptive commits showing feature development (not just a single zip commit).',
                },
                {
                  id: 'runnable',
                  title: '3. Functional Codebase with Entry Point',
                  desc: 'Code runs without crashing; dependencies are defined in package.json or requirements.txt.',
                },
                {
                  id: 'readme',
                  title: '4. Comprehensive README.md Included',
                  desc: 'Explains what the project does, dependencies, how to run it locally, and demo links.',
                },
                {
                  id: 'original',
                  title: '5. Original Work & Academic Integrity',
                  desc: 'Implementation is your own work and complies with INTERN-UP terms on code originality.',
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    checklist[item.id]
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.id]}
                    onChange={(e) =>
                      setChecklist((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Kit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
