# 📁 FILE STRUCTURE — Where Everything Lives
> **The exact location of every file type in this project. Before creating any file, check here first.**

---

## Rule: When in Doubt, Ask
If you're unsure where a file belongs, re-read this document. If it's still not clear, ask rather than guessing. A file in the wrong location is harder to fix than a 30-second question.

---

## Full Directory Map With Ownership

```
trading-course/                          ← Monorepo root
│
├── .cursorrules                         ← Cursor AI rules (symlink to docs/cursor_rules.md)
│
├── .github/
│   └── workflows/
│       ├── ci.yml                       ← Lint + typecheck on every push/PR
│       ├── deploy-preview.yml           ← Vercel preview deploy on PR
│       └── migrate.yml                  ← Run DB migrations on merge to main
│
├── apps/
│   ├── web/                             ← PRIMARY APP — Next.js 14
│   │   │
│   │   ├── app/                         ← Next.js App Router
│   │   │   │
│   │   │   ├── (marketing)/             ← Public pages, no auth needed
│   │   │   │   ├── layout.tsx           ← Marketing layout (Navbar + Footer)
│   │   │   │   ├── page.tsx             ← Landing page /
│   │   │   │   ├── about/page.tsx       ← /about
│   │   │   │   ├── pricing/page.tsx     ← /pricing
│   │   │   │   └── blog/
│   │   │   │       ├── page.tsx         ← /blog (post index)
│   │   │   │       └── [slug]/page.tsx  ← /blog/[slug] (individual post)
│   │   │   │
│   │   │   ├── (auth)/                  ← Auth pages — centered card layout
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/page.tsx       ← /login
│   │   │   │   ├── signup/page.tsx      ← /signup
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   └── reset-password/page.tsx
│   │   │   │
│   │   │   ├── (dashboard)/             ← Authenticated user area
│   │   │   │   ├── layout.tsx           ← Dashboard layout (sidebar + topbar)
│   │   │   │   ├── dashboard/page.tsx   ← /dashboard (main hub)
│   │   │   │   ├── profile/page.tsx     ← /profile
│   │   │   │   └── certificates/page.tsx ← /certificates
│   │   │   │
│   │   │   ├── (course)/                ← Course content area
│   │   │   │   ├── layout.tsx           ← Course layout (lesson sidebar + progress)
│   │   │   │   ├── learn/
│   │   │   │   │   ├── page.tsx         ← /learn (all modules overview)
│   │   │   │   │   └── [module]/
│   │   │   │   │       ├── page.tsx     ← /learn/beginner (module overview)
│   │   │   │   │       └── [unit]/
│   │   │   │   │           ├── page.tsx ← /learn/beginner/unit-1 (unit overview)
│   │   │   │   │           └── [lesson]/
│   │   │   │   │               └── page.tsx ← /learn/beginner/unit-1/1-1 (THE lesson page)
│   │   │   │   └── upgrade/page.tsx     ← /upgrade (paywall)
│   │   │   │
│   │   │   ├── api/                     ← Server-side API routes
│   │   │   │   ├── auth/
│   │   │   │   │   └── callback/route.ts     ← Supabase OAuth callback
│   │   │   │   ├── stripe/
│   │   │   │   │   ├── checkout/route.ts     ← POST: create checkout session
│   │   │   │   │   ├── portal/route.ts       ← POST: customer portal session
│   │   │   │   │   └── webhook/route.ts      ← POST: Stripe webhook handler
│   │   │   │   ├── progress/
│   │   │   │   │   ├── route.ts              ← GET: fetch user progress
│   │   │   │   │   └── complete/route.ts     ← POST: mark lesson complete
│   │   │   │   ├── quiz/
│   │   │   │   │   ├── route.ts              ← GET: fetch quiz questions
│   │   │   │   │   └── submit/route.ts       ← POST: submit quiz answers
│   │   │   │   ├── profile/route.ts          ← GET + PATCH: user profile
│   │   │   │   └── certificates/
│   │   │   │       ├── route.ts              ← GET: list certificates
│   │   │   │       └── generate/route.ts     ← POST: generate PDF certificate
│   │   │   │
│   │   │   ├── middleware.ts            ← Auth guard + paywall check (CRITICAL)
│   │   │   ├── layout.tsx               ← Root layout (fonts, providers, metadata)
│   │   │   ├── not-found.tsx            ← Custom 404
│   │   │   ├── error.tsx                ← Global error boundary
│   │   │   └── loading.tsx              ← Global loading state
│   │   │
│   │   ├── components/                  ← App-specific React components
│   │   │   │
│   │   │   ├── animations/              ← ALL animation components live here
│   │   │   │   ├── charts/              ← D3 + React chart animations
│   │   │   │   │   ├── AnimatedCandlestickChart.tsx
│   │   │   │   │   ├── MovingAverageOverlay.tsx
│   │   │   │   │   ├── SupportResistanceDraw.tsx
│   │   │   │   │   ├── FibonacciOverlay.tsx
│   │   │   │   │   ├── BollingerBandBreath.tsx
│   │   │   │   │   ├── RSIOscillator.tsx
│   │   │   │   │   ├── MACDHistogram.tsx
│   │   │   │   │   └── VolumeBarChart.tsx
│   │   │   │   │
│   │   │   │   ├── concepts/            ← GSAP timeline concept explainers
│   │   │   │   │   ├── GlobalFlowMap.tsx          ← Lesson 1.1
│   │   │   │   │   ├── MarketHierarchyPyramid.tsx  ← Lesson 1.2
│   │   │   │   │   ├── StopHuntSequence.tsx        ← Lesson 1.2
│   │   │   │   │   ├── TradeMechanicDemo.tsx       ← Lesson 1.1
│   │   │   │   │   ├── PairAnatomyDissection.tsx   ← Lesson 1.3
│   │   │   │   │   ├── PairsSolarSystem.tsx        ← Lesson 1.3
│   │   │   │   │   ├── SessionClockAnimation.tsx   ← Lesson 1.5
│   │   │   │   │   ├── WyckoffSchematic.tsx        ← Unit 6
│   │   │   │   │   ├── LiquiditySweepAnimation.tsx ← Unit 7
│   │   │   │   │   ├── OrderBlockHighlight.tsx     ← Unit 7
│   │   │   │   │   ├── FairValueGapForm.tsx        ← Unit 7
│   │   │   │   │   └── TopDownZoomAnimation.tsx    ← Unit 8
│   │   │   │   │
│   │   │   │   └── formulas/            ← KaTeX formula animations
│   │   │   │       ├── FormulaReveal.tsx
│   │   │   │       ├── RiskRewardVisualizer.tsx
│   │   │   │       ├── PipValueCalculator.tsx
│   │   │   │       └── KellyCriterionBreakdown.tsx
│   │   │   │
│   │   │   ├── exercises/               ← Interactive exercise components
│   │   │   │   ├── DragDropExercise.tsx      ← Generic drag-and-drop base
│   │   │   │   ├── TrendlineDrawer.tsx       ← Draw trendlines on chart
│   │   │   │   ├── PatternIdentifier.tsx     ← Click-to-identify patterns
│   │   │   │   ├── SRLevelPlacer.tsx         ← Place support/resistance lines
│   │   │   │   ├── RiskCalculatorEx.tsx      ← Interactive R:R calculator
│   │   │   │   ├── PythonExercise.tsx        ← Monaco + Pyodide
│   │   │   │   ├── MatchTheDriver.tsx        ← Lesson 1.1 exercise
│   │   │   │   ├── WhosBehindTheMove.tsx     ← Lesson 1.2 exercise
│   │   │   │   └── DecodeTheQuote.tsx        ← Lesson 1.3 exercise
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── QuizBlock.tsx             ← Main quiz container (embedded in MDX)
│   │   │   │   ├── QuizQuestion.tsx          ← Single question + options
│   │   │   │   ├── QuizFeedback.tsx          ← Correct/incorrect feedback animation
│   │   │   │   ├── QuizScore.tsx             ← Final score card + pass/fail
│   │   │   │   └── QuizProgress.tsx          ← Q1/Q2/Q3 dots progress indicator
│   │   │   │
│   │   │   ├── lessons/
│   │   │   │   ├── LessonRenderer.tsx        ← MDX + layout + navigation wrapper
│   │   │   │   ├── LessonHeader.tsx          ← Title, time estimate, tier badge
│   │   │   │   ├── LessonNavigation.tsx      ← Prev/next lesson buttons
│   │   │   │   ├── LessonSidebar.tsx         ← Unit outline + completion dots
│   │   │   │   ├── LessonCompletion.tsx      ← Shown after passing quiz
│   │   │   │   └── LessonSkeleton.tsx        ← Loading state
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── ProgressOverview.tsx      ← Module completion % cards
│   │   │   │   ├── StreakTracker.tsx          ← Daily streak + calendar
│   │   │   │   ├── RecentActivity.tsx        ← Last 5 lessons
│   │   │   │   ├── QuizScoreHistory.tsx      ← Score history chart
│   │   │   │   └── SubscriptionStatus.tsx    ← Tier badge + upgrade CTA
│   │   │   │
│   │   │   ├── marketing/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── CurriculumPreview.tsx
│   │   │   │   ├── TestimonialsCarousel.tsx
│   │   │   │   ├── PricingCards.tsx
│   │   │   │   ├── FAQAccordion.tsx
│   │   │   │   └── CTABanner.tsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── OAuthButtons.tsx
│   │   │   │
│   │   │   └── shared/                  ← Shared across route groups
│   │   │       ├── Navbar.tsx
│   │   │       ├── Footer.tsx
│   │   │       ├── PaywallGate.tsx       ← Server component content gate
│   │   │       ├── CheckoutButton.tsx    ← Stripe checkout trigger
│   │   │       ├── ProgressBar.tsx       ← Reading progress top bar
│   │   │       └── MobileMenu.tsx
│   │   │
│   │   ├── hooks/                       ← Custom React hooks (client-side)
│   │   │   ├── useUser.ts               ← Current auth user + profile
│   │   │   ├── useProgress.ts           ← Lesson completion state
│   │   │   ├── useLesson.ts             ← Current lesson metadata
│   │   │   ├── useQuiz.ts               ← Quiz state management
│   │   │   ├── useSubscription.ts       ← User tier check
│   │   │   ├── useStreak.ts             ← Daily streak calculation
│   │   │   └── useScrollProgress.ts     ← Reading progress (0-100%)
│   │   │
│   │   ├── lib/                         ← Pure utility functions (no React)
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts            ← Browser Supabase client
│   │   │   │   ├── server.ts            ← Server Supabase client (RSC + API)
│   │   │   │   └── middleware.ts        ← Middleware session helper
│   │   │   ├── stripe/
│   │   │   │   ├── client.ts            ← Stripe SDK initialisation
│   │   │   │   ├── products.ts          ← Price IDs and plan config constants
│   │   │   │   └── webhook.ts           ← Signature verification helper
│   │   │   ├── mdx/
│   │   │   │   ├── loader.ts            ← Read + parse MDX files from /content
│   │   │   │   ├── components.ts        ← MDX tag → React component mapping (CRITICAL)
│   │   │   │   └── toc.ts               ← Generate table of contents from headings
│   │   │   └── utils/
│   │   │       ├── cn.ts                ← clsx + tailwind-merge utility
│   │   │       ├── formatters.ts        ← Date, number, currency formatters
│   │   │       ├── lessonHelpers.ts     ← Slug generation, ordering, path parsing
│   │   │       └── progressCalc.ts      ← Progress % calculation
│   │   │
│   │   ├── store/                       ← Zustand global state stores
│   │   │   ├── useProgressStore.ts      ← Optimistic progress state
│   │   │   └── useUIStore.ts            ← Sidebar open/close, theme prefs
│   │   │
│   │   ├── config/                      ← Static configuration (no logic)
│   │   │   ├── navigation.ts            ← Sidebar nav structure
│   │   │   ├── site.ts                  ← Site metadata (name, URL, OG info)
│   │   │   └── tiers.ts                 ← Free/paid feature definitions
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css              ← Tailwind directives + CSS variables
│   │   │   └── animations.css           ← Global keyframe animations
│   │   │
│   │   ├── public/
│   │   │   ├── images/
│   │   │   │   ├── og/                  ← Open Graph images for social sharing
│   │   │   │   └── icons/               ← App icons, favicons
│   │   │   ├── fonts/                   ← Self-hosted font fallbacks if needed
│   │   │   └── lottie/                  ← Lottie JSON animation files
│   │   │       ├── quiz-success.json
│   │   │       ├── lesson-complete.json
│   │   │       └── streak-fire.json
│   │   │
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── admin/                           ← Phase 4 — Admin dashboard (skip for now)
│
├── packages/
│   ├── ui/                              ← Shared component library
│   │   └── src/
│   │       ├── components/              ← Button, Card, Badge, Modal, etc.
│   │       ├── index.ts                 ← Barrel export
│   │       └── tailwind.config.ts       ← Shared Tailwind config
│   │
│   ├── db/                              ← Database layer
│   │   └── src/
│   │       ├── client.ts
│   │       ├── queries/                 ← Typed query functions per entity
│   │       │   ├── users.ts
│   │       │   ├── progress.ts
│   │       │   ├── quiz.ts
│   │       │   ├── subscriptions.ts
│   │       │   └── certificates.ts
│   │       ├── prisma/schema.prisma     ← Schema documentation
│   │       └── supabase/migrations/     ← SQL migration files
│   │
│   └── types/                           ← Shared TypeScript types
│       └── src/
│           ├── database.ts              ← Generated Supabase DB types
│           ├── lesson.ts                ← Lesson, Unit, Module types
│           ├── user.ts                  ← UserProfile, UserTier types
│           ├── quiz.ts                  ← Quiz types
│           ├── progress.ts              ← Progress types
│           └── stripe.ts                ← Stripe event types
│
├── content/                             ← ALL MDX lesson files
│   ├── beginner/
│   │   ├── _meta.json                   ← { title, description, tier, order }
│   │   └── unit-1-how-forex-works/
│   │       ├── _meta.json               ← { title, lessons: [...], order }
│   │       ├── 1.1-what-is-forex.mdx
│   │       ├── 1.2-who-are-the-players.mdx
│   │       └── ...
│   ├── intermediate/
│   └── advanced/
│
├── scripts/
│   ├── seed-db.ts
│   ├── generate-types.ts
│   ├── validate-content.ts
│   ├── check-quiz-answers.ts
│   └── generate-sitemap.ts
│
├── docs/                                ← ALL documentation files live here
│   ├── intro.md
│   ├── tech_stack.md
│   ├── skills.md
│   ├── cursor_rules.md
│   ├── database_schema.md
│   ├── api_spec.md
│   ├── design_system.md
│   ├── file_structure.md                ← THIS FILE
│   ├── environment.md
│   ├── content_schema.md
│   ├── testing.md
│   ├── phases.md
│   └── decisions.md
│
├── turbo.json
├── pnpm-workspace.yaml
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## Quick Lookup: "Where does X go?"

| What | Where |
|---|---|
| A new animation component | `apps/web/components/animations/concepts/` or `charts/` or `formulas/` |
| A new interactive exercise | `apps/web/components/exercises/` |
| A new page | `apps/web/app/(group)/pagename/page.tsx` |
| A new API endpoint | `apps/web/app/api/feature/route.ts` |
| A new React hook | `apps/web/hooks/use[Name].ts` |
| A new utility function | `apps/web/lib/utils/[name].ts` |
| A new shared component (used in 2+ apps) | `packages/ui/src/components/` |
| A new TypeScript type | `packages/types/src/[domain].ts` |
| A new Supabase query function | `packages/db/src/queries/[entity].ts` |
| A new DB migration | `packages/db/supabase/migrations/00N_description.sql` |
| A new MDX lesson | `content/[module]/unit-N-slug/N.N-lesson-slug.mdx` |
| A new Zustand store | `apps/web/store/use[Name]Store.ts` |
| A new Lottie animation | `apps/web/public/lottie/[name].json` |
| A new environment variable | `.env.example` + Vercel dashboard |
| A new documentation file | `docs/[name].md` |
| A new dev script | `scripts/[name].ts` |

---

## File Naming Conventions (Summary)

```
Pages:           page.tsx, layout.tsx, loading.tsx, error.tsx  (Next.js convention)
Components:      PascalCase.tsx          → AnimatedCandlestickChart.tsx
Hooks:           camelCase.ts            → useProgress.ts
Utilities:       camelCase.ts            → lessonHelpers.ts
Stores:          camelCase.ts            → useProgressStore.ts
Config:          camelCase.ts            → navigationConfig.ts
Types:           camelCase.ts            → lesson.ts
API routes:      route.ts               (Next.js convention)
MDX lessons:     N.N-kebab-case.mdx     → 1.1-what-is-forex.mdx
SQL migrations:  00N_snake_case.sql     → 001_initial_schema.sql
Meta files:      _meta.json             (underscore = meta, not content)
```

---

*Last updated: Phase 0*
*This file must be updated every time a new file location pattern is established*