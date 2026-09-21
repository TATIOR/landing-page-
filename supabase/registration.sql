create table if not exists public.ita_users (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 email text not null unique,
 phone text,
 password_hash text not null,
 marketing_consent boolean not null default false,
 marketing_consent_at timestamptz,
 source text,
 created_at timestamptz not null default now()
);

alter table public.ita_users enable row level security;
-- No public SELECT/INSERT policies: registrations are written only by the server using the service-role key.
