-- TATIOR storefront database foundation
create extension if not exists pgcrypto;

create table if not exists public.tatior_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  sku text,
  category text not null default 'Accessories',
  brand text,
  condition text not null default 'New',
  price numeric(14,0) default 0,
  old_price numeric(14,0),
  stock integer not null default 0,
  image_urls jsonb not null default '[]'::jsonb,
  description text,
  specs jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tatior_store_settings (
  id integer primary key default 1 check (id=1),
  store_name text not null default 'TATIOR',
  whatsapp_number text,
  currency text not null default 'FCFA',
  updated_at timestamptz not null default now()
);

alter table public.tatior_products enable row level security;
alter table public.tatior_store_settings enable row level security;

drop policy if exists "Public can view active TATIOR products" on public.tatior_products;
create policy "Public can view active TATIOR products" on public.tatior_products for select using (active=true);

drop policy if exists "Public can view TATIOR settings" on public.tatior_store_settings;
create policy "Public can view TATIOR settings" on public.tatior_store_settings for select using (true);

insert into public.tatior_store_settings (id,store_name)
values (1,'TATIOR')
on conflict (id) do update set store_name='TATIOR',updated_at=now();