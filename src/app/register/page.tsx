'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, Mail, User, Phone, School, BookOpen, ArrowRight, AlertCircle, ShieldCheck, Flame, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    college: '',
    degree: '',
    graduation_year: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservedSeconds, setReservedSeconds] = useState(882); // 14m 42s

  React.useEffect(() => {
    const timer = setInterval(() => {
      setReservedSeconds((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const targetDomain = urlParams?.get('domain');

      if (targetDomain) {
        try {
          const enrollRes = await fetch('/api/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain_id: targetDomain }),
          });
          if (enrollRes.ok) {
            router.push('/dashboard');
            router.refresh();
            return;
          }
        } catch {
          // Fall through to /domains
        }
      }

      router.push('/domains');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-xs mb-1">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create Student Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Register for INTERN-UP and start your 7-calendar-day task internship
          </p>
        </div>

        {/* Limited Batch Scarcity & Reservation Countdown Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-2xs">
              <Flame className="w-3 h-3 fill-slate-950" />
              <span>Limited Batch: 8 Slots Remaining</span>
            </span>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Held: {formatTimer(reservedSeconds)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your sprint seat is held temporarily. Complete registration below to lock your spot before mentor batch review capacity is capped at 50 students.
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full w-[84%] rounded-full" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            <span>42/50 Enrolled in this batch</span>
            <span className="text-amber-700 dark:text-amber-400 font-bold">84% Capacity</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              This exact name will appear on your Enrollment Letter and Completion Certificate.
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Create Password (min. 8 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Phone (optional) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
            >
              Phone / WhatsApp (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="college"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
              >
                College / Institution
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="college"
                  name="college"
                  type="text"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. IIT Madras"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="degree"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
              >
                Course / Degree
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="degree"
                  name="degree"
                  type="text"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech CSE"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-4"
          >
            Create Account & Continue
          </Button>

          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Instant Letter PDF</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Limited Batch Size</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>7-Day Structured Sprint</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>No Upfront Payment</span>
            </div>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
