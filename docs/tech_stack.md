# 🛠️ TECH STACK — Complete Technology Reference
> **The authoritative record of every technology choice in this project. Read before installing anything.**

---

## Stack Overview

```
Browser → Next.js 14 (App Router) → Supabase (Postgres + Auth) → Stripe (Payments)
                    ↓
            Vercel (Hosting)
                    ↓
          GitHub Actions (CI/CD)
```

---

## Monorepo Tooling

| Tool | Version | Purpose | Config file |
|---|---|---|---|
| **Turborepo** | latest | Monorepo task runner — parallel builds, caching | `turbo.json` |
| **pnpm** | 8.x | Package manager with workspace support | `pnpm-workspace.yaml` |
| **TypeScript** | 5.x | Type safety across entire codebase | `tsconfig.json` (root + per-app) |
| **ESLint** | 8.x | Linting — extended with Next.js + TypeScript rules | `.eslintrc.js` |
| **Prettier** | 3.x | Code formatting | `.prettierrc` |

### `turbo.json` Pipeline Pattern
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": {}
  }
}
```

### `pnpm-workspace.yaml` Pattern
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## Frontend — `apps/web`

### Core Framework

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.x (App Router) | React framework — RSC, streaming, file-based routing, API routes |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |

**Critical Next.js config decisions:**
- Use **App Router only** — no Pages Router, no mixing
- Use **Server Components by default** — only add `'use client'` when component needs browser APIs, event handlers, or hooks
- Use **Route Groups** for layout isolation: `(marketing)`, `(auth)`, `(dashboard)`, `(course)`
- Dynamic lesson routes: `app/(course)/learn/[module]/[unit]/[lesson]/page.tsx`

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
}

export default nextConfig
```

---

### Styling

| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 3.x | Utility-first styling |
| **CSS Variables** | — | Design tokens (colors, spacing, radius) |
| **tailwind-merge** | latest | Merge conflicting Tailwind classes safely |
| **clsx** | latest | Conditional className construction |

**Tailwind config extends with design tokens:**
```typescript
// tailwind.config.ts
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // All colors via CSS variables — supports dark mode
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        // ... full token set in DESIGN_SYSTEM.md
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
    },
  },
}
```

**Always use the `cn()` utility for classNames:**
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

### UI Components

| Technology | Version | Purpose |
|---|---|---|
| **shadcn/ui** | latest | Unstyled, composable base components — you own the code |
| **Radix UI** | latest | Accessible primitives (used by shadcn under the hood) |
| **Lucide React** | latest | Icon library |

**shadcn/ui install pattern:**
```bash
pnpx shadcn-ui@latest add button card dialog tabs badge
```
Components are added to `packages/ui/src/components/` — shared across all apps.

---

### Animation Stack

This is the most important part of the tech stack. Three tools, each with a distinct role:

#### 1. Framer Motion — UI transitions and micro-interactions
```typescript
// Use for: page transitions, component mount/unmount, hover states, list animations
import { motion, AnimatePresence } from 'framer-motion'

// Standard lesson section reveal pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
```

#### 2. GSAP (GreenSock) — Complex multi-step concept animations
```typescript
// Use for: sequenced concept explainers, timeline-based animations,
// stop hunt animations, Wyckoff schematic, liquidity sweeps
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Standard GSAP timeline pattern for concept animations
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top 70%',
    toggleActions: 'play none none reverse',
  }
})
tl.from('.tier-1', { opacity: 0, y: -20, duration: 0.5 })
  .from('.tier-2', { opacity: 0, y: -20, duration: 0.5 }, '-=0.2')
  .from('.tier-3', { opacity: 0, y: -20, duration: 0.5 }, '-=0.2')
```

**IMPORTANT:** GSAP free tier is used. Do not use GSAP Club plugins (SplitText, MorphSVG, DrawSVG) — they require a paid licence.

#### 3. D3.js — Data visualisation and chart mathematics
```typescript
// Use for: candlestick charts, moving averages, RSI oscillators,
// Fibonacci levels, volume bars, support/resistance lines

// CRITICAL RULE: D3 computes, React renders.
// Never use d3.select() to touch the DOM directly in React.
// Use D3 for: scales, path generators, axis ticks, data transforms
// Use React state + JSX to render the actual SVG elements

import * as d3 from 'd3'

// Correct pattern:
const xScale = d3.scaleTime().domain([startDate, endDate]).range([0, width])
const yScale = d3.scaleLinear().domain([minPrice, maxPrice]).range([height, 0])

// Then render via React:
return (
  <svg width={width} height={height}>
    {candleData.map(candle => (
      <rect
        key={candle.timestamp}
        x={xScale(candle.timestamp)}
        y={yScale(candle.high)}
        // ...
      />
    ))}
  </svg>
)
```

