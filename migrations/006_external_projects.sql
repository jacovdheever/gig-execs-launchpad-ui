-- External Gigs support migration
-- Run in Supabase SQL Editor

begin;

-- 1. Add origin and external metadata columns to projects --------------------
alter table projects
  add column if not exists project_origin text;

update projects
  set project_origin = 'internal'
  where project_origin is null;

alter table projects
  alter column project_origin set default 'internal',
  alter column project_origin set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'projects'::regclass
      and conname = 'chk_projects_project_origin'
  ) then
    alter table projects
      add constraint chk_projects_project_origin
        check (project_origin in ('internal', 'external'));
  end if;
end $$;

alter table projects
  add column if not exists external_url text,
  add column if not exists expires_at timestamptz,
  add column if not exists source_name text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'projects'::regclass
      and conname = 'chk_projects_external_requirements'
  ) then
    alter table projects
      add constraint chk_projects_external_requirements
        check (
          project_origin <> 'external'
          or (
            external_url is not null
            and length(trim(external_url)) > 0
          )
        );
  end if;
end $$;

comment on column projects.project_origin is 'Identifies whether the project is internal or sourced from an external partner';
comment on column projects.external_url is 'External application link when project originates outside GigExecs';
comment on column projects.expires_at is 'Optional expiry timestamp for external projects';
comment on column projects.source_name is 'Optional name of the external source (e.g. LinkedIn)';

create index if not exists idx_projects_origin on projects(project_origin);
create index if not exists idx_projects_expires_at on projects(expires_at);
create index if not exists idx_projects_status_origin on projects(status, project_origin);

-- 2. Refresh key policies for projects listing --------------------------------
drop policy if exists "Public can view open projects" on projects;

create policy "Public can view open projects"
  on projects for select
  using (
    status in ('open', 'in_progress', 'completed')
    and coalesce(deleted_at, to_timestamp(0)) = to_timestamp(0)
  );

-- 3. RLS hardening to block external bids/contracts/payments ------------------
alter table bids enable row level security;
alter table bids force row level security;

drop policy if exists "consultants_insert_bids" on bids;
create policy "consultants_insert_bids"
  on bids for insert to authenticated
  with check (
    consultant_id = auth.uid()
    and exists (
      select 1 from projects p
      where p.id = bids.project_id
        and p.project_origin = 'internal'
    )
  );

drop policy if exists "consultants_update_bids" on bids;
create policy "consultants_update_bids"
  on bids for update to authenticated
  using (
    consultant_id = auth.uid()
    and exists (
      select 1 from projects p
      where p.id = bids.project_id
        and p.project_origin = 'internal'
    )
  )
  with check (
    consultant_id = auth.uid()
    and exists (
      select 1 from projects p
      where p.id = bids.project_id
        and p.project_origin = 'internal'
    )
  );

drop policy if exists "consultants_delete_bids" on bids;
create policy "consultants_delete_bids"
  on bids for delete to authenticated
  using (
    consultant_id = auth.uid()
    and exists (
      select 1 from projects p
      where p.id = bids.project_id
        and p.project_origin = 'internal'
    )
  );

drop policy if exists "consultants_select_bids" on bids;
create policy "consultants_select_bids"
  on bids for select to authenticated
  using (
    consultant_id = auth.uid()
    and exists (
      select 1 from projects p
      where p.id = bids.project_id
        and p.project_origin = 'internal'
    )
  );

alter table contracts enable row level security;
alter table contracts force row level security;

drop policy if exists "contracts_manage_internal_only" on contracts;
create policy "contracts_manage_internal_only"
  on contracts for all to authenticated
  using (
    exists (
      select 1 from projects p
      where p.id = contracts.project_id
        and p.project_origin = 'internal'
    )
  )
  with check (
    exists (
      select 1 from projects p
      where p.id = contracts.project_id
        and p.project_origin = 'internal'
    )
  );

alter table payments enable row level security;
alter table payments force row level security;

drop policy if exists "payments_internal_projects_only" on payments;
create policy "payments_internal_projects_only"
  on payments for all to authenticated
  using (
    exists (
      select 1
      from contracts c
      join projects p on p.id = c.project_id
      where c.id = payments.contract_id
        and p.project_origin = 'internal'
    )
  )
  with check (
    exists (
      select 1
      from contracts c
      join projects p on p.id = c.project_id
      where c.id = payments.contract_id
        and p.project_origin = 'internal'
    )
  );

commit;


