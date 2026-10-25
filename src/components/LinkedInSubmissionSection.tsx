'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LinkedInSubmission } from '@/types';
import {
  Share2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Send,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LinkedInSubmissionSectionProps {
  enrollmentId: string;
  submission: LinkedInSubmission | null;
}

export const LinkedInSubmissionSection: React.FC<LinkedInSubmissionSectionProps> = ({
  enrollmentId,
  submission,
}) => {
  const router = useRouter();
  const [postUrl, setPostUrl] = useState(submission?.post_url || '');
  const [notes, setNotes] = useState(submission?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(!submission || submission.status === 'rejected');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!postUrl.trim()) {
      setError('LinkedIn post URL is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/linkedin/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollment_id: enrollmentId,
          post_url: postUrl.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit LinkedIn announcement.');

      setSuccess(true);
      setEditing(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const status = submission?.status || 'not_submitted';

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              LinkedIn Internship Announcement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Publish your offer letter or announcement on LinkedIn and submit your public URL
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {status === 'approved' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Approved</span>
            </span>
          )}
          {status === 'pending_review' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Pending Review</span>
            </span>
          )}
          {status === 'rejected' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>Rejected (Resubmission Allowed)</span>
            </span>
          )}
          {status === 'not_submitted' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span>Not Submitted</span>
            </span>
          )}
        </div>
      </div>

      {/* Rejection feedback notice if rejected */}
      {status === 'rejected' && submission?.rejection_reason && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs space-y-1">
          <span className="font-bold">Administrator Rejection Feedback:</span>
          <p className="leading-relaxed">{submission.rejection_reason}</p>
        </div>
      )}

      {/* Submitted preview if not editing */}
      {!editing && submission && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1 truncate max-w-md">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Submitted Post URL:</span>
            <a
              href={submission.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 truncate"
            >
              <span className="truncate">{submission.post_url}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          {status !== 'approved' && (
            <Button
              onClick={() => setEditing(true)}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              Update Submission
            </Button>
          )}
        </div>
      )}

      {/* Submission Form */}
      {(editing || !submission) && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>LinkedIn announcement submitted for review.</span>
            </div>
          )}

          <div>
            <label
              htmlFor="postUrl"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
            >
              LinkedIn Post URL *
            </label>
            <input
              id="postUrl"
              type="url"
              required
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://www.linkedin.com/posts/username_announcement_activity..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Ensure your LinkedIn post privacy is set to Public so the administrator can verify it.
            </p>
          </div>

          <div>
            <label
              htmlFor="linkedinNotes"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
            >
              Optional Notes
            </label>
            <input
              id="linkedinNotes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes or comment..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              type="submit"
              size="sm"
              isLoading={loading}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              {submission ? 'Resubmit Announcement' : 'Submit Announcement'}
            </Button>
            {submission && editing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
