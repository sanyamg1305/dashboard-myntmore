-- Aha moments: admin-posted milestone callouts visible to clients
create table if not exists public.aha_moments (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  title       text not null,
  description text,
  emoji       text default '🎉',
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

alter table public.aha_moments enable row level security;

-- Admins can do everything
create policy "Admins manage aha moments"
  on public.aha_moments for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Clients can read their own
create policy "Clients read their aha moments"
  on public.aha_moments for select
  using (
    client_id = (
      select id from public.clients where user_id = auth.uid() limit 1
    )
  );
