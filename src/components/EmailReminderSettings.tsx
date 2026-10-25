'use client';

import React, { useState } from 'react';
import { Bell, Mail, CheckCircle2, Send, Clock } from 'lucide-react';
import { Button } from './ui/Button';

export const EmailReminderSettings: React.FC<{ studentEmail: string }> = ({
  studentEmail,
}) => {
  const [daily, setDaily] = useState(true);
  const [crunch, setCrunch] = useState(true);
  const [urgent, setUrgent] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSendTest = async () => {
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch('/api/student/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyReminder: daily,
          crunchReminder: crunch,
          urgentReminder: urgent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send test.');

      setStatus(data.message);
      setTimeout(() => setStatus(null), 4000);
    } catch (err: unknown) {
      setStatus(err instanceof Error ? err.message : 'Error sending reminder.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Sprint Email Reminders</h4>
            <p className="text-[11px] text-slate-500">
              Dispatched to <span className="font-mono text-slate-700">{studentEmail}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
          <input
            type="checkbox"
            checked={daily}
            onChange={(e) => setDaily(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Daily milestone progress digest</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
          <input
            type="checkbox"
            checked={crunch}
            onChange={(e) => setCrunch(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>48-hour deadline warning</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Final 24-hour urgent countdown notification</span>
        </label>
      </div>

      {status && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{status}</span>
        </div>
      )}

      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <span className="text-[10px] text-slate-400">Automated cron service: active</span>
        <button
          type="button"
          onClick={handleSendTest}
          disabled={sending}
          className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
        >
          <Send className="w-3 h-3" />
          <span>{sending ? 'Dispatching...' : 'Send Test Reminder'}</span>
        </button>
      </div>
    </div>
  );
};
