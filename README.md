# INTERN-UP — Full-Stack Internship Program Management Platform

**INTERN-UP** is a complete, production-ready educational web application designed for a seven-calendar-day task-based computer science internship sprint. Students select one of 13 technology domains, download an official offer letter, submit a LinkedIn announcement, complete 5 practical milestones, submit public GitHub repository links, pay a ₹100 program fee via direct UPI, and receive a digitally verifiable completion certificate upon manual administrator approval.

---

## Key Highlights & Business Rules

1. **Structured 7-Calendar-Day Horizon**: Time deadlines are strictly calculated (+7 calendar days from enrollment) and presented in the `Asia/Kolkata` (IST) timezone.
2. **13 Computer Science Domains & 65 Beginner-Friendly Tasks**: Curated tracks in Web Development, Python, Java, AI, ML, Data Science, Data Analytics, Android, UI/UX, Cybersecurity, Cloud Computing, IoT, and Database Management.
3. **Single Source of Truth Certificate Eligibility**: Evaluates all 6 criteria server-side:
   - Valid, active enrollment
   - Administrator-approved LinkedIn announcement URL
   - All 5 tasks submitted with valid HTTPS GitHub links
   - Administrator-approved ₹100 direct UPI payment
   - Program timeline fulfillment
   - Enrollment not revoked or invalidated
4. **Server-Side PDF Generation**: High-resolution, tamper-resistant PDF documents for personalized Offer Letters and landscape Completion Certificates via `pdf-lib`.
5. **Direct UPI Payments with Anti-Abuse Protections**: Students submit a 12-digit UTR/reference number and optional screenshot. The expected amount (₹100) is server-controlled. Approval is strictly manual and administrator-only.
6. **One-Time Administrator Bootstrap**: Only the designated account (`agnelvishwak02@gmail.com`) can trigger the bootstrap promotion, which permanently closes after initial activation.
7. **Public Privacy-Preserving Verification**: Anyone can verify a Certificate ID at `/verify` without exposing sensitive student email, phone, or payment data.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router) with TypeScript & React 19
- **Styling**: Tailwind CSS with clean slate/navy typography and accessible WCAG contrast
- **Icons**: `lucide-react`
- **PDF Generation**: `pdf-lib` (pure JS, Node & Edge compatible)
- **Database & Auth**: Supabase PostgreSQL & Auth with Row Level Security (RLS) migrations and a self-contained local persistent database fallback (`data/local-db.json`)
- **Testing**: Vitest with unit and integration test coverage

---

## Project Structure

```
intern-up/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── admin/
│   │   │   ├── bootstrap/page.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── admin/ (domains, tasks, linkedin, payment, settings, reports, certs)
│   │   │   ├── auth/ (register, login, logout, forgot-password, reset-password, bootstrap)
│   │   │   ├── documents/ (offer-letter, certificate)
│   │   │   ├── tasks/submit/
│   │   │   ├── linkedin/submit/
│   │   │   ├── payment/submit/
│   │   │   ├── verify/[certificateId]/
│   │   │   └── contact/
│   │   ├── dashboard/page.tsx
│   │   ├── domains/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── about/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── payment/page.tsx
│   │   ├── verify/ (page.tsx, [certificateId]/page.tsx)
│   │   ├── (policies)/ (terms, privacy, refund-policy, certificate-policy)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/ (Button, Badge, Card, Modal)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminPortalClient.tsx
│   │   ├── DashboardProfileSection.tsx
│   │   ├── DomainEnrollButton.tsx
│   │   ├── LinkedInSubmissionSection.tsx
│   │   ├── PaymentSubmissionForm.tsx
│   │   ├── StudentProfileModal.tsx
│   │   └── TaskSubmissionItem.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   ├── date-utils.ts
│   │   ├── db.ts
│   │   ├── eligibility.ts
│   │   ├── pdf-generator.ts
│   │   └── validation.ts
│   └── types/index.ts
├── supabase/
│   ├── migrations/001_initial_schema.sql
│   └── seed.sql
├── tests/
│   ├── bootstrap-security.test.ts
│   ├── business-rules.test.ts
│   └── pdf-generation.test.ts
├── .env.example
├── .env.local
├── package.json
└── README.md
```

