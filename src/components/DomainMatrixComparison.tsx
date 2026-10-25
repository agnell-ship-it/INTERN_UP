'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Filter,
  Layers,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_DOMAINS } from '@/lib/constants';

interface DomainSpec {
  slug: string;
  name: string;
  category: 'web_apps' | 'data_ai' | 'cloud_systems' | 'programming';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estHours: string;
  coreTools: string[];
  careerRoles: string;
}

const DOMAIN_SPECS: DomainSpec[] = [
  {
    slug: 'web-dev',
    name: 'Web Development',
    category: 'web_apps',
    difficulty: 'Beginner',
    estHours: '10 - 14 hrs',
    coreTools: ['HTML5', 'CSS3', 'JavaScript', 'React', 'REST APIs'],
    careerRoles: 'Frontend Developer, Full-Stack Engineer, Web Specialist',
  },
  {
    slug: 'python',
    name: 'Python Programming',
    category: 'programming',
    difficulty: 'Beginner',
    estHours: '8 - 12 hrs',
    coreTools: ['Python 3.12', 'SQLite', 'BeautifulSoup', 'Requests', 'pytest'],
    careerRoles: 'Python Developer, Automation Engineer, Backend Apprentice',
  },
  {
    slug: 'ai',
    name: 'Artificial Intelligence',
    category: 'data_ai',
    difficulty: 'Intermediate',
    estHours: '12 - 16 hrs',
    coreTools: ['PyTorch', 'Scikit-Learn', 'HuggingFace', 'NumPy', 'Pandas'],
    careerRoles: 'AI Associate, Machine Learning Engineer, Model Evaluator',
  },
  {
    slug: 'machine-learning',
    name: 'Machine Learning',
    category: 'data_ai',
    difficulty: 'Intermediate',
    estHours: '12 - 16 hrs',
    coreTools: ['Scikit-Learn', 'XGBoost', 'Feature Engineering', 'Seaborn'],
    careerRoles: 'ML Engineer, Data Scientist, Predictive Modeler',
  },
  {
    slug: 'data-science',
    name: 'Data Science',
    category: 'data_ai',
    difficulty: 'Intermediate',
    estHours: '12 - 15 hrs',
    coreTools: ['Jupyter', 'Pandas', 'Statsmodels', 'Matplotlib', 'SQL'],
    careerRoles: 'Data Scientist, Quantitative Analyst, Research Associate',
  },
  {
    slug: 'data-analytics',
    name: 'Data Analytics',
    category: 'data_ai',
    difficulty: 'Beginner',
    estHours: '8 - 12 hrs',
    coreTools: ['SQL Queries', 'Pandas', 'PowerBI / Tableau concepts', 'Excel'],
    careerRoles: 'Business Intelligence Analyst, Analytics Associate',
  },
  {
    slug: 'cloud',
    name: 'Cloud Computing',
    category: 'cloud_systems',
    difficulty: 'Intermediate',
    estHours: '10 - 14 hrs',
    coreTools: ['Docker', 'AWS / Vercel', 'Microservices', 'GitHub Actions'],
    careerRoles: 'Cloud Engineer, DevOps Associate, Site Reliability Engineer',
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'cloud_systems',
    difficulty: 'Advanced',
    estHours: '14 - 18 hrs',
    coreTools: ['OWASP ZAP', 'Nmap', 'Cryptography', 'Linux', 'Network Protocols'],
    careerRoles: 'Security Analyst, Ethical Hacker, Pen-Tester Associate',
  },
  {
    slug: 'android',
    name: 'Android Development',
    category: 'web_apps',
    difficulty: 'Intermediate',
    estHours: '12 - 15 hrs',
    coreTools: ['Kotlin / Flutter', 'Jetpack Compose', 'Room Database', 'Material 3'],
    careerRoles: 'Mobile App Developer, Android Engineer, Flutter Developer',
  },
  {
    slug: 'ui-ux',
    name: 'UI/UX Design',
    category: 'web_apps',
    difficulty: 'Beginner',
    estHours: '8 - 12 hrs',
    coreTools: ['Figma', 'Wireframing', 'Design Systems', 'Usability Testing'],
    careerRoles: 'Product Designer, UX Researcher, UI Specialist',
  },
  {
    slug: 'database',
    name: 'Database Management',
    category: 'programming',
    difficulty: 'Intermediate',
    estHours: '10 - 14 hrs',
    coreTools: ['PostgreSQL', 'SQLite', 'Database Normalization', 'Indexing'],
    careerRoles: 'Database Administrator, Backend SQL Developer',
  },
  {
    slug: 'iot',
    name: 'Internet of Things (IoT)',
    category: 'cloud_systems',
    difficulty: 'Intermediate',
    estHours: '12 - 15 hrs',
    coreTools: ['MQTT Protocol', 'MicroPython / C++', 'Sensors', 'ESP32 Sim'],
    careerRoles: 'IoT Solutions Architect, Embedded Systems Associate',
  },
  {
    slug: 'java',
    name: 'Java Development',
    category: 'programming',
    difficulty: 'Intermediate',
    estHours: '12 - 16 hrs',
    coreTools: ['Java 21', 'Spring Boot Basics', 'Maven', 'OOP Patterns', 'JUnit'],
    careerRoles: 'Java Developer, Enterprise Software Associate',
  },
];

export const DomainMatrixComparison: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredSpecs = DOMAIN_SPECS.filter((spec) => {
    const matchesCategory =
      selectedCategory === 'all' || spec.category === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      spec.name.toLowerCase().includes(search.toLowerCase()) ||
      spec.coreTools.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      spec.careerRoles.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Interactive Technical Matrix
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Compare All 13 Internship Tracks
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review workload, core technologies, and career opportunities across every domain.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'all', label: 'All Tracks' },
            { id: 'web_apps', label: 'Web & Mobile' },
            { id: 'data_ai', label: 'AI & Data' },
            { id: 'cloud_systems', label: 'Cloud & Security' },
            { id: 'programming', label: 'Core Languages' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="p-4">Domain Track</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4">Estimated Sprint Hours</th>
              <th className="p-4">Core Tooling</th>
              <th className="p-4">Target Career Roles</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSpecs.map((spec) => (
              <tr
                key={spec.slug}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="p-4">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {spec.name}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">5 Milestones</span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      spec.difficulty === 'Beginner'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : spec.difficulty === 'Intermediate'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                        : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                    }`}
                  >
                    {spec.difficulty}
                  </span>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                  {spec.estHours}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {spec.coreTools.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-xs">
                  {spec.careerRoles}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/register`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                  >
                    <span>Enroll</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
