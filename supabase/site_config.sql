create table if not exists public.ita_site_config (
  id integer primary key,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint ita_site_config_singleton check (id = 1)
);

alter table public.ita_site_config enable row level security;

insert into public.ita_site_config (id, config)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('ita-certificates', 'ita-certificates', true)
on conflict (id) do update set public = true;