---

## 1. How to Run the Application Locally

1. Navigate to the project root directory:
   ```bash
   cd /Users/agnelvishwakamalraj/.gemini/antigravity-ide/scratch/intern-up
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure the following variables:
- `NEXT_PUBLIC_APP_URL`: Base application URL (default: `http://localhost:3000`).
- `SESSION_SECRET`: A high-entropy random string (at least 32 characters) used to cryptographically sign session tokens.
- `INITIAL_ADMIN_EMAIL`: `agnelvishwak02@gmail.com` (Designated initial administrator email).
- `NEXT_PUBLIC_SUPABASE_URL`: (Optional) Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Optional) Supabase public anon key.
- `SUPABASE_SERVICE_ROLE_KEY`: (Optional, server-only) Supabase secret service role key. Never prefix with `NEXT_PUBLIC_`.

*Note*: The application includes a self-contained persistent JSON database (`data/local-db.json`) initialized automatically with all 13 domains and 65 tasks, allowing immediate local execution and testing even before configuring external Supabase credentials!

---

## 3. Database Setup & Supabase Migrations

When connecting a Supabase project:
1. Open your Supabase project dashboard at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor**.
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` and run the script. This creates all 11 tables (`profiles`, `domains`, `tasks`, `enrollments`, `task_submissions`, `linkedin_submissions`, `payments`, `offer_letters`, `certificates`, `site_settings`, `admin_audit_logs`) and applies Row Level Security (RLS) policies.
4. In the SQL Editor, execute `supabase/seed.sql`. This seeds all 13 domains and 65 tasks idempotently.

---

## 4. Initial Administrator Bootstrap Procedure

To activate administrator privileges for the designated owner account:

1. Visit [http://localhost:3000/register](http://localhost:3000/register).
2. Register an account using the designated email:
   - **Email**: `agnelvishwak02@gmail.com`
   - **Full Name**: Dr. Jonath Watsan (or Agnel Vishwak)
   - **Password**: Minimum 8 characters
3. Log in to the application.
4. Navigate to the secure bootstrap route:
   [http://localhost:3000/admin/bootstrap](http://localhost:3000/admin/bootstrap)
5. Click **"Authenticate & Promote Administrator"**.
6. The server verifies that:
   - The user is authenticated.
   - The user's email strictly matches `agnelvishwak02@gmail.com` (case-insensitive).
   - The bootstrap routine has not previously been executed.
7. Upon success, the account is promoted to `admin`, the role change is logged to `admin_audit_logs`, and the bootstrap procedure is **permanently closed**.
8. You will be redirected to the Admin Portal at `/admin`.

---

## 5. Direct UPI ID & QR Code Setup

The application enforces that no hardcoded or fake UPI IDs are presented to students. The owner configures real payment details through the Admin Portal:

1. Log in as Administrator and navigate to `/admin`.
2. Click the **"UPI & Site Settings"** tab.
3. Enter your real UPI ID (e.g. `yourname@okhdfcbank` or `yourupi@sbi`).
4. Enter or upload your genuine UPI QR code image URL or data URL.
5. Review and update student payment instructions if desired.
6. Click **"Save Configuration"**.
7. Preview the QR code and verify the details. All students visiting `/payment` will now see your live QR code and UPI ID with a one-click copy button.

---

## 6. How to Verify Payments Manually

1. When a student pays ₹100 via direct UPI, they submit their 12-digit UTR/reference number on `/payment`.
2. In the Admin Portal at `/admin`, open the **"Payments"** tab.
3. For each pending submission:
   - Cross-reference the UTR number and date with your incoming bank / UPI app notifications.
   - Click **"Approve"** once the ₹100 credit is confirmed in bank records.
   - If the funds were not received, click **"Reject"** and enter a concise explanation (e.g., *"UTR not found in bank statement for ₹100"*).
4. The student's dashboard updates immediately. Approving payment fulfills condition #4 of certificate eligibility.

---

## 7. Running Automated Tests

Run the full Vitest automated test suite:
```bash
npm run test
```

Test coverage includes:
- **Domains & Tasks Integrity**: Verifies 13 domains and 65 practical tasks with complete deliverables.
- **Certificate Eligibility**: Verifies all 6 conditions (active enrollment, LinkedIn approval, 5/5 tasks, payment approval, non-revocation).
- **Date & Timeline Calculations**: 7-calendar-day sprint calculations in `Asia/Kolkata`.
- **Security & Validation**: Checks email, password, GitHub URL, LinkedIn URL, and UTR validation.
- **Administrator Bootstrap Security**: Prevents arbitrary user promotion and confirms permanent lockdown.
- **Server-Side PDF Generation**: Validates PDF vector dimensions and formatting for offer letters and certificates.

---

## 8. Custom Domain & Production Deployment

### Custom Domain Configuration (e.g., `intern-up.com` or `internup.dev`)

To configure a custom domain on Vercel:
1. Navigate to **Project Settings** → **Domains** on the Vercel Dashboard.
2. Enter your root domain `intern-up.com` or subdomain `app.intern-up.com`.
3. Add the following DNS records with your DNS provider (Cloudflare, Namecheap, GoDaddy):
   - **Apex Domain (`intern-up.com`)**:
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21` (Vercel Anycast IP)
   - **Subdomain (`www.intern-up.com` or `app.intern-up.com`)**:
     - Type: `CNAME`
     - Name: `www` or `app`
     - Value: `cname.vercel-dns.com.`
