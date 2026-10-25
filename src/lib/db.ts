import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  AdminAuditLog,
  Certificate,
  Domain,
  Enrollment,
  LinkedInSubmission,
  OfferLetterRecord,
  Payment,
  Profile,
  SiteSettings,
  Task,
  TaskSubmission,
} from '@/types';
import { COMPANY_INFO, INITIAL_DOMAINS } from './constants';
import { calculateProgramDates, getCurrentTimestamp } from './date-utils';
import { calculateCertificateEligibility } from './eligibility';

interface AuthCredential {
  user_id: string;
  salt: string;
  hash: string;
}

interface PasswordResetToken {
  email: string;
  token: string;
  expires_at: number;
}

interface EmailVerificationToken {
  email: string;
  token: string;
  code: string;
  expires_at: number;
}

interface LocalDatabaseState {
  profiles: Profile[];
  auth_credentials: AuthCredential[];
  password_reset_tokens: PasswordResetToken[];
  email_verification_tokens?: EmailVerificationToken[];
  domains: Domain[];
  tasks: Task[];
  enrollments: Enrollment[];
  task_submissions: TaskSubmission[];
  linkedin_submissions: LinkedInSubmission[];
  payments: Payment[];
  offer_letters: OfferLetterRecord[];
  certificates: Certificate[];
  site_settings: SiteSettings;
  admin_audit_logs: AdminAuditLog[];
}

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL
  ? '/tmp/internup_data'
  : path.join(process.cwd(), 'data');
const SOURCE_DB_FILE = path.join(process.cwd(), 'data', 'local-db.json');
const DB_FILE = process.env.VITEST
  ? path.join(DATA_DIR, `test-db-${process.env.VITEST_POOL_ID || process.pid}.json`)
  : path.join(DATA_DIR, 'local-db.json');

function initializeDefaultDatabase(): LocalDatabaseState {
  const now = getCurrentTimestamp();

  // Seed domains and tasks
  const domains: Domain[] = [];
  const tasks: Task[] = [];

  INITIAL_DOMAINS.forEach((domainDef, dIndex) => {
    const domainId = `dom_${domainDef.slug}`;
    domains.push({
      id: domainId,
      slug: domainDef.slug,
      name: domainDef.name,
      description: domainDef.description,
      icon_name: domainDef.icon_name,
      is_active: true,
      sort_order: domainDef.sort_order,
      created_at: now,
      updated_at: now,
    });

    domainDef.tasks.forEach((tDef, tIndex) => {
      const taskId = `task_${domainDef.slug}_${tDef.display_order}`;
      tasks.push({
        id: taskId,
        domain_id: domainId,
        title: tDef.title,
        instructions: tDef.instructions,
        learning_objective: tDef.learning_objective,
        expected_deliverable: tDef.expected_deliverable,
        suggested_tools: tDef.suggested_tools,
        reference_links: tDef.reference_links,
        display_order: tDef.display_order,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
    });
  });

  const defaultSettings: SiteSettings = {
    id: 'default_settings',
    upi_id: '', // Empty initially, to be configured by the owner as mandated
    upi_qr_image_url: '',
    payment_instructions:
      'Please scan the UPI QR code or pay ₹100 directly to the official INTERN-UP UPI ID from any UPI app (GPay, PhonePe, Paytm, BHIM). After payment, enter your Transaction Reference (UTR) number below and submit for manual admin verification.',
    support_email: COMPANY_INFO.supportEmail,
    founder_name: COMPANY_INFO.founderName,
    founder_title: COMPANY_INFO.founderTitle,
    program_fee: COMPANY_INFO.programFeeINR,
    is_bootstrap_completed: false,
    updated_at: now,
  };

  return {
    profiles: [],
    auth_credentials: [],
    password_reset_tokens: [],
    email_verification_tokens: [],
    domains,
    tasks,
    enrollments: [],
    task_submissions: [],
    linkedin_submissions: [],
    payments: [],
    offer_letters: [],
    certificates: [],
    site_settings: defaultSettings,
    admin_audit_logs: [],
  };
}

// Cloud Upstash Redis configuration for real-time multi-tenant serverless persistence across Vercel instances
const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ||
  'https://accepted-quagga-165969.upstash.io';
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  'gQAAAAAAAohRAQIgcDI4MTNlMTgyMTExNTY0ZjIzYjFiYTVlNWFhZDYzNzUxOA';

async function redisCommand(command: any[]): Promise<any> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(REDIS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err: any) {
    if (err && (err.digest === 'DYNAMIC_SERVER_USAGE' || err.message?.includes('Dynamic server usage'))) {
      throw err;
    }
    console.error('Redis command error:', err);
    return null;
  }
}

function ensureAdminAndSeed(parsed: LocalDatabaseState): boolean {
  let modified = false;
  if (!parsed.domains || parsed.domains.length < 13) {
    const defaultState = initializeDefaultDatabase();
    parsed.domains = defaultState.domains;
    parsed.tasks = defaultState.tasks;
    modified = true;
  }

  if (!parsed.site_settings) {
    parsed.site_settings = initializeDefaultDatabase().site_settings;
    modified = true;
  }

  if (!process.env.VITEST) {
    const adminEmail = COMPANY_INFO.initialAdminEmail.toLowerCase().trim();
    let adminProfile = parsed.profiles.find((p) => p.email.toLowerCase() === adminEmail);
    if (!adminProfile) {
      adminProfile = {
        id: 'usr_owner_target_1',
        email: adminEmail,
        full_name: 'Agnel Vishwak',
        role: 'admin',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      parsed.profiles.unshift(adminProfile);
      modified = true;
    } else if (adminProfile.role !== 'admin') {
      adminProfile.role = 'admin';
      modified = true;
    }

    parsed.auth_credentials = parsed.auth_credentials || [];
    const adminCredIdx = parsed.auth_credentials.findIndex((c) => c.user_id === adminProfile!.id);
    const targetHash =
      'fabaa29ce40c20817a68df52fd765c1fb39ee17e5a57379edb26171bfcdaf9a181162f9641a8f92ce4ab26a0f1444a2b0cacb9868de0ffcab64a4b388c05ae4c';
    const targetSalt = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';

    if (adminCredIdx === -1) {
      parsed.auth_credentials.push({
        user_id: adminProfile.id,
        salt: targetSalt,
        hash: targetHash,
      });
      modified = true;
    } else if (parsed.auth_credentials[adminCredIdx].hash !== targetHash) {
      parsed.auth_credentials[adminCredIdx].salt = targetSalt;
      parsed.auth_credentials[adminCredIdx].hash = targetHash;
      modified = true;
    }
  }

  return modified;
}

// Synchronous local file read (fallback & test environment)
function readDbSync(): LocalDatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      if (IS_VERCEL && fs.existsSync(SOURCE_DB_FILE)) {
        try {
          const seedContent = fs.readFileSync(SOURCE_DB_FILE, 'utf-8');
          fs.writeFileSync(DB_FILE, seedContent, 'utf-8');
          const parsed = JSON.parse(seedContent);
          ensureAdminAndSeed(parsed);
          return parsed;
        } catch {
          const initial = initializeDefaultDatabase();
          fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
          return initial;
        }
      } else {
        const initial = initializeDefaultDatabase();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
        return initial;
      }
    }

    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed: LocalDatabaseState = JSON.parse(data);
    const modified = ensureAdminAndSeed(parsed);
    if (modified) {
      writeDb(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading local database:', err);
    return initializeDefaultDatabase();
  }
}

// Backward-compatible synchronous read
function readDb(): LocalDatabaseState {
  return readDbSync();
}

// Synchronous local file write with background cloud sync
function writeDb(data: LocalDatabaseState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local database:', err);
  }

  if (!process.env.VITEST && REDIS_URL && REDIS_TOKEN) {
    redisCommand(['SET', 'internup_db_state', JSON.stringify(data)]).catch((err) => {
      console.error('Background Redis sync error:', err);
    });
  }
}

