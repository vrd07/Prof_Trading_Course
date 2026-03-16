-- 003_progress_and_quiz.sql
-- progress + quiz tables

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null,
  question_key text not null unique,
  question_text text not null,
  options jsonb not null,
  correct_index integer not null check (correct_index between 0 and 3),
  explanation text not null,
  tier text not null check (tier in ('free', 'paid')),
  "order" integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  score integer not null,
  total integer not null,
  passed boolean not null,
  answers jsonb not null,
  attempt_number integer not null default 1,
  created_at timestamptz not null default now()
);

