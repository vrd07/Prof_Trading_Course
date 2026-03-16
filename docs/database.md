# 🗄️ DATABASE SCHEMA — Complete Reference
> **Every table, every column, every relationship, every RLS policy. The authoritative database reference.**

---

## Overview

- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (`auth.users` table — managed by Supabase, not us)
- **Schema:** `public` (all our tables)
- **ORM:** None at runtime — Supabase JS client with generated TypeScript types
- **Prisma:** Used for schema documentation only (`packages/db/prisma/schema.prisma`)
- **Migrations:** Ordered SQL files in `packages/db/supabase/migrations/`

---

## Entity Relationship Overview

```
auth.users (Supabase managed)
    │
    ├──── users_profile (1:1)
    ├──── user_progress (1:many)
    ├──── quiz_attempts (1:many)
    ├──── subscriptions (1:1 active)
    ├──── purchases (1:many)
    └──── certificates (1:many)

courses
    └──── modules (1:many)
              └──── units (1:many)
                        └──── lessons (1:many)
                                  ├──── exercises (1:many)
                                  └──── quiz_questions (1:many)
                                            └──── quiz_attempts (1:many)
```

---

## Tables — Full Specification

---

### `users_profile`
Created automatically via Postgres trigger when a new `auth.users` record is inserted.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, FK → `auth.users.id` ON DELETE CASCADE | Matches Supabase auth user ID |
| `display_name` | `text` | NOT NULL | User's chosen display name |
| `avatar_url` | `text` | NULLABLE | URL to avatar image in Supabase Storage |
| `tier` | `text` | NOT NULL, DEFAULT `'free'`, CHECK IN (`'free'`, `'pro'`) | Current access tier |
| `streak_count` | `integer` | NOT NULL, DEFAULT `0` | Current daily learning streak |
| `last_active_date` | `date` | NULLABLE | Last date user completed a lesson |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Account creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Trigger to auto-create profile on signup:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users_profile (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**RLS Policies:**
```sql
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "users_read_own_profile" ON users_profile
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON users_profile
  FOR UPDATE USING (auth.uid() = id);
```

---

### `courses`
Static data — populated via seed script, rarely changes.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `slug` | `text` | NOT NULL, UNIQUE | URL slug, e.g., `'forex-mastery'` |
| `title` | `text` | NOT NULL | Course display title |
| `description` | `text` | NOT NULL | Short description for landing page |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS:** Public read access. No write access from client.
```sql
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses_public_read" ON courses FOR SELECT USING (true);
```

---

### `modules`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `course_id` | `uuid` | NOT NULL, FK → `courses.id` | |
| `slug` | `text` | NOT NULL | e.g., `'beginner'`, `'intermediate'`, `'advanced'` |
| `title` | `text` | NOT NULL | e.g., `'Beginner — Retail Forex Trader'` |
| `description` | `text` | NOT NULL | |
| `tier` | `text` | NOT NULL, CHECK IN (`'free'`, `'paid'`) | Access tier for entire module |
| `order` | `integer` | NOT NULL | Display order (1, 2, 3) |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS:** Public read access.

---

### `units`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `module_id` | `uuid` | NOT NULL, FK → `modules.id` | |
| `slug` | `text` | NOT NULL | e.g., `'unit-1-how-forex-works'` |
| `title` | `text` | NOT NULL | e.g., `'How the Forex Market Works'` |
| `order` | `integer` | NOT NULL | Display order within module |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS:** Public read access.

---

### `lessons`
Metadata only — lesson content lives in MDX files, NOT here.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `unit_id` | `uuid` | NOT NULL, FK → `units.id` | |
| `slug` | `text` | NOT NULL | e.g., `'1-1-what-is-forex'` |
| `lesson_id` | `text` | NOT NULL, UNIQUE | Human-readable ID, e.g., `'1.1'` |
| `title` | `text` | NOT NULL | |
| `tier` | `text` | NOT NULL, CHECK IN (`'free'`, `'paid'`) | |
| `estimated_minutes` | `integer` | NOT NULL | |
| `order` | `integer` | NOT NULL | Order within unit |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS:** All users can read lesson metadata. Content gating is at the middleware/MDX level.
```sql
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons_public_read" ON lessons FOR SELECT USING (true);
```

---

### `quiz_questions`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `lesson_id` | `text` | NOT NULL, FK-style → `lessons.lesson_id` | e.g., `'1.1'` |
| `question_key` | `text` | NOT NULL, UNIQUE | e.g., `'1.1.q1'` — used in MDX |
| `question_text` | `text` | NOT NULL | The question itself |
| `options` | `jsonb` | NOT NULL | Array of 4 answer option strings |
| `correct_index` | `integer` | NOT NULL, CHECK (0-3) | Index of correct answer in options array |
| `explanation` | `text` | NOT NULL | Explanation shown after answer |
| `tier` | `text` | NOT NULL, CHECK IN (`'free'`, `'paid'`) | Matches lesson tier |
| `order` | `integer` | NOT NULL | Question order within lesson |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS — THIS IS CRITICAL. Paid quiz questions are gated at DB level:**
```sql
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Free questions: everyone can read
-- Paid questions: only active subscribers
CREATE POLICY "quiz_questions_tier_gate" ON quiz_questions
  FOR SELECT USING (
    tier = 'free'
    OR (
      auth.uid() IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM subscriptions
        WHERE user_id = auth.uid()
        AND status = 'active'
      )
    )
  );
```

---

### `quiz_attempts`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users.id` | |
| `lesson_id` | `text` | NOT NULL | e.g., `'1.1'` |
| `score` | `integer` | NOT NULL | Number of correct answers (0-5) |
| `total` | `integer` | NOT NULL | Total questions (always 5) |
| `passed` | `boolean` | NOT NULL | `score >= passing_threshold` |
| `answers` | `jsonb` | NOT NULL | Array of selected answer indices |
| `attempt_number` | `integer` | NOT NULL, DEFAULT `1` | Which attempt this is (can retake) |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Unique constraint:** A user can have multiple attempts per lesson (retakes allowed).
**Index:** `(user_id, lesson_id)` for fast progress lookups.

**RLS:**
```sql
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_quiz_attempts" ON quiz_attempts
  FOR ALL USING (auth.uid() = user_id);
```

---

### `user_progress`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users.id` | |
| `lesson_id` | `text` | NOT NULL | e.g., `'1.1'` |
| `completed_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | When lesson was completed |

**Unique constraint:** `UNIQUE(user_id, lesson_id)` — a lesson can only be "completed" once.
**Index:** `(user_id)` for dashboard progress queries.

**Business rule:** A lesson is marked complete when the user passes the quiz (score ≥ 4/5).

**RLS:**
```sql
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);
```

---

### `subscriptions`
Synced from Stripe via webhook. Source of truth for access control.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, UNIQUE, FK → `auth.users.id` | One active subscription per user |
| `stripe_customer_id` | `text` | NOT NULL, UNIQUE | Stripe customer object ID |
| `stripe_subscription_id` | `text` | NULLABLE, UNIQUE | Null for lifetime purchases |
| `stripe_price_id` | `text` | NOT NULL | Which price/product was purchased |
| `plan` | `text` | NOT NULL, CHECK IN (`'monthly'`, `'annual'`, `'lifetime'`) | |
| `status` | `text` | NOT NULL, CHECK IN (`'active'`, `'cancelled'`, `'past_due'`, `'incomplete'`) | |
| `current_period_start` | `timestamptz` | NULLABLE | Null for lifetime |
| `current_period_end` | `timestamptz` | NULLABLE | Null for lifetime |
| `cancelled_at` | `timestamptz` | NULLABLE | When cancellation was requested |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS:**
```sql
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "users_own_subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can write (Stripe webhook uses service role key)
-- No INSERT/UPDATE/DELETE policy for authenticated users
```

**IMPORTANT:** The webhook handler uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS when writing subscription data. The service role key must NEVER be exposed to the client.

---

### `purchases`
Record of one-time payments and subscription payments.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users.id` | |
| `stripe_payment_intent_id` | `text` | NOT NULL, UNIQUE | |
| `stripe_customer_id` | `text` | NOT NULL | |
| `product` | `text` | NOT NULL | e.g., `'pro_lifetime'`, `'pro_monthly'` |
| `amount_cents` | `integer` | NOT NULL | Amount in smallest currency unit |
| `currency` | `text` | NOT NULL, DEFAULT `'usd'` | |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**RLS:**
```sql
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);
```