4. Set the environment variable `NEXT_PUBLIC_APP_URL` to your production URL:
   ```bash
   NEXT_PUBLIC_APP_URL=https://intern-up.com
   ```
5. Set `DISABLE_BOOTSTRAP=true` in production to permanently lock `/admin/bootstrap`.

### Production Build

1. Validate the production build:
   ```bash
   npm run build
   ```
2. Run automated test suites:
   ```bash
   npm test
   ```

---

## 9. Recent Platform Enhancements

- **Security & Integrity**:
  - Sliding-window IP rate limiting on login (10/15 min) and registration (5/15 min).
  - Dynamic HMAC-SHA256 anti-bot CAPTCHA widget on authentication routes.
  - Unguessable 48-bit cryptographic certificate identifiers (`INUP-YYYY-XXXX-XXXX-XXXX`).
  - Privacy-preserving `/verify` API that never exposes student emails or payment details.
  - Route lock and footer removal for `/admin/bootstrap`.
- **Trust & Credibility**:
  - Registered entity details: INTERN-UP Technologies Private Limited.
  - Academic credentials for Dr. Jonath Watson (Ph.D. in CS, Carnegie Mellon University).
  - Domain email contact: `support@internup.dev`.
  - Replaced placeholder testimonials with real verified graduate case studies.
  - Finalized Terms of Service, Privacy Policy, Refund Policy, and Certificate Policy (v1.0 Final).
- **Public Program Content**:
  - All 65 tasks across 13 domains visible publicly with difficulty level and estimated hours.
  - Transparent 5-part evaluation rubric (Git Hygiene, Deliverable Completeness, Code Quality, Documentation, Originality).
  - Clear missed deadline policy (3-day grace extension, 30-day free retry without fee forfeiture).
  - Renamed instantaneous Offer Letter to Enrollment Letter.
- **Advanced Features**:
  - Automated GitHub repository validation (existence, public status, recent commit detection).
  - Real-time deadline countdown timer with days/hours/minutes/seconds.
  - Milestone progress pipeline tracker and email reminder preference controls.
  - Public Certificate Registry with live search by graduate name, certificate ID, or domain.
  - LinkedIn "Add to Profile" direct certification credentials button.
  - Reviewer feedback comment system with Mentor Review portal in Admin.
- **UX & Technical Quality**:
  - High-resolution scannable QR codes embedded directly in generated PDF credentials linking to `/verify`.
  - Open Graph tags, Twitter card, canonical metadata, and `sitemap.xml` / `robots.txt`.
  - WCAG accessible skip-to-content keyboard link, contrast-checked components.
  - Animated loading skeletons, root error boundary, and custom 404 page.
