-- 005_stripe_tables.sql
-- subscriptions + purchases

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  stripe_subscription_id text null unique,
  stripe_price_id text not null,
  plan text not null check (plan in ('monthly', 'annual', 'lifetime')),
  status text not null check (status in ('active', 'cancelled', 'past_due', 'incomplete')),
  current_period_start timestamptz null,
  current_period_end timestamptz null,
  cancelled_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_payment_intent_id text not null unique,
  stripe_customer_id text not null,
  product text not null,
  amount_cents integer not null,
  currency text not null default 'usd',
  created_at timestamptz not null default now()
);