---

### `certificates`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users.id` | |
| `module_slug` | `text` | NOT NULL | e.g., `'beginner'` |
| `module_title` | `text` | NOT NULL | e.g., `'Beginner Forex Trader'` |
| `pdf_url` | `text` | NULLABLE | URL to generated PDF in Supabase Storage |
| `issued_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Unique constraint:** `UNIQUE(user_id, module_slug)` — one certificate per module per user.

**RLS:**
```sql
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_certificates" ON certificates
  FOR ALL USING (auth.uid() = user_id);
```

---

## Migration Files (in order)

```
packages/db/supabase/migrations/
├── 001_initial_schema.sql        ← courses, modules, units, lessons tables
├── 002_user_profile.sql          ← users_profile table + auto-create trigger
├── 003_progress_and_quiz.sql     ← user_progress, quiz_questions, quiz_attempts
├── 004_rls_policies.sql          ← ALL Row Level Security policies
├── 005_stripe_tables.sql         ← subscriptions, purchases tables
├── 006_certificates.sql          ← certificates table
└── 007_indexes.sql               ← Performance indexes on foreign keys
```

**Index definitions (`007_indexes.sql`):**
```sql
-- Progress lookup by user (dashboard)
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Quiz attempts by user + lesson (progress check)
CREATE INDEX idx_quiz_attempts_user_lesson ON quiz_attempts(user_id, lesson_id);

