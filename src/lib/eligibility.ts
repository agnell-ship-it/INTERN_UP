import {
  CertificateEligibilityResult,
  Enrollment,
  Payment,
  TaskSubmission,
} from '@/types';

/**
 * Single source of truth for certificate eligibility evaluation.
 * Evaluates the strict business conditions:
 * 1. Active or valid completed enrollment
 * 2. All 5 required tasks submitted with valid GitHub links
 * 3. ₹100 direct UPI payment (transaction ID) approved by the administrator
 * 4. Enrollment not invalidated or revoked
 */
export function calculateCertificateEligibility(params: {
  enrollment: Enrollment | null;
  taskSubmissions: TaskSubmission[];
  payment: Payment | null;
  isRevoked?: boolean;
}): CertificateEligibilityResult {
  const reasons: string[] = [];

  const { enrollment, taskSubmissions, payment, isRevoked } = params;

  // 1. Enrollment check
  const hasActiveEnrollment =
    !!enrollment && (enrollment.status === 'active' || enrollment.status === 'completed');
  if (!hasActiveEnrollment) {
    reasons.push('An active or valid completed enrollment is required.');
  }

  // 2. 5 Tasks check
  const validTaskCount = (taskSubmissions || []).filter(
    (t) => t.github_url && t.github_url.trim().length > 0
  ).length;
  const allTasksSubmitted = validTaskCount >= 5;
  if (!allTasksSubmitted) {
    reasons.push(`All 5 practical tasks must be submitted. (${validTaskCount}/5 submitted).`);
  }

  // 3. Payment check
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

  // 4. Not revoked check
  const notRevoked = !isRevoked;
  if (isRevoked) {
    reasons.push('Certificate eligibility has been revoked or invalidated by an administrator.');
  }

  const isEligible =
    hasActiveEnrollment &&
    allTasksSubmitted &&
    paymentApproved &&
    notRevoked;

  return {
    isEligible,
    reasons,
    checklist: {
      hasActiveEnrollment,
      allTasksSubmitted,
      submittedTasksCount: validTaskCount,
      paymentApproved,
      notRevoked,
    },
  };
}
