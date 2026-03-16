-- 004_rls_policies.sql
-- RLS policies for all public tables.

-- users_profile
alter table public.users_profile enable row level security;

drop policy if exists users_read_own_profile on public.users_profile;
create policy users_read_own_profile on public.users_profile
  for select using (auth.uid() = id);

drop policy if exists users_update_own_profile on public.users_profile;
create policy users_update_own_profile on public.users_profile
  for update using (auth.uid() = id);

-- courses/modules/units/lessons: public read
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;

drop policy if exists courses_public_read on public.courses;
create policy courses_public_read on public.courses for select using (true);

drop policy if exists modules_public_read on public.modules;
create policy modules_public_read on public.modules for select using (true);

drop policy if exists units_public_read on public.units;
create policy units_public_read on public.units for select using (true);

drop policy if exists lessons_public_read on public.lessons;
create policy lessons_public_read on public.lessons for select using (true);

-- quiz_questions: tier-gated read
alter table public.quiz_questions enable row level security;

drop policy if exists quiz_questions_tier_gate on public.quiz_questions;
create policy quiz_questions_tier_gate on public.quiz_questions
  for select using (
    tier = 'free'
    or (
      auth.uid() is not null
      and exists (
        select 1 from public.subscriptions
        where user_id = auth.uid()
          and status = 'active'
      )
    )
  );

-- quiz_attempts: user owns rows
alter table public.quiz_attempts enable row level security;

drop policy if exists users_own_quiz_attempts on public.quiz_attempts;
create policy users_own_quiz_attempts on public.quiz_attempts
  for all using (auth.uid() = user_id);

-- user_progress: user owns rows
alter table public.user_progress enable row level security;

drop policy if exists users_own_progress on public.user_progress;
create policy users_own_progress on public.user_progress
  for all using (auth.uid() = user_id);

-- subscriptions: user can read own; only service role writes (no write policies)
alter table public.subscriptions enable row level security;

drop policy if exists users_own_subscription on public.subscriptions;
create policy users_own_subscription on public.subscriptions
  for select using (auth.uid() = user_id);

-- purchases: user can read own
alter table public.purchases enable row level security;

drop policy if exists users_own_purchases on public.purchases;
create policy users_own_purchases on public.purchases
  for select using (auth.uid() = user_id);

-- certificates: user owns rows
alter table public.certificates enable row level security;

drop policy if exists users_own_certificates on public.certificates;
create policy users_own_certificates on public.certificates
  for all using (auth.uid() = user_id);