#### 4. Lottie — Pre-built animated illustrations
```typescript
// Use for: quiz success animations, loading states, onboarding illustrations
import Lottie from 'lottie-react'
import quizSuccessAnimation from '@/public/lottie/quiz-success.json'

<Lottie animationData={quizSuccessAnimation} loop={false} />
```
Lottie files are sourced from LottieFiles.com (free tier).

---

### MDX — Lesson Content Rendering

| Technology | Version | Purpose |
|---|---|---|
| **next-mdx-remote** | 4.x | Parse and render MDX files as React components |
| **gray-matter** | 4.x | Parse MDX frontmatter (YAML metadata) |
| **remark-gfm** | 3.x | GitHub Flavored Markdown support in MDX |
| **rehype-pretty-code** | latest | Syntax highlighting for code blocks |
| **KaTeX** | latest | Render LaTeX math formulas |
| **react-katex** | latest | KaTeX in React components |

**MDX rendering pattern:**
```typescript
// lib/mdx/loader.ts
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import fs from 'fs'
import path from 'path'

export async function getLessonContent(module: string, unit: string, lesson: string) {
  const filePath = path.join(process.cwd(), 'content', module, unit, `${lesson}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { content, data: frontmatter } = matter(raw)

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrettyCode],
    },
    scope: frontmatter,
  })

  return { mdxSource, frontmatter }
}
```

**MDX component mapping — every custom tag in lessons:**
```typescript
// lib/mdx/components.ts
import { AnimatedCandlestickChart } from '@/components/animations/charts/AnimatedCandlestickChart'
import { GlobalFlowMap } from '@/components/animations/concepts/GlobalFlowMap'
import { MarketHierarchyPyramid } from '@/components/animations/concepts/MarketHierarchyPyramid'
import { StopHuntSequence } from '@/components/animations/concepts/StopHuntSequence'
import { PairAnatomyDissection } from '@/components/animations/concepts/PairAnatomyDissection'
import { QuizBlock } from '@/components/quiz/QuizBlock'
import { InteractiveExercise } from '@/components/exercises/InteractiveExercise'
import { FormulaReveal } from '@/components/animations/formulas/FormulaReveal'

export const mdxComponents = {
  AnimatedCandlestickChart,
  GlobalFlowMap,
  MarketHierarchyPyramid,
  StopHuntSequence,
  PairAnatomyDissection,
  QuizBlock,
  InteractiveExercise,
  FormulaReveal,
  // Add every new animation component here
}
```

---

### Python-in-Browser (Algorithm Unit)

| Technology | Purpose |
|---|---|
| **Pyodide** | CPython compiled to WebAssembly — runs Python in the browser |
| **Monaco Editor** | VS Code editor engine — code editor for Python exercises |
| **@monaco-editor/react** | React wrapper for Monaco |

```typescript
// Pattern for Python exercise component
'use client'
import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'

export function PythonExercise({ starterCode, testCode }: PythonExerciseProps) {
  const [pyodide, setPyodide] = useState<any>(null)
  const [output, setOutput] = useState('')

  useEffect(() => {
    // Load Pyodide lazily — it's large (10MB+)
    const loadPyodide = async () => {
      const pyodideInstance = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      })
      await pyodideInstance.loadPackage(['numpy', 'pandas'])
      setPyodide(pyodideInstance)
    }
    loadPyodide()
  }, [])

  const runCode = async (code: string) => {
    if (!pyodide) return
    try {
      const result = await pyodide.runPythonAsync(code)
      setOutput(String(result))
    } catch (err: any) {
      setOutput(`Error: ${err.message}`)
    }
  }
  // ...
}
```

---

### State Management

| Technology | Purpose | When to use |
|---|---|---|
| **Zustand** | Global client state | User session, lesson progress cache, quiz state |
| **TanStack Query** | Server state + caching | All Supabase data fetching |
| **React Context** | Scoped state | Theme, locale — small, infrequent updates only |
| **useState / useReducer** | Local component state | Everything that doesn't need to be shared |

**Zustand store pattern:**
```typescript
// store/useProgressStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressStore {
  completedLessons: Set<string>
  markComplete: (lessonId: string) => void
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      completedLessons: new Set(),
      markComplete: (lessonId) =>
        set((state) => ({
          completedLessons: new Set([...state.completedLessons, lessonId]),
        })),
    }),
    { name: 'lesson-progress' }
  )
)
```

---

### Forms & Validation

| Technology | Purpose |
|---|---|
| **React Hook Form** | Form state management, no re-renders on keypress |
| **Zod** | Schema validation — shared between client and server |

```typescript
// Pattern — always define schema in packages/types, use on both sides
import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export type SignupFormData = z.infer<typeof signupSchema>
```

---

## Backend — Supabase

| Service | Free Tier Limits | What We Use It For |
|---|---|---|
| **PostgreSQL** | 500MB storage | All application data |
| **Auth** | Unlimited users | Email + Google OAuth |
| **Storage** | 1GB | User avatars, certificate PDFs |
| **Edge Functions** | 500k invocations/month | Not currently needed |
| **Realtime** | 200 concurrent connections | Not currently needed |

### Supabase Client Setup

```typescript
// packages/db/src/client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@trading-course/types'

