import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';
import { calculateCertificateEligibility } from '@/lib/eligibility';

describe('End-to-End Verification and Payment Flow', () => {
  it('handles full lifecycle: task submission -> payment (transaction ID) verification -> certificate', async () => {
    // 1. Create a test student and enrollment
    const uniqueId = `usr_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const student = await db.createProfile({
      id: uniqueId,
      email: `${uniqueId}@example.com`,
      full_name: 'Verification Test Student',
      phone: '+91 9999988888',
      role: 'student',
      email_verified: true,
    });
    expect(student.email).toBe(`${uniqueId}@example.com`);

    const domain = (await db.getAllDomains())[0];
    const enrollment = await db.createEnrollment(student.id, domain.id);
    expect(enrollment.id).toBeDefined();

    // 2. Submit all 5 tasks
    const tasks = await db.getTasksByDomainId(domain.id);
    for (const t of tasks) {
      await db.submitTask(
        enrollment.id,
        t.id,
        student.id,
        `https://github.com/student/task-${t.display_order}`
      );
    }
    const taskSubs = await db.getTaskSubmissionsByEnrollmentId(enrollment.id);
    expect(taskSubs.length).toBe(5);

    // 3. Student submits ₹100 direct UPI payment
    const payment = await db.submitPayment(
      enrollment.id,
      student.id,
      'UTR987654321098',
      '2026-10-20'
    );
    expect(payment.status).toBe('pending_verification');
    expect(payment.upi_reference).toBe('UTR987654321098');

    // 4. Admin checks pending payments
    const payments = await db.getAllPayments();
    const adminFoundPayment = payments.find((p) => p.id === payment.id);
    expect(adminFoundPayment).toBeDefined();
    expect(adminFoundPayment?.status).toBe('pending_verification');

    // 5. Admin approves payment
    const approvedPayment = await db.reviewPayment(
      payment.id,
      'approved',
      'usr_owner_target_1'
    );
    expect(approvedPayment?.status).toBe('approved');

    // Verify student sees approved payment
    const studentSeenPayment = await db.getPaymentByEnrollmentId(enrollment.id);
    expect(studentSeenPayment?.status).toBe('approved');

    // 6. Eligibility calculation
    const eligibility = calculateCertificateEligibility({
      enrollment,
      taskSubmissions: taskSubs,
      payment: studentSeenPayment,
    });
    expect(eligibility.isEligible).toBe(true);
    expect(eligibility.checklist.hasActiveEnrollment).toBe(true);
    expect(eligibility.checklist.allTasksSubmitted).toBe(true);
    expect(eligibility.checklist.paymentApproved).toBe(true);

    // 7. Generate / issue certificate
    const { certificate: cert } = await db.issueCertificate(enrollment.id, student.id);
    expect(cert.certificate_id).toMatch(/^INUP-2026-/);
    expect(cert.status).toBe('issued');

    const retrievedCert = await db.getCertificateById(cert.certificate_id);
    expect(retrievedCert).toBeDefined();
    expect(retrievedCert?.student_name).toBe(student.full_name);
  });

  it('self-heals and accepts task submission even if container restarted and enrollment was missing from memory', async () => {
    const studentId = `usr_cold_${Date.now()}`;
    await db.createProfile({
      id: studentId,
      email: `${studentId}@example.com`,
      full_name: 'Cold Start Student',
      role: 'student',
      email_verified: true,
    });

    // Student submits task without a pre-existing enrollment in state.enrollments
    const submission = await db.submitTask(
      'enr_missing_from_memory',
      'task_web-development_1',
      studentId,
      'https://github.com/student/self-heal-task-1'
    );

    expect(submission).toBeDefined();
    expect(submission.github_url).toBe('https://github.com/student/self-heal-task-1');
    expect(submission.enrollment_id).toBeDefined();

    // Verify enrollment was self-healed and recorded
    const enrollment = await db.getEnrollmentById(submission.enrollment_id);
    expect(enrollment).toBeDefined();
    expect(enrollment?.student_id).toBe(studentId);
    expect(enrollment?.status).toBe('active');
  });
});
