# GigExecs – Functional Build Approach (Cursor Context, Netlify Edition)

> Use this file as a north star while vibecoding the functional app in Cursor. It distills our agreed stack, priorities, flows, and implementation details (incl. Resend for emails). Save as `/docs/PROJECT_APPROACH.md` in your repo.

---

## 0) Tech Stack & Principles

- **Frontend**: React + Vite, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Postgres, Auth, RLS, Realtime, Storage), Netlify Functions
- **Payments**: Stripe (Connect)
- **Email**: **Resend** (transactional + onboarding)
- **Hosting**: Netlify (Vite app), Supabase Cloud (DB/Auth)
- **File Storage**: Supabase Storage (profile photos, portfolios, documents)
- **Security**: RLS-first design (no data without explicit policy)
- **DX**: Cursor for AI-assisted dev, GitHub + Preview Deploys (Netlify)

---

## 1) MVP Scope

1. **Auth & Accounts**
   - Email/password login (Supabase Auth), enforce email verification
   - Registration with user type (consultant/client), Ts&Cs
   - Password reset
   - Social auth (Google/LinkedIn) later

2. **Dashboards**
   - Role-based entry after login
   - Profile completeness, key CTAs, latest notifications

3. **Onboarding**
   - **Consultant**: personal/location, job title, bio, skills (max 15), languages, rates, ID doc, Stripe Connect onboarding, video intro, portfolio, reference_contacts, education, certifications
   - **Client**: personal/company profile, DUNS/website/logo, billing (Stripe customer), team members

4. **Email Automation (Resend)**
   - Verification (Supabase Auth default)
   - Onboarding nudges
   - Project/bid/contract lifecycle notifications
   - Message notifications (optional)

5. **Core Marketplace**
   - Client creates project
   - Consultant bids; client accepts → contract
   - Stripe payment intents / Connect payouts
   - Messaging (Supabase realtime)

---

## 2) Route Plan

| Route | Role | Purpose |
|---|---|---|
| `/login`, `/register` | both | Auth |
| `/dashboard` | both | Role-gated landing |
| `/onboarding/consultant/*` | consultant | Wizard |
| `/onboarding/client/*` | client | Wizard |
| `/projects` | both | Browse |
| `/projects/new` | client | Create project |
| `/projects/[id]` | both | View/bid |
| `/bids` | consultant | My bids |
| `/contracts` | both | My contracts |
| `/messages` | both | Chat |
| `/profile` | both | My profile |
| `/help` | both | Articles |

---

## 3) Data & RLS

### ✅ Existing Tables (Ready)
- `users.id` references `auth.users(id)`
- **reference_contacts** (not `references`)
- `project_skills` join table exists
- `projects`, `bids`, `contracts`, `payments`, `messages` tables exist
- `skills`, `languages`, `user_skills`, `user_languages`
- `consultant_profiles`, `client_profiles`
- `education`, `certifications`, `work_experience`
- `countries`, `portfolio`

### 🚧 Tables to Create (if needed)
- `message_threads` (for organizing conversations)

### 🔒 RLS Policies
- Public read: `projects` (status in open/in_progress/completed), `articles`, `skills`, `languages`
- All other tables: participant-/owner-scoped access

---

## 4) Email Automation (Resend + Netlify Functions)

### 4.1 Environment Variables
In **Netlify** dashboard (Site settings → Environment variables) and `.env` locally:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
RESEND_API_KEY=...
EMAIL_FROM="GigExecs <no-reply@gigexecs.com>"
```

### 4.2 Email Events
- Auth (Supabase): verification, password reset
- Transactional (Resend): onboarding nudges, project lifecycle, new messages, disputes (later)

### 4.3 Netlify Function Pattern
Place in `/netlify/functions/sendEmail.js`:
```js
import { Resend } from 'resend';