-- Subscription lookup by user (middleware paywall check — called on every request)
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Lesson lookup by slug (MDX to DB join)
CREATE INDEX idx_lessons_lesson_id ON lessons(lesson_id);
```

---

## TypeScript Type Generation

After any schema change, regenerate TypeScript types:

```bash
# From project root
pnpm --filter db run generate-types

# Which runs:
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  --schema public \
  > packages/types/src/database.ts
```

The generated `Database` type is then used to type the Supabase client:
```typescript
import type { Database } from '@trading-course/types'
const supabase = createClient<Database>(url, key)
// Now all .from() calls are fully typed
```

---

## Seed Data

```bash
# Populate dev environment with test data
pnpm run seed

# Seed creates:
# - 1 course record
# - 3 module records (beginner, intermediate, advanced)
# - 15 unit records
# - 88 lesson records
# - All quiz questions for Unit 1 (28 questions for lessons 1.1-1.5)
# - 2 test users: free@test.com / pro@test.com (password: test1234)
```

---

## Common Query Patterns

```typescript
// Get user's completed lessons for progress bar
const { data } = await supabase
  .from('user_progress')
  .select('lesson_id')
  .eq('user_id', userId)

// Check if user has active subscription (paywall)
const { data } = await supabase
  .from('subscriptions')
  .select('status, plan')
  .eq('user_id', userId)
  .eq('status', 'active')
  .maybeSingle()  // Returns null if not found (not an error)

// Get quiz questions for a lesson
const { data } = await supabase
  .from('quiz_questions')
  .select('*')
  .eq('lesson_id', '1.1')
  .order('order', { ascending: true })

// Upsert lesson completion (idempotent)
await supabase
  .from('user_progress')
  .upsert(
    { user_id: userId, lesson_id: lessonId },
    { onConflict: 'user_id,lesson_id' }
  )
```

---

*Last updated: Phase 0*
*Run `pnpm run generate-types` after any schema change*