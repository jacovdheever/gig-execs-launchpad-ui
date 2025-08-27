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

### ⚠️ **CRITICAL: Never Hardcode Values**

**NEVER hardcode values that should come from user input or dynamic data:**
- ❌ `'Pending'` for names, titles, or descriptions
- ❌ `'consultant'` or `'client'` for user types
- ❌ Any hardcoded strings that override actual user data
- ❌ Default values that mask real functionality

**ALWAYS:**
- ✅ Use parameters passed to functions
- ✅ Respect user input data
- ✅ Maintain data integrity
- ✅ Test with real user data to verify functionality

---

## 10) Database Schema Reference

### ⚠️ **CRITICAL: Always Check Database Schema Before Database Operations**

**BEFORE making any database-related changes, ALWAYS:**
1. Check the database schema in this section
2. Verify table names and column names exist
3. Do NOT assume fields exist - reference the actual schema below
4. If unsure, ask user to re-export current schema

### Current Database Structure (Exported from Supabase)

#### Core User Tables
- **users**: Basic identity and profile data
- **consultant_profiles**: Detailed consultant information  
- **client_profiles**: Company and business information

#### Profile & Skills Tables
- **user_skills**: User-skill relationships
- **user_languages**: User-language relationships
- **skills**: Available skills catalog
- **languages**: Available languages catalog

#### Professional Data Tables
- **education**: User education history
- **certifications**: User certifications
- **work_experience**: User work history
- **portfolio**: User portfolio projects
- **reference_contacts**: User references

#### Project & Business Tables
- **projects**: Project listings
- **bids**: Consultant bids on projects
- **contracts**: Project contracts
- **payments**: Payment records
- **teams**: Team structures

#### Communication Tables
- **conversations**: Chat conversations
- **messages**: Individual messages
- **notifications**: User notifications

#### Complete Schema DDL:

