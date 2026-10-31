-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
create table if not exists public.site_texts (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- Only the server (secret key) reads and writes this table; the public key cannot touch it.
alter table public.site_texts enable row level security;