// Browser client — for client components
export const createBrowserClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Server client — for RSC, API routes, middleware
export const createServerClient = (cookieStore: any) =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key) => cookieStore.get(key)?.value ?? null,
          setItem: () => {},
          removeItem: () => {},
        },
      },
    }
  )
```

### Row Level Security (RLS) — Content Gating

This is the second layer of content protection (after middleware). Every paid content table must have RLS enabled.

```sql
-- 002_rls_policies.sql

-- Users can only read their own progress
CREATE POLICY "users_own_progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Paid lesson content gate — only pro users can read paid lessons
-- (lesson tier stored in MDX frontmatter, not DB — this gates exercise/quiz data)
CREATE POLICY "paid_quiz_gate" ON quiz_questions
  FOR SELECT USING (
    tier = 'free'
    OR EXISTS (
      SELECT 1 FROM subscriptions
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

-- Users can only see their own subscription data
CREATE POLICY "own_subscription" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);
```

### Database Tables

```sql
-- Full schema in packages/db/prisma/schema.prisma
-- Key tables:

users_profile        -- id (uuid, FK auth.users), display_name, avatar_url, tier, created_at
courses              -- id, slug, title, description
modules              -- id, course_id, slug, title, tier (free/paid), order
units                -- id, module_id, slug, title, order
lessons              -- id, unit_id, slug, title, tier, estimated_minutes, order
exercises            -- id, lesson_id, type, config (jsonb), order
quiz_questions       -- id, lesson_id, question, options (jsonb), correct_index, explanation, tier
quiz_attempts        -- id, user_id, lesson_id, score, passed, answers (jsonb), created_at
user_progress        -- id, user_id, lesson_id, completed_at (unique: user_id + lesson_id)
subscriptions        -- id, user_id, stripe_customer_id, stripe_subscription_id, tier, status
purchases            -- id, user_id, stripe_payment_intent_id, product, amount, created_at
certificates         -- id, user_id, module_id, issued_at, pdf_url
```

---

## Payments — Stripe

| Item | Detail |
|---|---|
| **Library** | `stripe` (Node.js SDK) |
| **Integration** | Stripe Checkout (hosted page — no PCI compliance needed) |
| **Monthly price ID** | Set in `.env` as `STRIPE_PRICE_MONTHLY` |
| **Annual price ID** | Set in `.env` as `STRIPE_PRICE_ANNUAL` |
| **Lifetime price ID** | Set in `.env` as `STRIPE_PRICE_LIFETIME` |

### Webhook Events Handled

```typescript
// api/stripe/webhook/route.ts
switch (event.type) {
  case 'checkout.session.completed':
    // New purchase — set user tier to 'pro' in Supabase
    break
  case 'customer.subscription.updated':
    // Plan changed — update subscription record
    break
  case 'customer.subscription.deleted':
    // Cancelled — downgrade user to 'free'
    break
  case 'invoice.payment_failed':
    // Payment failed — flag subscription, send email via Resend
    break
}
```

### Checkout Session Pattern

```typescript
// api/stripe/checkout/route.ts
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { priceId, userId } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: priceId === process.env.STRIPE_PRICE_LIFETIME ? 'payment' : 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/upgrade`,
    metadata: { userId },  // ← Critical: used in webhook to identify user
    customer_email: userEmail,
  })

  return Response.json({ url: session.url })
}
```

---

## Auth — Supabase Auth

| Provider | Status |
|---|---|
| Email + Password | ✅ Enabled |
| Google OAuth | ✅ Enabled |
| GitHub OAuth | Optional (good for devs) |

### Auth Flow

```
User signs up → Supabase creates auth.users record
                → Postgres trigger creates users_profile record
                → Redirect to /dashboard

User logs in  → Supabase session set in cookie
               → middleware.ts reads session on every request
               → Refreshes session automatically via Supabase middleware helper
```

### Middleware Auth Guard

```typescript
// app/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session — MUST happen on every middleware call
  const { data: { session } } = await supabase.auth.getSession()

  // Protect authenticated routes
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard')
    || req.nextUrl.pathname.startsWith('/learn')

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Paywall check for paid lessons
  if (req.nextUrl.pathname.startsWith('/learn')) {
    const lessonMeta = getLessonMetaFromPath(req.nextUrl.pathname)
    if (lessonMeta?.tier === 'paid') {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', session?.user.id)
        .single()

      if (!sub || sub.status !== 'active') {
        return NextResponse.redirect(new URL('/upgrade', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*', '/profile/:path*'],
}
```

---

## Email — Resend

| Item | Detail |
|---|---|
| **Free tier** | 3,000 emails/month |
| **Library** | `resend` npm package |
| **Templates** | React Email components |

```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// Triggered from Stripe webhook on successful purchase
await resend.emails.send({
  from: 'trading@yourdomain.com',
  to: userEmail,
  subject: 'Welcome to Pro — your access is now active',
  react: <PurchaseConfirmationEmail userName={name} />,
})
```

---

## Hosting & CI/CD

### Vercel (Frontend)

```
Free tier includes:
- 100GB bandwidth/month
- Unlimited preview deployments
- Automatic HTTPS
- Edge network
- Vercel Analytics (basic)
```

**Deployment config:**
- `main` branch → production deployment
- All other branches → preview deployment (unique URL per PR)
- Environment variables set in Vercel dashboard (not committed)

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint typecheck
```

---

## Environment Variables

```bash
# .env.example — all variables required, no secrets committed

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Server-only — never expose to client

# Stripe
STRIPE_SECRET_KEY=                # Server-only
STRIPE_WEBHOOK_SECRET=            # Server-only
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_ANNUAL=
STRIPE_PRICE_LIFETIME=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_URL=http://localhost:3000   # Production: https://yourdomain.com

# Email
RESEND_API_KEY=                   # Server-only

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
```

**Rules:**
- Variables prefixed `NEXT_PUBLIC_` are exposed to the browser — never put secrets there
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — only use in trusted server contexts, never client
- All variables must be documented in `.env.example` at the time they are added

---

## Package Versions Reference

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@supabase/supabase-js": "2.x",
    "@supabase/auth-helpers-nextjs": "0.x",
    "stripe": "14.x",
    "resend": "2.x",
    "next-mdx-remote": "4.x",
    "gray-matter": "4.x",
    "framer-motion": "11.x",
    "gsap": "3.x",
    "d3": "7.x",
    "@monaco-editor/react": "4.x",
    "lottie-react": "2.x",
    "react-katex": "3.x",
    "katex": "0.x",
    "zustand": "4.x",
    "@tanstack/react-query": "5.x",
    "react-hook-form": "7.x",
    "zod": "3.x",
    "clsx": "2.x",
    "tailwind-merge": "2.x",
    "lucide-react": "latest",
    "remark-gfm": "3.x",
    "rehype-pretty-code": "latest"
  },
  "devDependencies": {
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "eslint": "8.x",
    "prettier": "3.x",
    "turbo": "latest"
  }
}
```

---

## What Is Explicitly NOT Used

| Technology | Reason Not Used |
|---|---|
| Pages Router | App Router is the current Next.js standard |
| Redux / Redux Toolkit | Zustand is simpler, sufficient for this use case |
| Prisma (runtime) | Supabase JS client used directly — Prisma schema kept for documentation only |
| Firebase | Supabase is the open-source, Postgres-based alternative |
| GraphQL | REST via Supabase is sufficient — no need for GraphQL complexity |
| tRPC | Adds complexity without meaningful benefit at this scale |
| Contentful / Sanity (CMS) | MDX + Git is simpler, version-controlled, free |
| Docker | Not needed — Vercel + Supabase handle all environments |
| Jest / Vitest | Testing in Phase 3+ — not a priority during content build |

---

*Last updated: Phase 0 — Pre-build*
*Next review: Phase 1 kickoff*