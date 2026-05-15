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

-- BOOKING PAGES TABLE (one per business, holds slots config)
create table if not exists booking_pages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  slug text not null unique,
  biz_name text default '',
  service text default '',
  slots jsonb default '[]',
  created_at timestamptz default now()
);

-- BOOKINGS TABLE (client bookings, linked to booking_page)
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  booking_page_id uuid references booking_pages(id) on delete cascade,
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

-- ROW LEVEL SECURITY
alter table invoices enable row level security;
alter table booking_pages enable row level security;
alter table bookings enable row level security;
alter table social_posts enable row level security;

-- POLICIES: owners manage their own data
create policy "Users manage own invoices" on invoices
  for all using (auth.uid() = user_id);

create policy "Users manage own booking pages" on booking_pages
  for all using (auth.uid() = user_id);

-- Bookings: owners can manage, public can INSERT (for client bookings) and SELECT their page's bookings
create policy "Users manage own bookings" on bookings
  for all using (auth.uid() = user_id);

create policy "Public can book" on bookings
  for insert with check (true);

-- Booking pages are publicly readable (needed for the public booking form)
create policy "Public can view booking pages" on booking_pages
  for select using (true);

-- Public can view bookings to check which slots are taken
create policy "Public can view bookings for a page" on bookings
  for select using (true);

create policy "Users manage own social posts" on social_posts
  for all using (auth.uid() = user_id);
