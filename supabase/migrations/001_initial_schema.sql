-- ========================================================
-- INTERN-UP POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL & Row Level Security (RLS)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- References auth.users(id) in Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  college TEXT,
  degree TEXT,
  graduation_year TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  email_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. DOMAINS TABLE
CREATE TABLE IF NOT EXISTS public.domains (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL DEFAULT 'Code2',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. TASKS TABLE (5 per domain, 65 total)
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  domain_id TEXT NOT NULL REFERENCES public.domains(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL,
  learning_objective TEXT NOT NULL,
  expected_deliverable TEXT NOT NULL,
  suggested_tools TEXT NOT NULL,
  reference_links JSONB DEFAULT '[]'::jsonb,
  display_order INT NOT NULL CHECK (display_order BETWEEN 1 AND 5),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(domain_id, display_order)
);

-- 4. ENROLLMENTS TABLE (7-calendar-day duration)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id TEXT PRIMARY KEY DEFAULT ('enr_' || replace(gen_random_uuid()::text, '-', '')),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain_id TEXT NOT NULL REFERENCES public.domains(id) ON DELETE RESTRICT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  deadline TIMESTAMPTZ NOT NULL, -- Calculated as +7 calendar days
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  tasks_completed_count INT NOT NULL DEFAULT 0 CHECK (tasks_completed_count BETWEEN 0 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);

-- 5. TASK SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.task_submissions (
  id TEXT PRIMARY KEY DEFAULT ('ts_' || replace(gen_random_uuid()::text, '-', '')),
  enrollment_id TEXT NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL REFERENCES public.tasks(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  github_url TEXT NOT NULL,
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(enrollment_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_task_submissions_enrollment ON public.task_submissions(enrollment_id);

-- 6. LINKEDIN SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.linkedin_submissions (
  id TEXT PRIMARY KEY DEFAULT ('li_' || replace(gen_random_uuid()::text, '-', '')),
  enrollment_id TEXT UNIQUE NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_url TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('not_submitted', 'pending_review', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_linkedin_status ON public.linkedin_submissions(status);

-- 7. PAYMENTS TABLE (₹100 Direct UPI)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT ('pay_' || replace(gen_random_uuid()::text, '-', '')),
  enrollment_id TEXT UNIQUE NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
  upi_reference TEXT NOT NULL,
  payment_date DATE NOT NULL,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_verification' CHECK (status IN ('not_started', 'pending_verification', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 8. OFFER LETTERS TABLE
CREATE TABLE IF NOT EXISTS public.offer_letters (
  id TEXT PRIMARY KEY DEFAULT ('off_' || replace(gen_random_uuid()::text, '-', '')),
  enrollment_id TEXT UNIQUE NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_id TEXT UNIQUE NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY DEFAULT ('cert_' || replace(gen_random_uuid()::text, '-', '')),
  certificate_id TEXT UNIQUE NOT NULL, -- e.g. INUP-2026-XXXX-XXXX
  enrollment_id TEXT UNIQUE NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  domain_name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'revoked')),
  revocation_reason TEXT,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_certificates_cert_id ON public.certificates(certificate_id);

-- 10. SITE SETTINGS TABLE (Configurable by admin)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  upi_id TEXT NOT NULL DEFAULT '',
  upi_qr_image_url TEXT NOT NULL DEFAULT '',
  payment_instructions TEXT NOT NULL DEFAULT 'Pay ₹100 via direct UPI and submit your UTR reference.',
  support_email TEXT NOT NULL DEFAULT 'jonathwatsan@gmail.com',
  founder_name TEXT NOT NULL DEFAULT 'Dr. Jonath Watsan',
  founder_title TEXT NOT NULL DEFAULT 'Founder, INTERN-UP',
  program_fee NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
  is_bootstrap_completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id TEXT PRIMARY KEY DEFAULT ('log_' || replace(gen_random_uuid()::text, '-', '')),
  actor_id UUID NOT NULL REFERENCES public.profiles(id),
  actor_email TEXT,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON public.admin_audit_logs(created_at DESC);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own non-role profile fields"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'student');

-- Domains & Tasks Policies (Public read for active items, admin full access)
CREATE POLICY "Anyone can view active domains"
  ON public.domains FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can modify domains"
  ON public.domains FOR ALL
  USING (public.is_admin());

CREATE POLICY "Anyone can view active tasks"
  ON public.tasks FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can modify tasks"
  ON public.tasks FOR ALL
  USING (public.is_admin());

-- Enrollments Policies
CREATE POLICY "Students can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can create own enrollment"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can manage enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_admin());

-- Task Submissions Policies
CREATE POLICY "Students can view and manage own task submissions"
  ON public.task_submissions FOR ALL
  USING (auth.uid() = student_id OR public.is_admin())
  WITH CHECK (auth.uid() = student_id OR public.is_admin());

-- LinkedIn Submissions Policies
CREATE POLICY "Students can view and insert own linkedin submission"
  ON public.linkedin_submissions FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can submit own linkedin post"
  ON public.linkedin_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can resubmit own linkedin post if rejected"
  ON public.linkedin_submissions FOR UPDATE
  USING (auth.uid() = student_id AND status IN ('not_submitted', 'rejected'))
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can review linkedin submissions"
  ON public.linkedin_submissions FOR UPDATE
  USING (public.is_admin());

-- Payments Policies
CREATE POLICY "Students can view own payment"
  ON public.payments FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can submit own payment"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can resubmit own payment if rejected"
  ON public.payments FOR UPDATE
  USING (auth.uid() = student_id AND status = 'rejected')
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can review payments"
  ON public.payments FOR UPDATE
  USING (public.is_admin());

-- Offer Letters & Certificates Policies
CREATE POLICY "Students can view own offer letter"
  ON public.offer_letters FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can view own certificate or public can view non-revoked cert"
  ON public.certificates FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin() OR status = 'issued');

CREATE POLICY "Admins can manage certificates"
  ON public.certificates FOR ALL
  USING (public.is_admin());

-- Site Settings Policies
CREATE POLICY "Public read for site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  USING (public.is_admin());

-- Audit Logs Policies
CREATE POLICY "Admins can view and insert audit logs"
  ON public.admin_audit_logs FOR ALL
  USING (public.is_admin());
