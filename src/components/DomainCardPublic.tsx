'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  CheckCircle2,
  ListTodo,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { Domain, Task } from '@/types';
import { DomainEnrollButton } from './DomainEnrollButton';
import { getTaskDifficultyAndHours } from '@/lib/constants';

interface DomainCardPublicProps {
  domain: Domain;
  tasks: Task[];
  icon: React.ReactNode;
  isAuthenticated: boolean;
  hasActiveEnrollment: boolean;
  isEnrolledInThisDomain: boolean;
}

export const DomainCardPublic: React.FC<DomainCardPublicProps> = ({
  domain,
  tasks,
  icon,
  isAuthenticated,
  hasActiveEnrollment,
  isEnrolledInThisDomain,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Sort tasks by display order
  const sortedTasks = [...tasks].sort((a, b) => a.display_order - b.display_order);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
            {icon || <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-transparent dark:border-slate-700/60">
            <ListTodo className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>5 Tasks (Sprint Track)</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{domain.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
            {domain.description}
          </p>
        </div>

        {/* Expandable 5-task public preview */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <span>{expanded ? 'Hide Milestone Tasks' : 'Preview 5 Public Tasks & Difficulty'}</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
          </button>

          {expanded && (
            <div className="mt-3 space-y-2.5 text-xs animate-in fade-in duration-200">
              {sortedTasks.map((task) => {
                const meta = getTaskDifficultyAndHours(task.display_order);
                const difficulty = task.difficulty || meta.difficulty;
                const hours = task.estimated_hours ? `${task.estimated_hours} hrs` : meta.estimatedHours;

                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {task.display_order}. {task.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded-md border font-semibold ${getDifficultyBadge(
                          difficulty
                        )}`}
                      >
                        {difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{hours}</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                      {task.learning_objective}
                    </p>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      <strong className="text-slate-700 dark:text-slate-300">Deliverable: </strong>
                      <span>{task.expected_deliverable}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0 mt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="pt-4">
          <DomainEnrollButton
            domainId={domain.id}
            domainName={domain.name}
            isAuthenticated={isAuthenticated}
            hasActiveEnrollment={hasActiveEnrollment}
            isEnrolledInThisDomain={isEnrolledInThisDomain}
          />
        </div>
      </div>
    </div>
  );
};