```sql
-- Users table (Basic identity and profile data)
CREATE TABLE users (
  id uuid NOT NULL, 
  email text NOT NULL, 
  first_name text NOT NULL, 
  last_name text NOT NULL, 
  user_type text NOT NULL, 
  status text DEFAULT 'registered'::text, 
  t_and_c_accepted boolean DEFAULT false, 
  vetting_status text DEFAULT 'pending'::text, 
  verification_reason text, 
  profile_complete_pct integer DEFAULT 0, 
  last_login timestamp with time zone, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now(), 
  deleted_at timestamp with time zone, 
  profile_photo_url text, 
  headline text, 
  profile_status text
);

-- Consultant profiles table (Detailed consultant information)
CREATE TABLE consultant_profiles (
  user_id uuid NOT NULL, 
  job_title text, 
  bio text, 
  address1 text, 
  address2 text, 
  address3 text, 
  country text, 
  postal_code text, 
  phone text, 
  linkedin_url text, 
  id_doc_url text, 
  video_intro_url text, 
  stripe_account_id text, 
  hourly_rate_min numeric, 
  hourly_rate_max numeric, 
  availability jsonb, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now(), 
  country_id integer, 
  industries ARRAY
);

-- Client profiles table (Company and business information)
CREATE TABLE client_profiles (
  user_id uuid NOT NULL, 
  company_name text NOT NULL, 
  website text, 
  description text, 
  duns_number text, 
  organisation_type text, 
  industry text, 
  logo_url text, 
  address1 text, 
  address2 text, 
  address3 text, 
  country text, 
  postal_code text, 
  phone text, 
  linkedin_url text, 
  stripe_customer_id text, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now(), 
  country_id integer
);

-- User skills table (User-skill relationships)
CREATE TABLE user_skills (
  user_id uuid NOT NULL, 
  skill_id integer NOT NULL
);

-- User languages table (User-language relationships)
CREATE TABLE user_languages (
  user_id uuid NOT NULL, 
  language_id integer NOT NULL, 
  proficiency text NOT NULL
);

-- Skills table (Available skills catalog)
CREATE TABLE skills (
  id integer NOT NULL DEFAULT nextval('skills_id_seq'::regclass), 
  name text NOT NULL
);

-- Languages table (Available languages catalog)
CREATE TABLE languages (
  id integer NOT NULL DEFAULT nextval('languages_id_seq'::regclass), 
  name text NOT NULL
);

-- Education table (User education history)
CREATE TABLE education (
  id integer NOT NULL DEFAULT nextval('education_id_seq'::regclass), 
  user_id uuid, 
  institution_name text NOT NULL, 
  degree_level text NOT NULL, 
  grade text, 
  start_date date, 
  end_date date, 
  description text, 
  file_url text
);

-- Certifications table (User certifications)
CREATE TABLE certifications (
  id integer NOT NULL DEFAULT nextval('certifications_id_seq'::regclass), 
  user_id uuid, 
  name text NOT NULL, 
  awarding_body text NOT NULL, 
  issue_date date, 
  expiry_date date, 
  credential_id text, 
  credential_url text, 
  file_url text
);

-- Work experience table (User work history)
CREATE TABLE work_experience (
  id integer NOT NULL DEFAULT nextval('work_experience_id_seq'::regclass), 
  user_id uuid NOT NULL, 
  company character varying(255) NOT NULL, 
  job_title character varying(255) NOT NULL, 
  description text, 
  city character varying(255), 
  country_id integer, 
  start_date_month character varying(50), 
  start_date_year integer, 
  end_date_month character varying(50), 
  end_date_year integer, 
  currently_working boolean DEFAULT false, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now()
);

-- Portfolio table (User portfolio projects)
CREATE TABLE portfolio (
  id integer NOT NULL DEFAULT nextval('portfolio_id_seq'::regclass), 
  user_id uuid, 
  project_name text NOT NULL, 
  project_role text, 
  description text, 
  start_date date, 
  completed_date date, 
  currently_open boolean DEFAULT false, 
  problem_video_url text, 
  problem_files jsonb, 
  solution_video_url text, 
  solution_files jsonb, 
  skills jsonb, 
  portfolio_files ARRAY
);

-- Reference contacts table (User references)
CREATE TABLE reference_contacts (
  id integer NOT NULL DEFAULT nextval('reference_contacts_id_seq'::regclass), 
  user_id uuid, 
  first_name text NOT NULL, 
  last_name text NOT NULL, 
  email text NOT NULL, 
  phone text, 
  company_name text, 
  description text
);

-- Projects table (Project listings)
CREATE TABLE projects (
  id integer NOT NULL DEFAULT nextval('projects_id_seq'::regclass), 
  creator_id uuid, 
  type text NOT NULL, 
  title text NOT NULL, 
  description text, 
  cover_photo_url text, 
  skills_required jsonb, 
  num_consultants integer DEFAULT 1, 
  currency text, 
  budget_min numeric, 
  budget_max numeric, 
  desired_amount_min numeric, 
  desired_amount_max numeric, 
  delivery_time_min integer, 
  delivery_time_max integer, 
  status text DEFAULT 'draft'::text, 
  screening_questions jsonb, 
  template_id integer, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now(), 
  deleted_at timestamp with time zone
);

-- Bids table (Consultant bids on projects)
CREATE TABLE bids (
  id integer NOT NULL DEFAULT nextval('bids_id_seq'::regclass), 
  project_id integer, 
  consultant_id uuid, 
  amount numeric, 
  currency text, 
  status text DEFAULT 'pending'::text, 
  created_at timestamp with time zone DEFAULT now(), 
  bid_documents ARRAY
);

-- Contracts table (Project contracts)
CREATE TABLE contracts (
  id integer NOT NULL DEFAULT nextval('contracts_id_seq'::regclass), 
  client_id uuid, 
  consultant_id uuid, 
  project_id integer, 
  bid_id integer, 
  status text DEFAULT 'active'::text, 
  start_date date, 
  end_date date, 
  terms jsonb, 
  payment_terms jsonb, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now(), 
  deleted_at timestamp with time zone
);

-- Payments table (Payment records)
CREATE TABLE payments (
  id integer NOT NULL DEFAULT nextval('payments_id_seq'::regclass), 
  contract_id integer, 
  amount numeric NOT NULL, 
  status text DEFAULT 'pending'::text, 
  stripe_payment_id text, 
  created_at timestamp with time zone DEFAULT now()
);

-- Teams table (Team structures)
CREATE TABLE teams (
  id integer NOT NULL DEFAULT nextval('teams_id_seq'::regclass), 
  name text NOT NULL, 
  created_by uuid, 
  created_at timestamp with time zone DEFAULT now()
);

-- Team members table (Team member relationships)
CREATE TABLE team_members (
  team_id integer NOT NULL, 
  user_id uuid NOT NULL
);

-- Conversations table (Chat conversations)
CREATE TABLE conversations (
  id integer NOT NULL DEFAULT nextval('conversations_id_seq'::regclass), 
  type text DEFAULT 'one_to_one'::text, 
  subject text
);

-- Messages table (Individual messages)
CREATE TABLE messages (
  id integer NOT NULL DEFAULT nextval('messages_id_seq'::regclass), 
  conversation_id integer, 
  sender_id uuid, 
  recipient_id uuid, 
  content text, 
  attachments jsonb, 
  status text DEFAULT 'unread'::text, 
  created_at timestamp with time zone DEFAULT now()
);

-- Notifications table (User notifications)
CREATE TABLE notifications (
  id integer NOT NULL DEFAULT nextval('notifications_id_seq'::regclass), 
  user_id uuid, 
  type text, 
  content text, 
  read boolean DEFAULT false, 
  action_url text, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now()
);

-- Project skills table (Project-skill relationships)
CREATE TABLE project_skills (
  project_id integer NOT NULL, 
  skill_id integer NOT NULL
);

-- Project languages table (Project-language relationships)
CREATE TABLE project_languages (
  project_id integer NOT NULL, 
  language_id integer NOT NULL
);

-- Countries table (Country reference data)
CREATE TABLE countries (
  id integer NOT NULL DEFAULT nextval('countries_id_seq'::regclass), 
  name character varying(255) NOT NULL, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now()
);

-- Articles table (Content articles)
CREATE TABLE articles (
  id integer NOT NULL DEFAULT nextval('articles_id_seq'::regclass), 
  title text NOT NULL, 
  type text, 
  tags jsonb, 
  role text, 
  body text, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now()
);

-- Project templates table (Project templates)
CREATE TABLE project_templates (
  id integer NOT NULL DEFAULT nextval('project_templates_id_seq'::regclass), 
  creator_id uuid, 
  title text, 
  description text, 
  cover_photo_url text, 
  skills_required jsonb, 
  num_consultants integer, 
  currency text, 
  budget_min numeric, 
  budget_max numeric, 
  desired_amount_min numeric, 
  desired_amount_max numeric, 
  delivery_time_min integer, 
  delivery_time_max integer, 
  screening_questions jsonb, 
  created_at timestamp with time zone DEFAULT now()
);

-- Video meetings table (Video meeting scheduling)
CREATE TABLE video_meetings (
  id integer NOT NULL DEFAULT nextval('video_meetings_id_seq'::regclass), 
  title text NOT NULL, 
  description text, 
  date date NOT NULL, 
  start_time time without time zone NOT NULL, 
  end_time time without time zone NOT NULL, 
  created_by uuid, 
  participants jsonb, 
  meeting_url text, 
  created_at timestamp with time zone DEFAULT now()
);

-- Vetting questions table (Vetting questions)
CREATE TABLE vetting_questions (
  id integer NOT NULL DEFAULT nextval('vetting_questions_id_seq'::regclass), 
  question text NOT NULL
);

-- Vetting responses table (User vetting responses)
CREATE TABLE vetting_responses (
  id integer NOT NULL DEFAULT nextval('vetting_responses_id_seq'::regclass), 
  user_id uuid, 
  question_id integer, 
  answer text NOT NULL, 
  verified_by uuid, 
  created_at timestamp with time zone DEFAULT now()
);

-- Disputes table (Contract disputes)
CREATE TABLE disputes (
  id integer NOT NULL DEFAULT nextval('disputes_id_seq'::regclass), 
  contract_id integer, 
  raised_by uuid, 
  reason text NOT NULL, 
  details text, 
  preferred_outcome text, 
  status text DEFAULT 'open'::text, 
  ticket_no text, 
  supporting_docs jsonb, 
  created_at timestamp with time zone DEFAULT now(), 
  updated_at timestamp with time zone DEFAULT now()
);

-- Dispute responses table (Dispute responses)
CREATE TABLE dispute_responses (
  id integer NOT NULL DEFAULT nextval('dispute_responses_id_seq'::regclass), 
  dispute_id integer, 
  responder_id uuid, 
  response_details text, 
  preferred_outcome text, 
  supporting_docs jsonb, 
  created_at timestamp with time zone DEFAULT now()
);
```

### Schema Validation Checklist

**Before any database operation, verify:**
- [ ] Table name exists in schema above
- [ ] Column names exist in target table
- [ ] Data types match expected format
- [ ] Foreign key relationships are correct
- [ ] Required fields are NOT NULL
- [ ] Default values are appropriate

---

## 11) Current Progress Status

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
