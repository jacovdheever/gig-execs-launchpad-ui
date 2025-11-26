-- External Gig Clicks Tracking Migration
-- Run in Supabase SQL Editor
-- Tracks clicks on external gig links from authenticated professionals

begin;

-- 1. Create external_gig_clicks table ------------------------------------------
create table if not exists external_gig_clicks (
  id bigserial primary key,
  project_id integer not null references projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  click_source text not null check (click_source in ('listing', 'detail')),
  created_at timestamptz not null default now()
);

-- 2. Add indexes for performance ------------------------------------------------
create index if not exists idx_external_gig_clicks_project_id on external_gig_clicks(project_id);
create index if not exists idx_external_gig_clicks_user_id on external_gig_clicks(user_id);
create index if not exists idx_external_gig_clicks_created_at on external_gig_clicks(created_at);
-- Composite index for unique user clicks per project queries
create index if not exists idx_external_gig_clicks_project_user on external_gig_clicks(project_id, user_id);

-- 3. Add comments ---------------------------------------------------------------
comment on table external_gig_clicks is 'Tracks clicks on external gig links by authenticated professionals';
comment on column external_gig_clicks.project_id is 'The external project that was clicked';
comment on column external_gig_clicks.user_id is 'The authenticated professional who clicked';
comment on column external_gig_clicks.click_source is 'Where the click originated: listing page or detail page';
comment on column external_gig_clicks.created_at is 'Timestamp when the click occurred';

-- 4. Enable RLS ----------------------------------------------------------------
alter table external_gig_clicks enable row level security;
alter table external_gig_clicks force row level security;

-- 5. RLS Policies ---------------------------------------------------------------

-- Professionals can insert their own clicks
drop policy if exists "professionals_insert_clicks" on external_gig_clicks;
create policy "professionals_insert_clicks"
  on external_gig_clicks for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from users u
      where u.id = auth.uid()
        and u.user_type = 'consultant'
    )
    and exists (
      select 1 from projects p
      where p.id = external_gig_clicks.project_id
        and p.project_origin = 'external'
        and p.external_url is not null
    )
  );

-- Professionals can read their own clicks
drop policy if exists "professionals_read_own_clicks" on external_gig_clicks;
create policy "professionals_read_own_clicks"
  on external_gig_clicks for select
  to authenticated
  using (user_id = auth.uid());

-- Staff can read all clicks (for reporting)
drop policy if exists "staff_read_all_clicks" on external_gig_clicks;
create policy "staff_read_all_clicks"
  on external_gig_clicks for select
  to authenticated
  using (
    exists (
      select 1 from staff_users su
      where su.user_id = auth.uid()
        and su.is_active = true
    )
  );

-- No updates or deletes allowed (immutable tracking)
-- This ensures data integrity for analytics

commit;

