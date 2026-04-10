-- ============================================================
-- Migration: Create promotions table
-- Date: 2026-04-10
-- ============================================================

-- Promotions table — one row per offer
create table if not exists public.promotions (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,                              -- e.g. "April Specials"
  description   text,                                       -- optional longer description
  condition     text not null,                              -- e.g. "1st 10 customers"
  reward        text not null,                              -- e.g. "Negombo city tour by TUK TUK"
  display_order integer not null default 0,                 -- controls sort order on the page
  is_active     boolean not null default true,              -- toggle visibility
  valid_from    date,                                       -- optional start date
  valid_until   date,                                       -- optional end date
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast public queries
create index if not exists idx_promotions_active
  on public.promotions (is_active, display_order);

-- --------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------
alter table public.promotions enable row level security;

-- Anyone can read active promotions
create policy "Public can read active promotions"
  on public.promotions
  for select
  using (is_active = true);

-- Admins can do everything
create policy "Admins full access to promotions"
  on public.promotions
  for all
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    )
  );

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Only create trigger if it doesn't already exist
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'promotions_updated_at'
  ) then
    create trigger promotions_updated_at
      before update on public.promotions
      for each row execute function public.set_updated_at();
  end if;
end;
$$;

-- --------------------------------------------------------
-- Seed data — April promotions
-- --------------------------------------------------------
insert into public.promotions (title, condition, reward, display_order, valid_from, valid_until)
values
  ('April Specials', '1st 10 customers',           'Negombo city tour by TUK TUK',   1, '2026-04-01', '2026-04-30'),
  ('April Specials', '2 nights stay',              'Airport drop FOC',                2, '2026-04-01', '2026-04-30'),
  ('April Specials', '3 nights stay',              'Pick up & drop FOC',              3, '2026-04-01', '2026-04-30'),
  ('April Specials', '6 pax or above',             'Lagoon boat tour free',           4, '2026-04-01', '2026-04-30'),
  ('April Specials', '5 nights stay',              '1 night free',                    5, '2026-04-01', '2026-04-30'),
  ('April Specials', '7 nights stay',              '2 nights free',                   6, '2026-04-01', '2026-04-30');
