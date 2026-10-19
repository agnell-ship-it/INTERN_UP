import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { COMPANY_INFO } from '@/lib/constants';

describe('Initial Administrator Setup & Security Tests', () => {
  beforeEach(() => {
    db._resetDatabaseForTesting();
  });

  it('bootstrap rejects any email that does not match agnelvishwak02@gmail.com', async () => {
    const result = await db.bootstrapAdmin('arbitrary_hacker@gmail.com', 'usr_test_attacker');
    expect(result.success).toBe(false);
    expect(result.message).toContain('does not match the designated initial administrator');
  });

  it('normal user registration creates account with role student and cannot elevate itself', async () => {
    const student = await db.createProfile({
      id: 'usr_student_test_1',
      email: 'teststudent@example.com',
      full_name: 'Regular Student',
      role: 'student',
      email_verified: true,
    });

    expect(student.role).toBe('student');

    // Attempting to modify role via updateProfile must be ignored
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await db.updateProfile(student.id, { role: 'admin' as any });
    expect(updated?.role).toBe('student');
  });

  it('bootstrap promotes the registered designated administrator account', async () => {
    // 1. First register the designated account
    const adminEmail = COMPANY_INFO.initialAdminEmail;
    await db.createProfile({
      id: 'usr_owner_target_1',
      email: adminEmail,
      full_name: 'Agnel Vishwak',
      role: 'student',
      email_verified: true,
    });

    // 2. Execute bootstrap
    const result = await db.bootstrapAdmin(adminEmail.toUpperCase(), 'usr_owner_target_1');
    expect(result.success).toBe(true);
    expect(result.message).toContain('has been promoted to Administrator');

    // 3. Verify role changed to admin
    const profile = await db.getProfileByEmail(adminEmail);
    expect(profile?.role).toBe('admin');

    // 4. Verify bootstrap procedure is permanently closed
    const repeatResult = await db.bootstrapAdmin(adminEmail, 'usr_owner_target_1');
    expect(repeatResult.success).toBe(false);
    expect(repeatResult.message).toContain('already been permanently completed');
  });
});
