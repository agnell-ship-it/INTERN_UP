import { describe, it, expect } from 'vitest';
import { INITIAL_DOMAINS, COMPANY_INFO } from '@/lib/constants';
import { calculateProgramDates, getEnrollmentTimeStatus } from '@/lib/date-utils';
import { calculateCertificateEligibility } from '@/lib/eligibility';
import {
  isValidEmail,
  isValidPassword,
  isValidGitHubUrl,
  isValidLinkedInUrl,
  isValidUpiReference,
} from '@/lib/validation';
import { Enrollment, LinkedInSubmission, Payment, TaskSubmission } from '@/types';

describe('INTERN-UP Business Rules & Integrity Tests', () => {
  describe('Domains & Tasks Integrity', () => {
    it('must have exactly 13 initial domains', () => {
      expect(INITIAL_DOMAINS).toHaveLength(13);
    });

    it('each domain must have exactly 5 tasks (65 total tasks)', () => {
      let totalTasks = 0;
      INITIAL_DOMAINS.forEach((domain) => {
        expect(domain.tasks).toHaveLength(5);
        totalTasks += domain.tasks.length;

        // Verify task instructions are useful and not just empty strings
        domain.tasks.forEach((task, idx) => {
          expect(task.display_order).toBe(idx + 1);
          expect(task.title.length).toBeGreaterThan(5);
          expect(task.instructions.length).toBeGreaterThan(20);
          expect(task.learning_objective.length).toBeGreaterThan(10);
          expect(task.expected_deliverable.length).toBeGreaterThan(10);
        });
      });
      expect(totalTasks).toBe(65);
    });

    it('company info must have exact designated email and founder details', () => {
      expect(COMPANY_INFO.initialAdminEmail).toBe('agnelvishwak02@gmail.com');
      expect(COMPANY_INFO.supportEmail).toBe('jonathwatsan@gmail.com');
      expect(COMPANY_INFO.founderName).toBe('Dr. Jonath Watsan');
      expect(COMPANY_INFO.programDurationDays).toBe(7);
      expect(COMPANY_INFO.programFeeINR).toBe(100);
    });
  });

  describe('Program Duration & Deadline Calculations', () => {
    it('calculates exactly 7 calendar days from enrollment', () => {
      const fixedStart = '2026-10-19T10:00:00.000Z';
      const { startDateISO, deadlineDateISO } = calculateProgramDates(fixedStart);

      const start = new Date(startDateISO).getTime();
      const deadline = new Date(deadlineDateISO).getTime();
      const diffDays = (deadline - start) / (1000 * 60 * 60 * 24);

      expect(diffDays).toBe(7);
    });

    it('accurately identifies expired vs active enrollments', () => {
      const pastDeadline = new Date(Date.now() - 3600 * 1000).toISOString();
      const expiredStatus = getEnrollmentTimeStatus(pastDeadline);
      expect(expiredStatus.isExpired).toBe(true);
      expect(expiredStatus.displayStatus).toBe('Expired');

      const futureDeadline = new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString();
      const activeStatus = getEnrollmentTimeStatus(futureDeadline);
      expect(activeStatus.isExpired).toBe(false);
      expect(activeStatus.daysRemaining).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Certificate Eligibility Engine (Single Source of Truth)', () => {
    const mockEnrollment: Enrollment = {
      id: 'enr_1',
      student_id: 'usr_1',
      domain_id: 'dom_web-development',
      enrolled_at: new Date().toISOString(),
      start_date: new Date().toISOString(),
      deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'active',
      tasks_completed_count: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockLinkedInApproved: LinkedInSubmission = {
      id: 'li_1',
      enrollment_id: 'enr_1',
      student_id: 'usr_1',
      post_url: 'https://www.linkedin.com/posts/student_internship_activity',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mock5Tasks: TaskSubmission[] = [1, 2, 3, 4, 5].map((i) => ({
      id: `ts_${i}`,
      enrollment_id: 'enr_1',
      task_id: `task_${i}`,
      student_id: 'usr_1',
      github_url: `https://github.com/student/task-${i}`,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const mockPaymentApproved: Payment = {
      id: 'pay_1',
      enrollment_id: 'enr_1',
      student_id: 'usr_1',
      amount: 100,
      upi_reference: 'UTR1234567890',
      payment_date: '2026-10-19',
      status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('grants eligibility when all 5 tasks, approved linkedin, and approved payment are satisfied', () => {
      const result = calculateCertificateEligibility({
        enrollment: mockEnrollment,
        linkedInSubmission: mockLinkedInApproved,
        taskSubmissions: mock5Tasks,
        payment: mockPaymentApproved,
      });

      expect(result.isEligible).toBe(true);
      expect(result.reasons).toHaveLength(0);
      expect(result.checklist.allTasksSubmitted).toBe(true);
      expect(result.checklist.linkedInApproved).toBe(true);
      expect(result.checklist.paymentApproved).toBe(true);
    });

    it('denies eligibility if missing even one task (4/5 tasks submitted)', () => {
      const fourTasks = mock5Tasks.slice(0, 4);
      const result = calculateCertificateEligibility({
        enrollment: mockEnrollment,
        linkedInSubmission: mockLinkedInApproved,
        taskSubmissions: fourTasks,
        payment: mockPaymentApproved,
      });

      expect(result.isEligible).toBe(false);
      expect(result.checklist.allTasksSubmitted).toBe(false);
      expect(result.reasons.some((r) => r.includes('All 5 practical tasks must be submitted'))).toBe(true);
    });

    it('denies eligibility if LinkedIn submission is pending review or rejected', () => {
      const pendingLinkedIn: LinkedInSubmission = { ...mockLinkedInApproved, status: 'pending_review' };
      const result = calculateCertificateEligibility({
        enrollment: mockEnrollment,
        linkedInSubmission: pendingLinkedIn,
        taskSubmissions: mock5Tasks,
        payment: mockPaymentApproved,
      });

      expect(result.isEligible).toBe(false);
      expect(result.checklist.linkedInApproved).toBe(false);
      expect(result.reasons.some((r) => r.includes('LinkedIn'))).toBe(true);
    });

    it('denies eligibility if payment is pending verification or rejected', () => {
      const pendingPayment: Payment = { ...mockPaymentApproved, status: 'pending_verification' };
      const result = calculateCertificateEligibility({
        enrollment: mockEnrollment,
        linkedInSubmission: mockLinkedInApproved,
        taskSubmissions: mock5Tasks,
        payment: pendingPayment,
      });

      expect(result.isEligible).toBe(false);
      expect(result.checklist.paymentApproved).toBe(false);
      expect(result.reasons.some((r) => r.includes('Payment of ₹100 is pending manual administrator verification'))).toBe(true);
    });

    it('denies eligibility if certificate has been revoked', () => {
      const result = calculateCertificateEligibility({
        enrollment: mockEnrollment,
        linkedInSubmission: mockLinkedInApproved,
        taskSubmissions: mock5Tasks,
        payment: mockPaymentApproved,
        isRevoked: true,
      });

      expect(result.isEligible).toBe(false);
      expect(result.checklist.notRevoked).toBe(false);
      expect(result.reasons.some((r) => r.includes('revoked'))).toBe(true);
    });
  });

  describe('Input Validation Security', () => {
    it('validates email formats accurately', () => {
      expect(isValidEmail('student@example.com')).toBe(true);
      expect(isValidEmail('agnelvishwak02@gmail.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('enforces password minimum length of 8 characters', () => {
      expect(isValidPassword('short').isValid).toBe(false);
      expect(isValidPassword('securePass123!').isValid).toBe(true);
    });

    it('strictly accepts only valid HTTPS GitHub URLs with username and repo', () => {
      expect(isValidGitHubUrl('https://github.com/octocat/Hello-World').isValid).toBe(true);
      expect(isValidGitHubUrl('https://www.github.com/developer/portfolio').isValid).toBe(true);

      // Insecure HTTP rejected
      expect(isValidGitHubUrl('http://github.com/octocat/Hello-World').isValid).toBe(false);
      // Non-github domain rejected
      expect(isValidGitHubUrl('https://malicious-site.com/octocat/Hello-World').isValid).toBe(false);
      // Incomplete path rejected
      expect(isValidGitHubUrl('https://github.com/').isValid).toBe(false);
      expect(isValidGitHubUrl('https://github.com/username').isValid).toBe(false);
    });

    it('validates HTTPS LinkedIn post URLs', () => {
      expect(isValidLinkedInUrl('https://www.linkedin.com/posts/username_learning_activity-12345678').isValid).toBe(true);
      expect(isValidLinkedInUrl('https://linkedin.com/feed/update/urn:li:activity:12345678').isValid).toBe(true);

      // HTTP rejected
      expect(isValidLinkedInUrl('http://www.linkedin.com/posts/username_post').isValid).toBe(false);
      // Non-linkedin rejected
      expect(isValidLinkedInUrl('https://facebook.com/posts/123').isValid).toBe(false);
    });

    it('validates UPI reference / UTR format', () => {
      expect(isValidUpiReference('UTR123456789').isValid).toBe(true);
      expect(isValidUpiReference('234567890123').isValid).toBe(true);
      expect(isValidUpiReference('too').isValid).toBe(false); // too short
      expect(isValidUpiReference('invalid@ref#with$symbols').isValid).toBe(false);
    });
  });
});
