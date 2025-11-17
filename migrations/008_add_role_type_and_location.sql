-- Add role_type and gig_location fields to projects table
-- Run in Supabase SQL Editor

begin;

-- 1. Add role_type column to projects --------------------
alter table projects
  add column if not exists role_type text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'projects'::regclass
      and conname = 'chk_projects_role_type'
  ) then
    alter table projects
      add constraint chk_projects_role_type
        check (role_type is null or role_type in ('in_person', 'hybrid', 'remote'));
  end if;
end $$;

comment on column projects.role_type is 'Type of role: in_person, hybrid, or remote';

-- 2. Add gig_location column to projects --------------------
alter table projects
  add column if not exists gig_location text;

comment on column projects.gig_location is 'Physical location where the Gig or Client is located. Can be a city, country, or "Fully Remote"';

-- 3. Create indexes for better query performance -----------
create index if not exists idx_projects_role_type on projects(role_type);
create index if not exists idx_projects_gig_location on projects(gig_location);

commit;

