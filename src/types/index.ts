export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  college?: string;
  degree?: string;
  graduation_year?: string;
  role: UserRole;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  domain_id: string;
  title: string;
  instructions: string;
  learning_objective: string;
  expected_deliverable: string;
  suggested_tools: string;
  reference_links?: string[];
  display_order: number; // 1 to 5
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EnrollmentStatus = 'active' | 'completed' | 'expired';

export interface Enrollment {
  id: string;
  student_id: string;
  domain_id: string;
  domain?: Domain;
  student?: Profile;
  enrolled_at: string;
  start_date: string;
  deadline: string;
  status: EnrollmentStatus;
  tasks_completed_count: number;
  created_at: string;
  updated_at: string;
}

export interface TaskSubmission {
  id: string;
  enrollment_id: string;
  task_id: string;
  student_id: string;
  github_url: string;
  notes?: string;
  submitted_at: string;
  updated_at: string;
  task?: Task;
}

export type ReviewStatus = 'not_submitted' | 'pending_review' | 'approved' | 'rejected';

export interface LinkedInSubmission {
  id: string;
  enrollment_id: string;
  student_id: string;
  post_url: string;
  notes?: string;
  status: ReviewStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'not_started' | 'pending_verification' | 'approved' | 'rejected';

export interface Payment {
  id: string;
  enrollment_id: string;
  student_id: string;
  amount: number; // ₹100
  upi_reference: string; // UTR or Ref Number
  payment_date: string;
  screenshot_url?: string;
  status: PaymentStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OfferLetterRecord {
  id: string;
  enrollment_id: string;
  student_id: string;
  document_id: string;
  generated_at: string;
}

export type CertificateStatus = 'issued' | 'revoked';

export interface Certificate {
  id: string;
  certificate_id: string; // e.g. INUP-2026-XXXX-XXXX
  enrollment_id: string;
  student_id: string;
  student_name: string;
  domain_name: string;
  start_date: string;
  end_date: string;
  issue_date: string;
  status: CertificateStatus;
  revocation_reason?: string;
  revoked_at?: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  upi_id: string;
  upi_qr_image_url: string;
  payment_instructions: string;
  support_email: string;
  founder_name: string;
  founder_title: string;
  program_fee: number; // 100
  is_bootstrap_completed: boolean;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  actor_id: string;
  actor_email?: string;
  action: string;
  target_table: string;
  target_id: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface CertificateEligibilityResult {
  isEligible: boolean;
  reasons: string[];
  checklist: {
    hasActiveEnrollment: boolean;
    linkedInApproved: boolean;
    allTasksSubmitted: boolean;
    submittedTasksCount: number;
    paymentApproved: boolean;
    notRevoked: boolean;
  };
}
