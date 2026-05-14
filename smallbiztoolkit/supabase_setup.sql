-- Run this entire script in your Supabase project:
-- Dashboard → SQL Editor → New Query → Paste → Run

-- INVOICES TABLE
create table if not exists invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  invoice_no text not null,
  biz jsonb default '{}',
  client jsonb default '{}',
  due_date date,
  items jsonb default '[]',
  note text default '',
  total numeric(10,2) default 0,
  created_at timestamptz default now(),
  unique(user_id, invoice_no)
);

-- BOOKINGS TABLE
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  biz_name text default '',
  service text default '',
  time_slot text not null,
  client_name text not null,
  client_email text default '',
  status text default 'confirmed',
  created_at timestamptz default now()
);

-- SOCIAL POSTS TABLE
create table if not exists social_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  platform text not null,
  content text not null,
  hashtags jsonb default '[]',
  topic text default '',
  biz_type text default '',
  tone text default 'professional',
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY (users can only see their own data)
alter table invoices enable row level security;
alter table bookings enable row level security;
alter table social_posts enable row level security;

-- POLICIES
create policy "Users manage own invoices" on invoices
  for all using (auth.uid() = user_id);

create policy "Users manage own bookings" on bookings
  for all using (auth.uid() = user_id);

create policy "Users manage own social posts" on social_posts
  for all using (auth.uid() = user_id);
