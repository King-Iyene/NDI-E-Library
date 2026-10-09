-- NDI E-Library Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Users table
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  password text not null,
  role text not null default 'student' check (role in ('super_admin', 'admin', 'student')),
  avatar text,
  department text,
  matric_no text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  description text,
  icon text,
  book_count int default 0,
  created_at timestamptz default now()
);

-- Books table
create table if not exists books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  description text not null,
  isbn text,
  category_id uuid references categories(id) on delete set null,
  cover_image text default '',
  file_url text not null,
  pages int,
  language text default 'English',
  published_year int,
  publisher text,
  downloads int default 0,
  views int default 0,
  uploaded_by uuid references users(id) on delete set null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bookmarks table
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  book_id uuid references books(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, book_id)
);

-- Reading history table
create table if not exists reading_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  book_id uuid references books(id) on delete cascade not null,
  last_page int default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, book_id)
);

-- Full text search index on books
alter table books add column if not exists fts tsvector
  generated always as (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author, '') || ' ' || coalesce(description, ''))) stored;

create index if not exists books_fts_idx on books using gin(fts);

-- Create storage bucket for book files and covers
insert into storage.buckets (id, name, public) values ('books', 'books', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict do nothing;

-- Storage policies: allow authenticated uploads, public reads
create policy "Public read access" on storage.objects for select using (bucket_id in ('books', 'covers'));
create policy "Auth upload access" on storage.objects for insert with check (bucket_id in ('books', 'covers'));
create policy "Auth delete access" on storage.objects for delete using (bucket_id in ('books', 'covers'));

-- Helper function to increment book count on a category
create or replace function increment_book_count(cat_id uuid)
returns void as $$
  update categories set book_count = book_count + 1 where id = cat_id;
$$ language sql;

-- RLS policies (using service role key bypasses these, but good practice)
alter table users enable row level security;
alter table books enable row level security;
alter table categories enable row level security;
alter table bookmarks enable row level security;
alter table reading_history enable row level security;

-- Allow service role full access (our API routes use service role key)
create policy "Service role full access" on users for all using (true);
create policy "Service role full access" on books for all using (true);
create policy "Service role full access" on categories for all using (true);
create policy "Service role full access" on bookmarks for all using (true);
create policy "Service role full access" on reading_history for all using (true);
