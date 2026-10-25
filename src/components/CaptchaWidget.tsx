'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, RotateCw, CheckCircle2 } from 'lucide-react';

interface CaptchaWidgetProps {
  onChallengeChange: (token: string, answer: string) => void;
  disabled?: boolean;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({
  onChallengeChange,
  disabled = false,
}) => {
  const [question, setQuestion] = useState<string>('Loading security challenge...');
  const [token, setToken] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChallenge = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/captcha', { cache: 'no-store' });
      const data = await res.json();
      setQuestion(data.question);
      setToken(data.token);
      setAnswer('');
      onChallengeChange(data.token, '');
    } catch {
      setQuestion('Challenge error. Click refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAnswer(val);
    onChallengeChange(token, val);
  };

  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Security &amp; Bot Verification</span>
        </div>
        <button
          type="button"
          onClick={fetchChallenge}
          disabled={loading || disabled}
          aria-label="Refresh security question"
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      <div className="text-xs text-slate-800 font-mono bg-white px-3 py-2 rounded-lg border border-slate-200 select-none">
        {question}
      </div>

      <div>
        <label htmlFor="captcha-answer-input" className="sr-only">
          Enter CAPTCHA Answer
        </label>
        <div className="relative">
          <input
            id="captcha-answer-input"
            type="text"
            required
            disabled={loading || disabled}
            value={answer}
            onChange={handleInputChange}
            placeholder="Type answer here..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
          />
          {answer.length > 0 && (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 absolute right-2.5 top-2.5" />
          )}
        </div>
      </div>
    </div>
  );
};
