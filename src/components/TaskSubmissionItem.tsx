'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, TaskSubmission } from '@/types';
import {
  CheckCircle2,
  GitBranch,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Save,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatISTDate } from '@/lib/date-utils';

interface TaskSubmissionItemProps {
  task: Task;
  submission?: TaskSubmission;
  enrollmentId: string;
}

interface RepoCheckStatus {
  checked: boolean;
  valid?: boolean;
  repoName?: string;
  isPublic?: boolean;
  hasRecentCommits?: boolean;
  commitCount?: number;
  message?: string;
}

export const TaskSubmissionItem: React.FC<TaskSubmissionItemProps> = ({
  task,
  submission,
  enrollmentId,
}) => {
  const router = useRouter();
  const isSubmitted = !!submission && submission.github_url.trim().length > 0;

  const [expanded, setExpanded] = useState(!isSubmitted || task.display_order === 1);
  const [githubUrl, setGithubUrl] = useState(submission?.github_url || '');
  const [notes, setNotes] = useState(submission?.notes || '');
  const [loading, setLoading] = useState(false);
  const [checkingRepo, setCheckingRepo] = useState(false);
  const [repoStatus, setRepoStatus] = useState<RepoCheckStatus | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerifyRepo = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub repository URL first.');
      return;
    }

    setCheckingRepo(true);
    setRepoStatus(null);
    setError('');

    try {
      const res = await fetch(`/api/tasks/check-github?url=${encodeURIComponent(githubUrl.trim())}`);
      const data = await res.json();
      setRepoStatus({
        checked: true,
        valid: data.valid,
        repoName: data.repoName,
        isPublic: data.isPublic,
        hasRecentCommits: data.hasRecentCommits,
        commitCount: data.commitCount,
        message: data.message,
      });
    } catch {
      setRepoStatus({
        checked: true,
        valid: false,
        message: 'Could not connect to GitHub check service.',
      });
    } finally {
      setCheckingRepo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!githubUrl.trim()) {
      setError('GitHub repository URL is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment_id: enrollmentId,
          task_id: task.id,
          github_url: githubUrl.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit task link.');

      setSuccess(true);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isSubmitted
          ? 'bg-white border-emerald-200/90 shadow-2xs'
          : 'bg-white border-slate-200/90 shadow-2xs'
      }`}
    >
      {/* Header bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 rounded-2xl transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
              isSubmitted
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            {task.display_order}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span>Milestone {task.display_order} of 5</span>
              <span>&bull;</span>
              {isSubmitted ? (
                submission?.review_status === 'approved' ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved by Mentor</span>
                  </span>
                ) : submission?.review_status === 'changes_requested' ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Changes Requested</span>
                  </span>
                ) : (
                  <span className="text-blue-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Submitted &bull; Under Review</span>
                  </span>
                )
              ) : (
                <span className="text-amber-600 font-medium">Pending Submission</span>
              )}
            </div>
          </div>
        </div>

        <button
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          aria-label={expanded ? 'Collapse task' : 'Expand task'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded details & submission form */}
      {expanded && (
        <div className="px-4 pb-5 sm:px-5 sm:pb-6 border-t border-slate-100 pt-4 space-y-4 text-xs">
          {/* Instructions */}
          <div className="space-y-1">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Task Instructions
            </span>
            <p className="text-slate-600 leading-relaxed text-xs">{task.instructions}</p>
          </div>

          {/* Objective & Expected deliverable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-semibold text-slate-700 text-[11px]">
                Learning Objective
              </span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {task.learning_objective}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-semibold text-slate-700 text-[11px]">
                Expected Deliverable
              </span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {task.expected_deliverable}
              </p>
            </div>
          </div>

          {task.suggested_tools && (
            <div className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Suggested Tools: </span>
              <span>{task.suggested_tools}</span>
            </div>
          )}

          {/* Mentor Feedback Section if present */}
          {submission?.reviewer_feedback && (
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                submission.review_status === 'approved'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <MessageSquare className="w-4 h-4 text-slate-700" />
                  <span>Mentor Reviewer Evaluation</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    submission.review_status === 'approved'
                      ? 'bg-emerald-200/80 text-emerald-900'
                      : 'bg-amber-200/80 text-amber-900'
                  }`}
                >
                  {submission.review_status === 'approved' ? 'Approved' : 'Action Required'}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                {submission.reviewer_feedback}
              </p>
              {submission.reviewed_at && (
                <div className="text-[10px] text-slate-500 pt-1">
                  Reviewed on {formatISTDate(submission.reviewed_at)}
                </div>
              )}
            </div>
          )}

          {/* Submission Form */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>GitHub link successfully updated!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`github_url_${task.id}`}
                    className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700"
                  >
                    GitHub Repository / Project URL *
                  </label>
                  <button
                    type="button"
                    onClick={handleVerifyRepo}
                    disabled={checkingRepo || !githubUrl.trim()}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {checkingRepo ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Checking GitHub...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-Check Repo</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <GitBranch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id={`github_url_${task.id}`}
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => {
                      setGithubUrl(e.target.value);
                      if (repoStatus) setRepoStatus(null);
                    }}
                    placeholder="https://github.com/username/repository-name"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Repo live check status banner */}
                {repoStatus && repoStatus.checked && (
                  <div className="mt-2">
                    {repoStatus.valid ? (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            Verified public repository:{' '}
                            <strong className="font-mono">{repoStatus.repoName}</strong>
                          </span>
                        </div>
                        {repoStatus.commitCount !== undefined && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {repoStatus.commitCount} commits detected
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{repoStatus.message || 'Repository could not be verified on GitHub.'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor={`notes_${task.id}`}
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Optional Notes / Live Demo URL
                </label>
                <input
                  id={`notes_${task.id}`}
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Hosted live at Vercel / GitHub Pages..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {isSubmitted && submission?.github_url ? (
                  <a
                    href={submission.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    <span>Open Current Repo Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <div />
                )}

                <Button
                  type="submit"
                  size="sm"
                  isLoading={loading}
                  variant={isSubmitted ? 'outline' : 'primary'}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  {isSubmitted ? 'Update GitHub Link' : 'Submit Task Link'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