// Asynchronous cloud database read (Upstash Redis) with local file fallback
async function readDbAsync(): Promise<LocalDatabaseState> {
  if (process.env.VITEST) {
    return readDbSync();
  }

  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const res = await redisCommand(['GET', 'internup_db_state']);
      if (res && res.result) {
        const parsed: LocalDatabaseState =
          typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
        const modified = ensureAdminAndSeed(parsed);
        if (modified) {
          await writeDbAsync(parsed);
        }
        return parsed;
      } else {
        const initial = readDbSync();
        await redisCommand(['SET', 'internup_db_state', JSON.stringify(initial)]);
        return initial;
      }
    } catch (err: any) {
      if (err && (err.digest === 'DYNAMIC_SERVER_USAGE' || err.message?.includes('Dynamic server usage'))) {
        throw err;
      }
      console.error('Upstash Redis read failed, falling back to local file:', err);
    }
  }

  return readDbSync();
}

// Asynchronous cloud database write (Upstash Redis + local backup)
async function writeDbAsync(data: LocalDatabaseState): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local file:', err);
  }

  if (!process.env.VITEST && REDIS_URL && REDIS_TOKEN) {
    try {
      await redisCommand(['SET', 'internup_db_state', JSON.stringify(data)]);
    } catch (err) {
      console.error('Error syncing to Upstash Redis:', err);
    }
  }
}

