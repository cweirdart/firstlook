-- ============================================================
-- Video Messages — guests record short video messages for the couple
-- ============================================================

-- Table for video message metadata
create table public.video_messages (
  id uuid default uuid_generate_v4() primary key,
  album_id uuid references public.albums(id) on delete cascade not null,
  guest_name text not null default 'A Guest',
  storage_path text not null,
  video_url text not null,
  file_size bigint not null default 0,
  mime_type text not null default 'video/webm',
  created_at timestamptz default now() not null
);

-- Index for fast album lookups
create index idx_video_messages_album_id on public.video_messages(album_id);

-- Row Level Security
alter table public.video_messages enable row level security;

-- Anyone can insert (guests recording video messages)
create policy "Anyone can insert video messages"
  on public.video_messages for insert
  with check (true);

-- Anyone can view video messages (shared album viewers)
create policy "Anyone can view video messages"
  on public.video_messages for select
  using (true);

-- Only album owner can delete video messages
create policy "Album owner can delete video messages"
  on public.video_messages for delete
  using (
    album_id in (
      select id from public.albums where owner_id = auth.uid()
    )
  );

-- Enable realtime for video messages
alter publication supabase_realtime add table public.video_messages;

-- ============================================================
-- Storage bucket for video files
-- Run this in the Supabase dashboard under Storage:
--   1. Create bucket: "video-messages" (public: yes)
--   2. Add policies:
--      - INSERT: allow all
--      - SELECT: allow all
--      - DELETE: allow if auth.uid() matches album owner
-- ============================================================
