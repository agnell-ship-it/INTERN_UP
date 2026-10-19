import {
  CertificateEligibilityResult,
  Enrollment,
  LinkedInSubmission,
  Payment,
  TaskSubmission,
} from '@/types';

/**
 * Single source of truth for certificate eligibility evaluation.
 * Evaluates all 6 strict business conditions:
 * 1. Active or valid completed enrollment
 * 2. Approved LinkedIn announcement post
 * 3. All 5 required tasks submitted with valid GitHub links
 * 4. ₹100 direct UPI payment approved by administrator
 * 5. Program completion criteria fulfilled
 * 6. Enrollment not invalidated or revoked
 */
export function calculateCertificateEligibility(params: {
  enrollment: Enrollment | null;
  linkedInSubmission: LinkedInSubmission | null;
  taskSubmissions: TaskSubmission[];
  payment: Payment | null;
  isRevoked?: boolean;
}): CertificateEligibilityResult {
  const reasons: string[] = [];

  const { enrollment, linkedInSubmission, taskSubmissions, payment, isRevoked } = params;

  // 1. Enrollment check
  const hasActiveEnrollment =
    !!enrollment && (enrollment.status === 'active' || enrollment.status === 'completed');
  if (!hasActiveEnrollment) {
    reasons.push('An active or valid completed enrollment is required.');
  }

  // 2. LinkedIn check
  const linkedInApproved = !!linkedInSubmission && linkedInSubmission.status === 'approved';
  if (!linkedInApproved) {
    if (!linkedInSubmission || linkedInSubmission.status === 'not_submitted') {
      reasons.push('LinkedIn internship announcement post has not been submitted.');
    } else if (linkedInSubmission.status === 'pending_review') {
      reasons.push('LinkedIn announcement is pending administrator review.');
    } else if (linkedInSubmission.status === 'rejected') {
      reasons.push(
        `LinkedIn announcement was rejected: ${linkedInSubmission.rejection_reason || 'Please resubmit with a valid post URL.'}`
      );
    }
  }

  // 3. 5 Tasks check
  const validTaskCount = (taskSubmissions || []).filter(
    (t) => t.github_url && t.github_url.trim().length > 0
  ).length;
  const allTasksSubmitted = validTaskCount >= 5;
  if (!allTasksSubmitted) {
    reasons.push(`All 5 practical tasks must be submitted. (${validTaskCount}/5 submitted).`);
  }

  // 4. Payment check
  const paymentApproved = !!payment && payment.status === 'approved';
  if (!paymentApproved) {
    if (!payment || payment.status === 'not_started') {
      reasons.push('The ₹100 program fee payment has not been submitted.');
    } else if (payment.status === 'pending_verification') {
      reasons.push('Payment of ₹100 is pending manual administrator verification.');
    } else if (payment.status === 'rejected') {
      reasons.push(
        `Payment was rejected: ${payment.rejection_reason || 'Please verify UTR reference and resubmit.'}`
      );
    }
  }

  // 5. Not revoked check
  const notRevoked = !isRevoked;
  if (isRevoked) {
    reasons.push('Certificate eligibility has been revoked or invalidated by an administrator.');
  }

  const isEligible =
    hasActiveEnrollment &&
    linkedInApproved &&
    allTasksSubmitted &&
    paymentApproved &&
    notRevoked;

  return {
    isEligible,
    reasons,
    checklist: {
      hasActiveEnrollment,
      linkedInApproved,
      allTasksSubmitted,
      submittedTasksCount: validTaskCount,
      paymentApproved,
      notRevoked,
    },
  };
}
