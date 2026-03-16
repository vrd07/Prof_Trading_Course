# 🧭 PROJECT INTRO — Trading Course Platform
> **Read this first. This is the single source of truth for what we are building, why, and how.**

---

## What This Project Is

This is a **full-stack, interactive Forex trading education platform** — built in the spirit of Brilliant.org's "learn by doing" philosophy, applied entirely to Forex and quantitative trading.

It is not a video course. It is not a PDF library. It is a **web application** where every concept is taught through animated visualisations, interactive exercises, and knowledge-gated quizzes — all inside the browser, no plugins, no downloads.

The course covers three tiers of trading education:
- **Beginner (Retail Forex Trader)** — free, 28 lessons across 5 units
- **Intermediate (Semi-Professional)** — paid, 30 lessons across 5 units
- **Advanced (Institutional & Quant)** — paid, 30 lessons across 5 units

**Total: 88 lessons, 15 units, ~16.5 hours of structured learning.**

The platform monetises via a **freemium model**: the entire Beginner module is free to access after signup. Intermediate and Advanced require a paid subscription or one-time lifetime purchase, handled through Stripe.

---

## Business Context

| Item | Detail |
|---|---|
| **Market** | Global retail Forex traders (~10–15 million active worldwide) |
| **Positioning** | Premium interactive course — not another YouTube channel or PDF |
| **Monetisation** | Freemium: free beginner, paid intermediate + advanced |
| **Pricing (planned)** | $29/month · $199/year · $349 lifetime |
| **Revenue model** | Stripe subscriptions + one-time purchases |
| **Target launch** | No fixed deadline — quality over speed |
| **Infrastructure cost** | ~$10/year (domain only — all services on free tiers) |

---

## The Core User Experience

A student lands on the platform, signs up for free, and immediately begins Lesson 1.1. Every lesson follows this structure:

```
1. Concept introduction (prose with contextual examples)
2. Animation checkpoint (GSAP / D3 visualisation — auto-plays on scroll)
3. More concept depth (building on the animation)
4. Interactive exercise (drag-drop, chart drawing, code editor)
5. Key takeaways
6. Quiz (5 MCQ questions — must score 4/5 to unlock next lesson)
7. Lesson complete → progress saved → next lesson unlocked
```

When a student hits a paid lesson without a subscription, a paywall overlay appears with an upgrade prompt. They never see broken content — they see a clean gate.

The entire experience is **mobile-responsive**, **dark-themed**, and built to feel like a premium product — not a cheap course site.

---

## What Makes This Different From a Standard Course Site

| Standard Course Site | This Platform |
|---|---|
| Video lectures | Animated, interactive SVG/D3 visualisations |
| PDF downloads | In-browser interactive exercises |
| Static quizzes | Progress-gated quizzes with animated feedback |
| WordPress / Teachable | Custom-built Next.js application |
| No coding exercises | Python-in-browser via Pyodide + Monaco Editor |
| Generic design | Purpose-built design system for trading education |

---

## Monorepo Structure (Top Level)

```
trading-course/
├── apps/
│   ├── web/        ← Next.js 14 — main frontend + API routes (PRIMARY APP)
│   └── admin/      ← Admin dashboard (Phase 4, not a priority now)
├── packages/
│   ├── ui/         ← Shared component library (shadcn/ui base)
│   ├── db/         ← Prisma schema + Supabase client + typed queries
│   └── types/      ← Shared TypeScript types across all apps
├── content/        ← All 88 MDX lesson files (Git-based CMS)
├── scripts/        ← Dev tooling (seed, generate types, validate content)
├── docs/           ← Planning documents (PRD, schema, API spec, storyboards)
├── turbo.json      ← Turborepo pipeline config
└── pnpm-workspace.yaml
```

---

## Phase We Are Currently In

**Phase 0 — Content & Design (no code yet)**

Completed so far:
- ✅ Full curriculum map (all 88 lessons titled and structured)
- ✅ Lessons 1.1, 1.2, 1.3 written in full (content, exercises, quizzes, animation briefs)
- ✅ Complete monorepo schema documented
- ✅ Tech stack finalised

In progress:
- 📝 Writing remaining Unit 1 lessons (1.4 and 1.5)
- 📝 Design system document
- 📝 User flow diagrams
- 📝 Database schema document
- 📝 Animation storyboards

**Phase 1 begins when Phase 0 content is complete.** Do not write application code until Phase 0 deliverables are done. The content and architecture decisions made in Phase 0 directly determine how Phase 1 is built.

---

## Key Constraints & Non-Negotiables

1. **TypeScript everywhere** — no JavaScript files in the codebase, ever
2. **Content lives in MDX** — lesson text is never stored in the database
3. **Two-layer content gating** — middleware (route level) AND Supabase RLS (database level)
4. **D3 for math/computation only** — never let D3 touch the DOM directly; React renders all SVG
5. **Pyodide for Python exercises** — Python runs in-browser via WebAssembly, zero backend
6. **No admin-required content updates** — adding a new lesson = adding an MDX file + git push
7. **Mobile-first** — every component must be tested at 375px width before desktop
8. **Free tier hosting** — Vercel + Supabase free tiers must be sufficient until revenue justifies upgrade

---

## Cursor-Specific Instructions

When working on this project in Cursor, follow these rules:

- **Always read `tech_stack.md` before touching any configuration or dependency**
- **Always read `skills.md` before building any component or feature**
- **Never install a package not listed in `tech_stack.md` without explicit discussion first**
- **File naming: kebab-case for files, PascalCase for React components**
- **Every component must be typed — no `any`, no implicit returns without type annotation**
- **Commits must be atomic and descriptive** — one concern per commit
- **Before creating a new component, check `packages/ui/` — it may already exist**
- **Environment variables must be added to `.env.example` at the same time they are used**

---

## The Three Files You Must Read Before Writing Any Code

| File | What It Contains |
|---|---|
| `intro.md` (this file) | Project purpose, context, phase status, constraints |
| `tech_stack.md` | Every technology choice, version, config pattern, and reasoning |
| `skills.md` | How to build each type of feature — component patterns, animation patterns, data patterns |

---

## Contacts & Services

| Service | Purpose | Account needed |
|---|---|---|
| Vercel | Frontend hosting + preview deploys | Free account |
| Supabase | PostgreSQL + Auth + Storage | Free account |
| Stripe | Payments + webhooks | Free account (pay per transaction) |
| Resend | Transactional email | Free account (3k emails/month) |
| GitHub | Source control + CI/CD | Free account |
| Namecheap / Cloudflare | Domain registration | ~$10/year |

---

*Last updated: Phase 0 — Pre-build planning stage*
*Maintained by: Project owner + Cursor AI pair*