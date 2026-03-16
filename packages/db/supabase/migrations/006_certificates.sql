-- 006_certificates.sql

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_slug text not null,
  module_title text not null,
  pdf_url text null,
  issued_at timestamptz not null default now(),
  unique(user_id, module_slug)
);

