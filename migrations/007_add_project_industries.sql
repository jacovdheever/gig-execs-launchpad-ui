-- Add industries array to projects table
alter table projects
  add column if not exists industries int[];

update projects
  set industries = coalesce(industries, '{}');

alter table projects
  alter column industries set default '{}'::int[];

comment on column projects.industries is 'Stores associated industry ids for a project (internal and external gigs)';

-- Optional helper index for array membership lookups
create index if not exists idx_projects_industries on projects using gin (industries);
