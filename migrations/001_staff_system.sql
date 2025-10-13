-- GigExecs Staff Dashboard System Migration
-- Run this in Supabase SQL Editor

-- ==================================================
-- STAFF USERS TABLE
-- ==================================================
-- Staff users linked to auth.users via user_id
create table staff_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  first_name text,
  last_name text,
  role text check (role in ('support', 'admin', 'super_user')) default 'support' not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Only super_users can read/modify
alter table staff_users enable row level security;

create policy "Super users can manage staff"
  on staff_users for all
  using (
    exists (
      select 1 from staff_users su
      where su.user_id = auth.uid()
      and su.role = 'super_user'
      and su.is_active = true
    )
  );

-- ==================================================
-- AUDIT LOGS TABLE
-- ==================================================
create table audit_logs (
  id bigserial primary key,
  staff_id uuid references staff_users(id) not null,
  action_type text not null,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

-- RLS: All staff can read, no one can update/delete
alter table audit_logs enable row level security;

create policy "Staff can read audit logs"
  on audit_logs for select
  using (
    exists (
      select 1 from staff_users su
      where su.user_id = auth.uid()
      and su.is_active = true
    )
  );

-- Prevent updates/deletes
create policy "No updates allowed"
  on audit_logs for update
  using (false);

create policy "No deletes allowed"
  on audit_logs for delete
  using (false);

-- ==================================================
-- IMPERSONATION SESSIONS TABLE
-- ==================================================
create table impersonation_sessions (
  id bigserial primary key,
  staff_id uuid references staff_users(id) not null,
  impersonated_user_id uuid references users(id) not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  active boolean default true,
  session_token text unique not null
);

-- RLS: Staff can read their own sessions
alter table impersonation_sessions enable row level security;

create policy "Staff can read own sessions"
  on impersonation_sessions for select
  using (
    exists (
      select 1 from staff_users su
      where su.id = staff_id
      and su.user_id = auth.uid()
    )
  );

-- ==================================================
-- DASHBOARD SUMMARY VIEW
-- ==================================================
create view dashboard_summary as
select
  (select count(*) from users where user_type='consultant') as total_professionals,
  (select count(*) from users where user_type='client') as total_clients,
  (select count(*) from users where vetting_status='verified') as verified_users,
  (select count(*) from projects) as total_gigs,
  (select count(*) from bids) as total_bids,
  (select sum(amount) from payments) as total_transaction_value;

-- Grant access to authenticated users (staff will be authenticated)
grant select on dashboard_summary to authenticated;

-- ==================================================
-- AUDIT TRIGGER FUNCTION
-- ==================================================
create or replace function log_audit_action()
returns trigger as $$
begin
  -- This will be called from Netlify Functions
  return new;
end;
$$ language plpgsql security definer;

-- ==================================================
-- INDEXES
-- ==================================================
create index idx_staff_users_user_id on staff_users(user_id);
create index idx_staff_users_role on staff_users(role);
create index idx_audit_logs_staff_id on audit_logs(staff_id);
create index idx_audit_logs_created_at on audit_logs(created_at desc);
create index idx_impersonation_sessions_staff_id on impersonation_sessions(staff_id);
create index idx_impersonation_sessions_active on impersonation_sessions(active) where active = true;

-- ==================================================
-- MIGRATION COMPLETE
-- ==================================================
-- After running this migration:
-- 1. Create your first super_user staff account manually:
--    - Create a regular user via Supabase Auth
--    - Insert a record in staff_users linking to that user_id with role='super_user'
-- 2. That super_user can then manage other staff accounts via the UI