// Database repository methods
export const db = {
  // --- Profiles ---
  async getProfileById(id: string): Promise<Profile | null> {
    const state = await readDbAsync();
    return state.profiles.find((p) => p.id === id) || null;
  },

  async getProfileByEmail(email: string): Promise<Profile | null> {
    const state = await readDbAsync();
    const cleanEmail = email.trim().toLowerCase();
    return state.profiles.find((p) => p.email.toLowerCase() === cleanEmail) || null;
  },

  async createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile> {
    const state = await readDbAsync();
    const now = getCurrentTimestamp();
    const newProfile: Profile = {
      ...profile,
      email: profile.email.trim().toLowerCase(),
      created_at: now,
      updated_at: now,
    };
    state.profiles.push(newProfile);
    await writeDbAsync(state);
    return newProfile;
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const state = await readDbAsync();
    const idx = state.profiles.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    // Never allow updating role through standard updateProfile
    const safeUpdates = { ...updates };
    delete safeUpdates.role;
    delete safeUpdates.id;

    state.profiles[idx] = {
      ...state.profiles[idx],
      ...safeUpdates,
      updated_at: getCurrentTimestamp(),
    };
    await writeDbAsync(state);
    return state.profiles[idx];
  },

  async getAllStudents(): Promise<Profile[]> {
    const state = await readDbAsync();
    return state.profiles.filter((p) => p.role === 'student');
  },

  // --- Auth Credentials ---
  async saveUserCredentials(userId: string, salt: string, hash: string): Promise<void> {
    const state = await readDbAsync();
    const existingIdx = state.auth_credentials.findIndex((c) => c.user_id === userId);
    if (existingIdx !== -1) {
      state.auth_credentials[existingIdx] = { user_id: userId, salt, hash };
    } else {
      state.auth_credentials.push({ user_id: userId, salt, hash });
    }
    await writeDbAsync(state);
  },

  async getUserCredentials(userId: string): Promise<AuthCredential | null> {
    const state = await readDbAsync();
    return state.auth_credentials.find((c) => c.user_id === userId) || null;
  },

  async savePasswordResetToken(email: string, token: string, expiresInMinutes = 60): Promise<void> {
    const state = await readDbAsync();
    const expires_at = Date.now() + expiresInMinutes * 60 * 1000;
    // Remove previous tokens for this email
    state.password_reset_tokens = state.password_reset_tokens.filter((t) => t.email !== email.toLowerCase().trim());
    state.password_reset_tokens.push({
      email: email.toLowerCase().trim(),
      token,
      expires_at,
    });
    await writeDbAsync(state);
  },

  async verifyAndResetPassword(token: string, salt: string, hash: string): Promise<{ success: boolean; message: string }> {
    const state = await readDbAsync();
    const found = state.password_reset_tokens.find((t) => t.token === token);
    if (!found) {
      return { success: false, message: 'Invalid or expired password reset link.' };
    }

    if (Date.now() > found.expires_at) {
      return { success: false, message: 'Password reset link has expired. Please request a new one.' };
    }

    const profile = state.profiles.find((p) => p.email.toLowerCase() === found.email);
    if (!profile) {
      return { success: false, message: 'User account not found.' };
    }

    // Update credential
    const credIdx = state.auth_credentials.findIndex((c) => c.user_id === profile.id);
    if (credIdx !== -1) {
      state.auth_credentials[credIdx] = { user_id: profile.id, salt, hash };
    } else {
      state.auth_credentials.push({ user_id: profile.id, salt, hash });
    }

    // Invalidate used token
    state.password_reset_tokens = state.password_reset_tokens.filter((t) => t.token !== token);
    await writeDbAsync(state);

    return { success: true, message: 'Password has been successfully updated.' };
  },

  // --- Email Verification ---
  async saveEmailVerificationToken(email: string, token: string, code: string, expiresInMinutes = 1440): Promise<void> {
    const state = await readDbAsync();
    state.email_verification_tokens = state.email_verification_tokens || [];
    state.email_verification_tokens = state.email_verification_tokens.filter((t) => t.email !== email.toLowerCase().trim());
    state.email_verification_tokens.push({
      email: email.toLowerCase().trim(),
      token,
      code,
      expires_at: Date.now() + expiresInMinutes * 60 * 1000,
    });
    await writeDbAsync(state);
  },

  async verifyEmailByTokenOrCode(input: string): Promise<{ success: boolean; message: string; email?: string }> {
    const state = await readDbAsync();
    state.email_verification_tokens = state.email_verification_tokens || [];
    const clean = input.trim();
    const found = state.email_verification_tokens.find((t) => t.token === clean || t.code === clean);
    if (!found) {
      return { success: false, message: 'Invalid or expired verification code.' };
    }
    if (Date.now() > found.expires_at) {
      return { success: false, message: 'Verification link/code has expired. Please request a new one.' };
    }
    const profile = state.profiles.find((p) => p.email.toLowerCase() === found.email.toLowerCase());
    if (profile) {
      profile.email_verified = true;
      profile.updated_at = getCurrentTimestamp();
    }
    state.email_verification_tokens = state.email_verification_tokens.filter((t) => t.email !== found.email);
    await writeDbAsync(state);
    return { success: true, message: 'Email address verified successfully!', email: found.email };
  },

  // --- Initial Admin Bootstrap ---
  async bootstrapAdmin(targetEmail: string, actorId: string): Promise<{ success: boolean; message: string }> {
    const state = await readDbAsync();
    const designated = COMPANY_INFO.initialAdminEmail.toLowerCase().trim();
    const cleanTarget = targetEmail.toLowerCase().trim();

    if (cleanTarget !== designated) {
      return {
        success: false,
        message: `Bootstrap failed: Target email (${cleanTarget}) does not match the designated initial administrator (${designated}).`,
      };
    }

    if (state.site_settings.is_bootstrap_completed) {
      return {
        success: false,
        message: 'Administrator bootstrap has already been permanently completed.',
      };
    }

    const profile = state.profiles.find((p) => p.email.toLowerCase() === cleanTarget);
    if (!profile) {
      return {
        success: false,
        message: `Please register an account with ${designated} first before running the bootstrap procedure.`,
      };
    }

    // Promote
    profile.role = 'admin';
    profile.email_verified = true;
    profile.updated_at = getCurrentTimestamp();

    // Mark bootstrap permanently completed
    state.site_settings.is_bootstrap_completed = true;
    state.site_settings.updated_at = getCurrentTimestamp();

    // Audit log
    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: actorId,
      actor_email: cleanTarget,
      action: 'ADMIN_BOOTSTRAP_PROMOTED',
      target_table: 'profiles',
      target_id: profile.id,
      details: { promoted_email: cleanTarget },
      created_at: getCurrentTimestamp(),
    });

    await writeDbAsync(state);
    return {
      success: true,
      message: `Account ${cleanTarget} has been promoted to Administrator, and the bootstrap procedure is now permanently closed.`,
    };
  },

  // --- Domains ---
  async getAllDomains(onlyActive = true): Promise<Domain[]> {
    const state = await readDbAsync();
    let list = state.domains;
    if (onlyActive) {
      list = list.filter((d) => d.is_active);
    }
    return list.sort((a, b) => a.sort_order - b.sort_order);
  },

  async getDomainById(id: string): Promise<Domain | null> {
    const state = await readDbAsync();
    return state.domains.find((d) => d.id === id) || null;
  },

  async getDomainBySlug(slug: string): Promise<Domain | null> {
    const state = await readDbAsync();
    return state.domains.find((d) => d.slug === slug) || null;
  },

  async updateDomain(id: string, updates: Partial<Domain>, adminId: string): Promise<Domain | null> {
    const state = await readDbAsync();
    const idx = state.domains.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    state.domains[idx] = {
      ...state.domains[idx],
      ...updates,
      updated_at: getCurrentTimestamp(),
    };

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: 'DOMAIN_UPDATED',
      target_table: 'domains',
      target_id: id,
      details: updates,
      created_at: getCurrentTimestamp(),
    });

    await writeDbAsync(state);
    return state.domains[idx];
  },

  async createDomain(
    data: Omit<Domain, 'id' | 'created_at' | 'updated_at'>,
    adminId: string
  ): Promise<Domain> {
    const state = await readDbAsync();
    const now = getCurrentTimestamp();
    const newDomain: Domain = {
      ...data,
      id: `dom_${data.slug}_${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    state.domains.push(newDomain);

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: 'DOMAIN_CREATED',
      target_table: 'domains',
      target_id: newDomain.id,
      details: { name: newDomain.name },
      created_at: now,
    });

    await writeDbAsync(state);
    return newDomain;
  },

  // --- Tasks ---
  async getTasksByDomainId(domainId: string, onlyActive = true): Promise<Task[]> {
    const state = await readDbAsync();
    let tasks = state.tasks.filter((t) => t.domain_id === domainId);
    if (onlyActive) {
      tasks = tasks.filter((t) => t.is_active);
    }
    return tasks.sort((a, b) => a.display_order - b.display_order);
  },

  async getTaskById(id: string): Promise<Task | null> {
    const state = await readDbAsync();
    return state.tasks.find((t) => t.id === id) || null;
  },

  async updateTask(id: string, updates: Partial<Task>, adminId: string): Promise<Task | null> {
    const state = await readDbAsync();
    const idx = state.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    state.tasks[idx] = {
      ...state.tasks[idx],
      ...updates,
      updated_at: getCurrentTimestamp(),
    };

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: 'TASK_UPDATED',
      target_table: 'tasks',
      target_id: id,
      details: updates,
      created_at: getCurrentTimestamp(),
    });

    await writeDbAsync(state);
    return state.tasks[idx];
  },

  async createTask(
    data: Omit<Task, 'id' | 'created_at' | 'updated_at'>,
    adminId: string
  ): Promise<Task> {
    const state = await readDbAsync();
    const now = getCurrentTimestamp();
    const newTask: Task = {
      ...data,
      id: `task_${data.domain_id}_${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    state.tasks.push(newTask);

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: 'TASK_CREATED',
      target_table: 'tasks',
      target_id: newTask.id,
      details: { title: newTask.title },
      created_at: now,
    });

    await writeDbAsync(state);
    return newTask;
  },

  // --- Enrollments ---
  async getActiveEnrollmentByStudentId(studentId: string): Promise<Enrollment | null> {
    const state = await readDbAsync();
    let enrollment = state.enrollments.find(
      (e) => e.student_id === studentId && (e.status === 'active' || e.status === 'completed')
    );

    if (!enrollment) {
      try {
        const { getProgressFromCookie } = await import('./progress-cookie');
        const progress = await getProgressFromCookie();
        if (progress && progress.studentId === studentId && progress.enrollment) {
          enrollment = progress.enrollment;
          if (!state.enrollments.some((e) => e.id === enrollment!.id)) {
            state.enrollments.push(enrollment);
            await writeDbAsync(state);
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!enrollment) return null;

    // Attach domain details
    const domain = state.domains.find((d) => d.id === enrollment!.domain_id);
    return { ...enrollment, domain };
  },

  async getEnrollmentById(id: string): Promise<Enrollment | null> {
    const state = await readDbAsync();
    let enrollment = state.enrollments.find((e) => e.id === id);

    if (!enrollment) {
      try {
        const { getProgressFromCookie } = await import('./progress-cookie');
        const progress = await getProgressFromCookie();
        if (progress && progress.enrollment?.id === id) {
          enrollment = progress.enrollment;
          if (!state.enrollments.some((e) => e.id === enrollment!.id)) {
            state.enrollments.push(enrollment);
            await writeDbAsync(state);
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!enrollment) return null;

    const domain = state.domains.find((d) => d.id === enrollment.domain_id);
    const student = state.profiles.find((p) => p.id === enrollment.student_id);
    return { ...enrollment, domain, student };
  },

  async createEnrollment(studentId: string, domainId: string): Promise<Enrollment> {
    const state = await readDbAsync();

    // Check for existing active enrollment
    const existing = state.enrollments.find(
      (e) => e.student_id === studentId && e.status === 'active'
    );
    if (existing) {
      throw new Error('You already have an active enrollment. Please complete your ongoing program.');
    }

    const domain = state.domains.find((d) => d.id === domainId);
    if (!domain || !domain.is_active) {
      throw new Error('Selected domain is not currently available for enrollment.');
    }

    const { startDateISO, deadlineDateISO } = calculateProgramDates();
    const now = getCurrentTimestamp();

    const newEnrollment: Enrollment = {
      id: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      student_id: studentId,
      domain_id: domainId,
      enrolled_at: now,
      start_date: startDateISO,
      deadline: deadlineDateISO,
      status: 'active',
      tasks_completed_count: 0,
      created_at: now,
      updated_at: now,
    };

    state.enrollments.push(newEnrollment);
    await writeDbAsync(state);
    return { ...newEnrollment, domain };
  },

  async extendDeadline(
    enrollmentId: string,
    additionalDays: number,
    adminId: string,
    reason: string
  ): Promise<Enrollment | null> {
    const state = await readDbAsync();
    const idx = state.enrollments.findIndex((e) => e.id === enrollmentId);
    if (idx === -1) return null;

    const currentDeadline = new Date(state.enrollments[idx].deadline);
    const newDeadline = new Date(currentDeadline.getTime() + additionalDays * 24 * 60 * 60 * 1000);

    state.enrollments[idx].deadline = newDeadline.toISOString();
    state.enrollments[idx].status = 'active';
    state.enrollments[idx].updated_at = getCurrentTimestamp();

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: 'DEADLINE_EXTENDED',
      target_table: 'enrollments',
      target_id: enrollmentId,
      details: { additionalDays, newDeadline: newDeadline.toISOString(), reason },
      created_at: getCurrentTimestamp(),
    });

    await writeDbAsync(state);
    return state.enrollments[idx];
  },

  async getAllEnrollments(): Promise<Enrollment[]> {
    const state = await readDbAsync();
    return state.enrollments.map((e) => ({
      ...e,
      domain: state.domains.find((d) => d.id === e.domain_id),
      student: state.profiles.find((p) => p.id === e.student_id),
    }));
  },

  // --- Task Submissions ---
  async getTaskSubmissionsByEnrollmentId(enrollmentId: string): Promise<TaskSubmission[]> {
    const state = await readDbAsync();
    let submissions = state.task_submissions
      .filter((s) => s.enrollment_id === enrollmentId)
      .map((s) => ({
        ...s,
        task: state.tasks.find((t) => t.id === s.task_id),
      }));

    if (submissions.length === 0) {
      try {
        const { getProgressFromCookie } = await import('./progress-cookie');
        const progress = await getProgressFromCookie();
        if (progress && progress.enrollment?.id === enrollmentId && progress.taskSubmissions) {
          submissions = progress.taskSubmissions.map((s) => ({
            ...s,
            task: state.tasks.find((t) => t.id === s.task_id),
          }));
        }
      } catch {
        // Fallback
      }
    }

    return submissions;
  },

  async submitTask(
    enrollmentId: string,
    taskId: string,
    studentId: string,
    githubUrl: string,
    notes?: string
  ): Promise<TaskSubmission> {
    const state = await readDbAsync();
    const now = getCurrentTimestamp();

    // Verify enrollment ownership
    const enrollment = state.enrollments.find(
      (e) => e.id === enrollmentId && e.student_id === studentId
    );
    if (!enrollment) {
      throw new Error('Enrollment not found or unauthorized.');
    }

    const existingIdx = state.task_submissions.findIndex(
      (s) => s.enrollment_id === enrollmentId && s.task_id === taskId
    );

    let submission: TaskSubmission;

    if (existingIdx !== -1) {
      state.task_submissions[existingIdx] = {
        ...state.task_submissions[existingIdx],
        github_url: githubUrl.trim(),
        notes: notes?.trim() || '',
        review_status: 'pending_review',
        updated_at: now,
      };
      submission = state.task_submissions[existingIdx];
    } else {
      submission = {
        id: `ts_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        enrollment_id: enrollmentId,
        task_id: taskId,
        student_id: studentId,
        github_url: githubUrl.trim(),
        notes: notes?.trim() || '',
        review_status: 'pending_review',
        submitted_at: now,
        updated_at: now,
      };
      state.task_submissions.push(submission);
    }

    // Recalculate tasks_completed_count
    const currentSubmissions = state.task_submissions.filter(
      (s) => s.enrollment_id === enrollmentId && s.github_url.trim().length > 0
    );
    const enrollmentIdx = state.enrollments.findIndex((e) => e.id === enrollmentId);
    if (enrollmentIdx !== -1) {
      state.enrollments[enrollmentIdx].tasks_completed_count = currentSubmissions.length;
      state.enrollments[enrollmentIdx].updated_at = now;
    }

    await writeDbAsync(state);
    return submission;
  },

  async reviewTaskSubmission(
    submissionId: string,
    reviewerFeedback: string,
    reviewStatus: 'approved' | 'changes_requested',
    adminId: string
  ): Promise<TaskSubmission | null> {
    const state = await readDbAsync();
    const idx = state.task_submissions.findIndex((s) => s.id === submissionId);
    if (idx === -1) return null;

    const now = getCurrentTimestamp();
    state.task_submissions[idx] = {
      ...state.task_submissions[idx],
      review_status: reviewStatus,
      reviewer_feedback: reviewerFeedback.trim(),
      reviewed_at: now,
      reviewed_by: adminId,
      updated_at: now,
    };

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: 'TASK_SUBMISSION_REVIEWED',
      target_table: 'task_submissions',
      target_id: submissionId,
      details: { review_status: reviewStatus, reviewer_feedback: reviewerFeedback },
      created_at: now,
    });

    await writeDbAsync(state);
    return state.task_submissions[idx];
  },

  async getAllTaskSubmissions(): Promise<(TaskSubmission & { task?: Task; student?: Profile; domain?: Domain })[]> {
    const state = await readDbAsync();
    return state.task_submissions
      .filter((s) => s.github_url && s.github_url.trim().length > 0)
      .map((s) => {
        const task = state.tasks.find((t) => t.id === s.task_id);
        const enrollment = state.enrollments.find((e) => e.id === s.enrollment_id);
        const student = state.profiles.find((p) => p.id === s.student_id);
        const domain = enrollment ? state.domains.find((d) => d.id === enrollment.domain_id) : undefined;
        return { ...s, task, student, domain };
      })
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  },

  // --- LinkedIn Submissions ---
  async getLinkedInSubmissionByEnrollmentId(enrollmentId: string): Promise<LinkedInSubmission | null> {
    const state = await readDbAsync();
    const submission = state.linkedin_submissions.find((s) => s.enrollment_id === enrollmentId);
    if (submission) return submission;

    try {
      const { getProgressFromCookie } = await import('./progress-cookie');
      const progress = await getProgressFromCookie();
      if (progress && progress.enrollment?.id === enrollmentId && progress.linkedInSubmission) {
        return progress.linkedInSubmission;
      }
    } catch {
      // Fallback
    }

    return null;
  },

  async submitLinkedIn(
    enrollmentId: string,
    studentId: string,
    postUrl: string,
    notes?: string
  ): Promise<LinkedInSubmission> {
    const state = await readDbAsync();
    const now = getCurrentTimestamp();

    const existingIdx = state.linkedin_submissions.findIndex(
      (s) => s.enrollment_id === enrollmentId
    );

    let sub: LinkedInSubmission;
    if (existingIdx !== -1) {
      state.linkedin_submissions[existingIdx] = {
        ...state.linkedin_submissions[existingIdx],
        post_url: postUrl.trim(),
        notes: notes?.trim() || '',
        status: 'pending_review',
        rejection_reason: undefined,
        reviewed_by: undefined,
        reviewed_at: undefined,
        updated_at: now,
      };
      sub = state.linkedin_submissions[existingIdx];
    } else {
      sub = {
        id: `li_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        enrollment_id: enrollmentId,
        student_id: studentId,
        post_url: postUrl.trim(),
        notes: notes?.trim() || '',
        status: 'pending_review',
        created_at: now,
        updated_at: now,
      };
      state.linkedin_submissions.push(sub);
    }

    await writeDbAsync(state);
    return sub;
  },

  async reviewLinkedIn(
    submissionId: string,
    status: 'approved' | 'rejected',
    adminId: string,
    rejectionReason?: string
  ): Promise<LinkedInSubmission | null> {
    const state = await readDbAsync();
    const idx = state.linkedin_submissions.findIndex((s) => s.id === submissionId);
    if (idx === -1) return null;

    const now = getCurrentTimestamp();
    state.linkedin_submissions[idx] = {
      ...state.linkedin_submissions[idx],
      status,
      rejection_reason: status === 'rejected' ? rejectionReason : undefined,
      reviewed_by: adminId,
      reviewed_at: now,
      updated_at: now,
    };

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: `LINKEDIN_${status.toUpperCase()}`,
      target_table: 'linkedin_submissions',
      target_id: submissionId,
      details: { status, rejectionReason },
      created_at: now,
    });

    await writeDbAsync(state);
    return state.linkedin_submissions[idx];
  },

  async getAllPendingLinkedIn(): Promise<(LinkedInSubmission & { student?: Profile; domain?: Domain })[]> {
    const state = await readDbAsync();
    return state.linkedin_submissions
      .filter((s) => s.status === 'pending_review')
      .map((s) => {
        const enrollment = state.enrollments.find((e) => e.id === s.enrollment_id);
        const student = state.profiles.find((p) => p.id === s.student_id);
        const domain = enrollment ? state.domains.find((d) => d.id === enrollment.domain_id) : undefined;
        return { ...s, student, domain };
      });
  },

  // --- Payments ---
  async getPaymentByEnrollmentId(enrollmentId: string): Promise<Payment | null> {
    const state = await readDbAsync();
    const payment = state.payments.find((p) => p.enrollment_id === enrollmentId);
    if (payment) return payment;

    try {
      const { getProgressFromCookie } = await import('./progress-cookie');
      const progress = await getProgressFromCookie();
      if (progress && progress.enrollment?.id === enrollmentId && progress.payment) {
        return progress.payment;
      }
    } catch {
      // Fallback
    }

    return null;
  },

  async submitPayment(
    enrollmentId: string,
    studentId: string,
    upiReference: string,
    paymentDate: string,
    screenshotUrl?: string
  ): Promise<Payment> {
    const state = await readDbAsync();
    const now = getCurrentTimestamp();

    // Verify enrollment
    const enrollment = state.enrollments.find(
      (e) => e.id === enrollmentId && e.student_id === studentId
    );
    if (!enrollment) {
      throw new Error('Enrollment not found or unauthorized.');
    }

    const existingIdx = state.payments.findIndex((p) => p.enrollment_id === enrollmentId);

    // Expected amount is server-controlled strictly from site_settings (₹100)
    const expectedAmount = state.site_settings.program_fee || COMPANY_INFO.programFeeINR;

    let paymentRecord: Payment;
    if (existingIdx !== -1) {
      state.payments[existingIdx] = {
        ...state.payments[existingIdx],
        upi_reference: upiReference.trim(),
        payment_date: paymentDate,
        screenshot_url: screenshotUrl || state.payments[existingIdx].screenshot_url,
        amount: expectedAmount,
        status: 'pending_verification',
        rejection_reason: undefined,
        reviewed_by: undefined,
        reviewed_at: undefined,
        updated_at: now,
      };
      paymentRecord = state.payments[existingIdx];
    } else {
      paymentRecord = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        enrollment_id: enrollmentId,
        student_id: studentId,
        amount: expectedAmount,
        upi_reference: upiReference.trim(),
        payment_date: paymentDate,
        screenshot_url: screenshotUrl || '',
        status: 'pending_verification',
        created_at: now,
        updated_at: now,
      };
      state.payments.push(paymentRecord);
    }

    await writeDbAsync(state);
    return paymentRecord;
  },

  async reviewPayment(
    paymentId: string,
    status: 'approved' | 'rejected',
    adminId: string,
    rejectionReason?: string
  ): Promise<Payment | null> {
    const state = await readDbAsync();
    const idx = state.payments.findIndex((p) => p.id === paymentId);
    if (idx === -1) return null;

    const now = getCurrentTimestamp();
    state.payments[idx] = {
      ...state.payments[idx],
      status,
      rejection_reason: status === 'rejected' ? rejectionReason : undefined,
      reviewed_by: adminId,
      reviewed_at: now,
      updated_at: now,
    };

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: `PAYMENT_${status.toUpperCase()}`,
      target_table: 'payments',
      target_id: paymentId,
      details: { status, rejectionReason },
      created_at: now,
    });

    await writeDbAsync(state);
    return state.payments[idx];
  },

  async getAllPayments(): Promise<(Payment & { student?: Profile; domain?: Domain })[]> {
    const state = await readDbAsync();
    return state.payments.map((p) => {
      const enrollment = state.enrollments.find((e) => e.id === p.enrollment_id);
      const student = state.profiles.find((pr) => pr.id === p.student_id);
      const domain = enrollment ? state.domains.find((d) => d.id === enrollment.domain_id) : undefined;
      return { ...p, student, domain };
    });
  },

  // --- Offer Letters ---
  async getOfferLetterByEnrollmentId(enrollmentId: string): Promise<OfferLetterRecord | null> {
    const state = await readDbAsync();
    return state.offer_letters.find((o) => o.enrollment_id === enrollmentId) || null;
  },

  async recordOfferLetterDownload(enrollmentId: string, studentId: string): Promise<OfferLetterRecord> {
    const state = await readDbAsync();
    const existing = state.offer_letters.find((o) => o.enrollment_id === enrollmentId);
    if (existing) return existing;

    const record: OfferLetterRecord = {
      id: `off_${Date.now()}`,
      enrollment_id: enrollmentId,
      student_id: studentId,
      document_id: `INUP-OFF-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      generated_at: getCurrentTimestamp(),
    };

    state.offer_letters.push(record);
    await writeDbAsync(state);
    return record;
  },

  // --- Certificates & Eligibility ---
  async getCertificateByEnrollmentId(enrollmentId: string): Promise<Certificate | null> {
    const state = await readDbAsync();
    return state.certificates.find((c) => c.enrollment_id === enrollmentId) || null;
  },

  async getCertificateById(certificateId: string): Promise<Certificate | null> {
    const state = await readDbAsync();
    return (
      state.certificates.find(
        (c) => c.certificate_id.toLowerCase() === certificateId.toLowerCase().trim()
      ) || null
    );
  },

  async issueCertificate(
    enrollmentId: string,
    adminOrSystemId: string
  ): Promise<{ certificate: Certificate; newlyIssued: boolean }> {
    const state = await readDbAsync();
    const existing = state.certificates.find((c) => c.enrollment_id === enrollmentId);
    if (existing && existing.status === 'issued') {
      return { certificate: existing, newlyIssued: false };
    }

    const enrollment = state.enrollments.find((e) => e.id === enrollmentId);
    if (!enrollment) throw new Error('Enrollment not found.');

    const student = state.profiles.find((p) => p.id === enrollment.student_id);
    if (!student) throw new Error('Student profile not found.');

    const domain = state.domains.find((d) => d.id === enrollment.domain_id);
    if (!domain) throw new Error('Domain not found.');

    const linkedIn = state.linkedin_submissions.find((l) => l.enrollment_id === enrollmentId) || null;
    const taskSubs = state.task_submissions.filter((t) => t.enrollment_id === enrollmentId);
    const payment = state.payments.find((p) => p.enrollment_id === enrollmentId) || null;

    // Single source of truth eligibility evaluation
    const eligibility = calculateCertificateEligibility({
      enrollment,
      linkedInSubmission: linkedIn,
      taskSubmissions: taskSubs,
      payment,
      isRevoked: existing?.status === 'revoked',
    });

    if (!eligibility.isEligible) {
      throw new Error(`Certificate eligibility requirements not met: ${eligibility.reasons.join(', ')}`);
    }

    const now = getCurrentTimestamp();
    // Cryptographically secure, unguessable certificate identifier with high entropy
    const entropy = crypto.randomBytes(6).toString('hex').toUpperCase();
    const certCode = `INUP-${new Date().getFullYear()}-${entropy.slice(0, 4)}-${entropy.slice(4, 8)}-${entropy.slice(8, 12)}`;

    const cert: Certificate = {
      id: `cert_${Date.now()}`,
      certificate_id: certCode,
      enrollment_id: enrollmentId,
      student_id: student.id,
      student_name: student.full_name,
      domain_name: domain.name,
      start_date: enrollment.start_date,
      end_date: enrollment.deadline,
      issue_date: now,
      status: 'issued',
      created_at: now,
    };

    // Mark enrollment completed
    const enrIdx = state.enrollments.findIndex((e) => e.id === enrollmentId);
    if (enrIdx !== -1) {
      state.enrollments[enrIdx].status = 'completed';
      state.enrollments[enrIdx].updated_at = now;
    }

    state.certificates.push(cert);

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminOrSystemId,
      action: 'CERTIFICATE_ISSUED',
      target_table: 'certificates',
      target_id: cert.id,
      details: { certificate_id: certCode, student_id: student.id },
      created_at: now,
    });

    await writeDbAsync(state);
    return { certificate: cert, newlyIssued: true };
  },

  async revokeCertificate(
    certificateId: string,
    reason: string,
    adminId: string
  ): Promise<Certificate | null> {
    const state = await readDbAsync();
    const idx = state.certificates.findIndex((c) => c.id === certificateId || c.certificate_id === certificateId);
    if (idx === -1) return null;

    const now = getCurrentTimestamp();
    state.certificates[idx].status = 'revoked';
    state.certificates[idx].revocation_reason = reason;
    state.certificates[idx].revoked_at = now;

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: 'CERTIFICATE_REVOKED',
      target_table: 'certificates',
      target_id: state.certificates[idx].id,
      details: { certificate_id: state.certificates[idx].certificate_id, reason },
      created_at: now,
    });

    await writeDbAsync(state);
    return state.certificates[idx];
  },

  async getAllCertificates(): Promise<Certificate[]> {
    const state = await readDbAsync();
    return state.certificates;
  },

  // --- Site Settings ---
  async getSiteSettings(): Promise<SiteSettings> {
    const state = await readDbAsync();
    return state.site_settings;
  },

  async updateSiteSettings(updates: Partial<SiteSettings>, adminId: string): Promise<SiteSettings> {
    const state = await readDbAsync();
    state.site_settings = {
      ...state.site_settings,
      ...updates,
      updated_at: getCurrentTimestamp(),
    };

    state.admin_audit_logs.push({
      id: `log_${Date.now()}`,
      actor_id: adminId,
      action: 'SITE_SETTINGS_UPDATED',
      target_table: 'site_settings',
      target_id: state.site_settings.id,
      details: updates,
      created_at: getCurrentTimestamp(),
    });

    await writeDbAsync(state);
    return state.site_settings;
  },

  // --- Audit Logs ---
  async createAuditLog(
    actorId: string,
    action: string,
    targetTable: string,
    targetId: string,
    details?: Record<string, unknown>
  ): Promise<AdminAuditLog> {
    const state = await readDbAsync();
    const log: AdminAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actor_id: actorId,
      action,
      target_table: targetTable,
      target_id: targetId,
      details,
      created_at: getCurrentTimestamp(),
    };
    state.admin_audit_logs.push(log);
    await writeDbAsync(state);
    return log;
  },

  async getAuditLogs(limit = 100): Promise<AdminAuditLog[]> {
    const state = await readDbAsync();
    return state.admin_audit_logs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  // --- Overview & Reports ---
  async getAdminStats() {
    const state = await readDbAsync();
    const totalStudents = state.profiles.filter((p) => p.role === 'student').length;
    const activeEnrollments = state.enrollments.filter((e) => e.status === 'active').length;
    const completedEnrollments = state.enrollments.filter((e) => e.status === 'completed').length;
    const pendingLinkedIn = state.linkedin_submissions.filter((s) => s.status === 'pending_review').length;
    const pendingPayments = state.payments.filter((p) => p.status === 'pending_verification').length;
    const pendingTaskReviews = state.task_submissions.filter((s) => s.review_status === 'pending_review' && s.github_url?.trim().length > 0).length;
    const issuedCertificates = state.certificates.filter((c) => c.status === 'issued').length;

    return {
      totalStudents,
      activeEnrollments,
      completedEnrollments,
      pendingLinkedIn,
      pendingPayments,
      pendingTaskReviews,
      issuedCertificates,
      totalDomains: state.domains.length,
      totalTasks: state.tasks.length,
    };
  },

  // --- Public Certificate Registry ---
  async searchCertificatesRegistry(options: {
    query?: string;
    domain?: string;
    limit?: number;
  }): Promise<Array<{
    certificate_id: string;
    student_name: string;
    domain_name: string;
    start_date: string;
    end_date: string;
    issue_date: string;
    status: 'issued' | 'revoked';
  }>> {
    const state = await readDbAsync();
    let certs = state.certificates;

    if (options.domain && options.domain !== 'all') {
      const dClean = options.domain.toLowerCase().trim();
      certs = certs.filter((c) => c.domain_name.toLowerCase().includes(dClean));
    }

    if (options.query && options.query.trim().length > 0) {
      const q = options.query.toLowerCase().trim();
      certs = certs.filter(
        (c) =>
          c.certificate_id.toLowerCase().includes(q) ||
          c.student_name.toLowerCase().includes(q) ||
          c.domain_name.toLowerCase().includes(q)
      );
    }

    return certs.slice(0, options.limit || 50).map((c) => ({
      certificate_id: c.certificate_id,
      student_name: c.student_name,
      domain_name: c.domain_name,
      start_date: c.start_date,
      end_date: c.end_date,
      issue_date: c.issue_date,
      status: c.status,
    }));
  },

  _resetDatabaseForTesting(): void {
    const fresh = initializeDefaultDatabase();
    writeDb(fresh);
  },
};
