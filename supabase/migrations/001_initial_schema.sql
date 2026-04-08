-- ============================================================
-- First Look — Initial Database Schema
-- Supabase (PostgreSQL) migration
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ── Users / Couples ────────────────────────────────────────
-- Extends Supabase auth.users with app-specific profile data.

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  display_name text,
  partner_name text,
  wedding_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS: users can only see/edit their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);


-- ── Albums ─────────────────────────────────────────────────

create table public.albums (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  share_code text unique not null,
  password_hash text,  -- null = no password
  moderation_enabled boolean default false not null,
  cover_photo_url text,
  photo_count integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index idx_albums_owner on public.albums(owner_id);
create unique index idx_albums_share_code on public.albums(share_code);

-- RLS
alter table public.albums enable row level security;

-- Owners can do anything with their albums
create policy "Owners can manage own albums"
  on public.albums for all
  using (auth.uid() = owner_id);

-- Anyone can read an album by share_code (for guest access)
create policy "Anyone can view albums by share code"
  on public.albums for select
  using (true);


-- ── Photos ─────────────────────────────────────────────────

create type photo_status as enum ('approved', 'pending', 'rejected');

create table public.photos (
  id uuid default uuid_generate_v4() primary key,
  album_id uuid references public.albums(id) on delete cascade not null,
  uploaded_by text not null default 'guest',  -- 'owner' or 'guest'
  filename text,
  storage_path text not null,         -- path in Supabase Storage
  thumbnail_path text,                -- thumbnail path in Storage
  status photo_status default 'approved' not null,
  favorite boolean default false not null,
  guest_name text,                    -- optional guest attribution
  metadata_stripped boolean default true not null,
  uploaded_at timestamptz default now() not null
);

-- Indexes
create index idx_photos_album on public.photos(album_id);
create index idx_photos_status on public.photos(album_id, status);
create index idx_photos_favorite on public.photos(album_id, favorite) where favorite = true;

-- RLS
alter table public.photos enable row level security;

-- Album owners can manage all photos in their albums
create policy "Owners can manage album photos"
  on public.photos for all
  using (
    exists (
      select 1 from public.albums
      where albums.id = photos.album_id
      and albums.owner_id = auth.uid()
    )
  );

-- Anyone can insert photos (guest uploads)
create policy "Anyone can upload photos"
  on public.photos for insert
  with check (true);

-- Anyone can view approved photos (for guest gallery)
create policy "Anyone can view approved photos"
  on public.photos for select
  using (
    status = 'approved'
    or exists (
      select 1 from public.albums
      where albums.id = photos.album_id
      and albums.owner_id = auth.uid()
    )
  );


-- ── Guest Book Messages ────────────────────────────────────

create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  album_id uuid references public.albums(id) on delete cascade not null,
  guest_name text not null default 'A Guest',
  text text not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_messages_album on public.messages(album_id);

-- RLS
alter table public.messages enable row level security;

-- Anyone can leave a message
create policy "Anyone can insert messages"
  on public.messages for insert
  with check (true);

-- Album owners can view and delete messages
create policy "Owners can manage messages"
  on public.messages for all
  using (
    exists (
      select 1 from public.albums
      where albums.id = messages.album_id
      and albums.owner_id = auth.uid()
    )
  );

-- Anyone can view messages for an album
create policy "Anyone can view messages"
  on public.messages for select
  using (true);


-- ── Functions ──────────────────────────────────────────────

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Increment/decrement photo count on album
create or replace function public.update_photo_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.albums
    set photo_count = photo_count + 1, updated_at = now()
    where id = NEW.album_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update public.albums
    set photo_count = greatest(0, photo_count - 1), updated_at = now()
    where id = OLD.album_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_photo_change
  after insert or delete on public.photos
  for each row execute procedure public.update_photo_count();


-- ── Realtime ───────────────────────────────────────────────
-- Enable realtime for photos table (used by slideshow/TV display)

alter publication supabase_realtime add table public.photos;
alter publication supabase_realtime add table public.messages;


-- ── Storage Buckets ────────────────────────────────────────
-- Created via Supabase dashboard or CLI:
--   - `photos` bucket (public read for approved, write for anyone)
--   - `thumbnails` bucket (public read)
--
-- Storage policies (set in dashboard):
--   INSERT: allow all (guests can upload)
--   SELECT: allow all (public gallery)
--   DELETE: allow if user owns the album

