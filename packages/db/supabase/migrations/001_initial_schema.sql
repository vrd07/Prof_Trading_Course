-- 001_initial_schema.sql
-- Core course metadata tables (content still lives in MDX).

create extension if not exists "pgcrypto";

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  description text not null,
  tier text not null check (tier in ('free', 'paid')),
  "order" integer not null,
  created_at timestamptz not null default now(),
  unique(course_id, slug)
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  "order" integer not null,
  created_at timestamptz not null default now(),
  unique(module_id, slug)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  slug text not null,
  lesson_id text not null unique,
  title text not null,
  tier text not null check (tier in ('free', 'paid')),
  estimated_minutes integer not null,
  "order" integer not null,
  created_at timestamptz not null default now(),
  unique(unit_id, slug)
);