export default async (req, res) => {
  try {
    const { to, subject, html } = JSON.parse(req.body);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

Deploy: Netlify auto-detects functions in `/netlify/functions`.

Trigger from app:
```ts
await fetch('/.netlify/functions/sendEmail', {
  method: 'POST',
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Welcome!',
    html: '<h1>Hello</h1><p>Welcome to GigExecs!</p>',
  }),
});
```

### 4.4 File Upload System
- **Profile Photos**: Supabase Storage bucket with RLS
- **Portfolio Files**: Multiple file support per user
- **Document Proofs**: Education certificates, certifications, ID docs
- **Company Assets**: Logos, bid documents
- **Security**: Signed URLs, owner-scoped access

---

## 5) UX Flows

- Auth & Registration
- Role-based dashboard
- Onboarding wizard per role
- Profile completeness meter
- Stripe setup for payouts (consultants) / billing (clients)

---

## 6) Core Features

- Projects: Create/edit, skills join table, public browse
- Bids: Create/read with RLS, email triggers
- Contracts & Payments: Stripe integration
- Messaging: Supabase realtime chat

---

## 7) Security & Testing

- All reads/writes pass RLS
- File uploads: signed URLs tied to owner
- No secrets client-side
- Unit, integration, E2E tests

---

## 8) Sprint Plan

**Sprint 1**
- Auth UI + verification guard
- Role dashboards
- Consultant onboarding (personal/location/skills/languages)
- Resend integration with onboarding email via Netlify function

**Sprint 2**
- Client onboarding
- Projects (create/edit/open list)
- Bids with RLS + email triggers
- Messaging MVP

---

## 9) Gotchas & Conventions

- Table is **reference_contacts**
- Use join tables for filterable facets
- Keep business logic in server actions/Netlify functions
- Respect RLS in queries
- Use Zod for form validation
- Use React Query or Next server actions + revalidation
- Index frequent filter/search fields

---

## 10) Current Progress Status

### ✅ **Completed Infrastructure**
- **Database Schema**: 95% complete with comprehensive user data
- **File Storage**: Supabase Storage buckets configured with RLS
- **Data Migration**: All user data, skills, languages, references, education, certifications migrated
- **Frontend Foundation**: React + Vite + TailwindCSS + shadcn/ui setup

### 🚧 **Ready for Implementation**
- **Auth System**: Supabase Auth ready
- **User Management**: Complete user profiles and relationships
- **File Uploads**: Storage infrastructure ready
- **Core Tables**: Projects, bids, contracts, payments, messages exist

### 🎯 **Next Implementation Priority**
- **Frontend Auth Components**: ✅ **COMPLETED** - Login/register forms working
- **Role-based Dashboards**: ✅ **COMPLETED** - Basic dashboard with header rendering
- **User Data Storage**: ✅ **FIXED** - Users table already had correct structure, registration flow updated to use it
- **Onboarding Wizards**: Leverage existing profile data
- **Project Management**: Build on existing projects table
- **Bidding System**: Implement bid creation and management

### 🚀 **WORKING FUNCTIONAL APP SNAPSHOT - AUGUST 2025**

**✅ COMPLETED & WORKING:**
- **Authentication System**: Supabase Auth fully functional
- **User Registration**: Email verification working
- **User Login**: Session management working
- **Dashboard Layout**: AppShell with responsive header
- **Header Component**: AppHeader with navigation, search, user badge
- **Dashboard Page**: Basic stats, quick actions, recent projects
- **Environment Variables**: Properly configured in Netlify
- **Security**: No hardcoded secrets, proper environment variable usage

**🔧 KEY FIXES APPLIED:**
- Fixed Supabase environment variable loading
- Removed hardcoded secrets from codebase
- Fixed userType prop issues in dashboard
- Added proper error handling and logging
- Configured Netlify secrets scanning properly

**📁 WORKING COMPONENTS:**
- `src/lib/supabase.ts` - Clean environment variable usage
- `src/components/AppShell.tsx` - Main layout wrapper
- `src/components/header/AppHeader.tsx` - Responsive header with error handling
- `src/app/dashboard/index.tsx` - Dashboard content (consultant view)
- `src/app/auth/login.tsx` - Working login form
- `src/app/auth/register.tsx` - Working registration form

**⚠️ IMPORTANT NOTES:**
- Dashboard now properly detects user roles from the users table
- User data is stored consistently in both users table and profile tables
- This is a working foundation to build upon
