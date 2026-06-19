-- Run this once in the Supabase SQL editor.
-- It locks down every client-relevant table so a client-role user can ONLY
-- read their own client_id's rows, and can never see other clients' data
-- or internal-only tables, even via direct API calls (not just hidden in the UI).

-- 1. Helper: does the current authenticated user own this client row?
create or replace function public.is_own_client(target_client_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.clients c
    where c.id = target_client_id and c.user_id = auth.uid()
  )
$$;

-- 2. Tables clients should be able to READ (their own rows only).
--    Admins (has_role(auth.uid(),'admin')) keep full read/write access.
do $$
declare
  t text;
begin
  foreach t in array array['weekly_data','campaigns','campaign_weekly_data','high_scores','targets','hot_leads','actionables']
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format(
      'drop policy if exists "admin_full_access" on public.%I', t);
    execute format(
      'create policy "admin_full_access" on public.%I for all using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))', t);

    execute format(
      'drop policy if exists "client_read_own" on public.%I', t);
    execute format(
      'create policy "client_read_own" on public.%I for select using (public.is_own_client(client_id))', t);
  end loop;
end $$;

-- 3. clients table itself: client can read only their own row, admin full access.
alter table public.clients enable row level security;

drop policy if exists "admin_full_access" on public.clients;
create policy "admin_full_access" on public.clients
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "client_read_own" on public.clients;
create policy "client_read_own" on public.clients
  for select using (user_id = auth.uid());

-- 4. Internal-only tables: admin access only, RLS enabled with no client policy
--    (no policy = no access for non-admins by default once RLS is on).
do $$
declare
  t text;
begin
  foreach t in array array[
    'mm_weekly_data','sales_weekly_data','tj_weekly_data','finance_data',
    'expenses','growth_initiatives','growth_initiative_comments',
    'myntmore_processes','process_weekly_updates','invites','profiles',
    'user_roles','client_assignments','client_context_notes','client_settings',
    'client_alerts','client_notifications','client_health_scores',
    'tj_channel_assignments'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin_full_access" on public.%I', t);
    execute format(
      'create policy "admin_full_access" on public.%I for all using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))', t);
  end loop;
end $$;

-- Every user (admin or client) can read their own profile row.
drop policy if exists "self_read_profile" on public.profiles;
create policy "self_read_profile" on public.profiles
  for select using (id = auth.uid());
