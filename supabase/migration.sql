-- Enable extensions
create extension if not exists pgcrypto;
create extension if not exists pgjwt;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  lang text default 'en',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Items (documents to track)
create type public.category as enum (
  'emirates_id', 'car_registration', 'drivers_license', 'visa', 'insurance', 'tenancy', 'trade_license', 'passport', 'other'
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category public.category not null,
  title text not null,
  id_number text,
  issue_date date,
  expiry_date date not null,
  reminder_days int[] default array[60,30,7,1], -- days before expiry
  file_url text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Reminder logs
create type public.channel as enum ('email','whatsapp');

create table if not exists public.reminder_logs (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  scheduled_for date not null,
  sent_at timestamp with time zone default now(),
  channel public.channel not null,
  status text default 'sent'
);

-- RLS
alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.reminder_logs enable row level security;

create policy "Individuals can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Individuals can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Individuals can CRUD own items" on public.items
  using (auth.uid() = user_id);

create policy "Individuals can view own reminder logs" on public.reminder_logs
  for select using (auth.uid() = user_id);

-- Functions

-- Helper to get items that need reminders on a given date
-- This is optional; app code computes it. Kept for future optimization.

