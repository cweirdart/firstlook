-- ============================================================
-- First Look — Waitlist Table
-- Collects emails from the landing page.
-- ============================================================

create table public.waitlist (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  created_at timestamptz default now() not null
);

-- Anyone can sign up for the waitlist (landing page is public)
alter table public.waitlist enable row level security;

create policy "Anyone can insert into waitlist"
  on public.waitlist for insert
  with check (true);

-- Only authenticated admin can read the list
create policy "Only authenticated users can read waitlist"
  on public.waitlist for select
  using (auth.uid() is not null);
