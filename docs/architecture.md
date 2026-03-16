## Overall Architecture of how things should be in this project

trading-course/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                         ← Runs lint + typecheck + tests on every PR
│   │   ├── deploy-preview.yml             ← Deploys preview to Vercel on PR open
│   │   └── migrate.yml                    ← Runs Supabase DB migrations on merge to main
│   ├── PULL_REQUEST_TEMPLATE.md           ← PR checklist template
│   └── CODEOWNERS                         ← Defines who reviews what
│
├── apps/
│   │
│   ├── web/                               ← Main Next.js 14 application (App Router)
│   │   │
│   │   ├── app/                           ← Next.js App Router root
│   │   │   │
│   │   │   ├── (marketing)/               ← Route group — public pages, no auth needed
│   │   │   │   ├── page.tsx               ← Landing page (/)
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx           ← About page (/about)
│   │   │   │   ├── pricing/
│   │   │   │   │   └── page.tsx           ← Pricing page (/pricing)
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx           ← Blog index (/blog)
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx       ← Individual blog post (/blog/[slug])
│   │   │   │   └── layout.tsx             ← Marketing layout (nav + footer)
│   │   │   │
│   │   │   ├── (auth)/                    ← Route group — auth pages
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx           ← Login page (/login)
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.tsx           ← Signup page (/signup)
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx           ← Password reset request
│   │   │   │   ├── reset-password/
│   │   │   │   │   └── page.tsx           ← Password reset form (from email link)
│   │   │   │   └── layout.tsx             ← Centered card layout for auth pages
│   │   │   │
│   │   │   ├── (dashboard)/               ← Route group — authenticated user area
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx           ← User dashboard (/dashboard)
│   │   │   │   │                          ← Shows: progress, streak, recent lessons,
│   │   │   │   │                             quiz scores, subscription status
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx           ← User profile & settings (/profile)
│   │   │   │   ├── certificates/
│   │   │   │   │   └── page.tsx           ← Earned certificates (/certificates)
│   │   │   │   └── layout.tsx             ← Dashboard layout (sidebar + topbar)
│   │   │   │
│   │   │   ├── (course)/                  ← Route group — course content area
│   │   │   │   ├── learn/
│   │   │   │   │   ├── page.tsx           ← Course home — all modules (/learn)
│   │   │   │   │   │
│   │   │   │   │   ├── [module]/          ← Dynamic module route
│   │   │   │   │   │   ├── page.tsx       ← Module overview (/learn/beginner)
│   │   │   │   │   │   │
│   │   │   │   │   │   └── [unit]/        ← Dynamic unit route
│   │   │   │   │   │       ├── page.tsx   ← Unit overview (/learn/beginner/unit-1)
│   │   │   │   │   │       │
│   │   │   │   │   │       └── [lesson]/  ← Dynamic lesson route
│   │   │   │   │   │           └── page.tsx ← Lesson page (/learn/beginner/unit-1/lesson-1)
│   │   │   │   │   │                      ← Renders MDX + animations + quiz
│   │   │   │   │
│   │   │   │   ├── upgrade/
│   │   │   │   │   └── page.tsx           ← Paywall / upgrade prompt page
│   │   │   │   └── layout.tsx             ← Course layout (progress sidebar + lesson nav)
│   │   │   │
│   │   │   ├── api/                       ← Next.js API Routes (server-side logic)
│   │   │   │   │
│   │   │   │   ├── auth/
│   │   │   │   │   └── callback/
│   │   │   │   │       └── route.ts       ← Supabase OAuth callback handler
│   │   │   │   │
│   │   │   │   ├── stripe/
│   │   │   │   │   ├── checkout/
│   │   │   │   │   │   └── route.ts       ← POST: create Stripe Checkout session
│   │   │   │   │   ├── portal/
│   │   │   │   │   │   └── route.ts       ← POST: create Stripe Customer Portal session
│   │   │   │   │   └── webhook/
│   │   │   │   │       └── route.ts       ← POST: handle Stripe webhook events
│   │   │   │   │                          ← Handles: checkout.session.completed,
│   │   │   │   │                             subscription.updated/deleted,
│   │   │   │   │                             invoice.payment_failed
│   │   │   │   │
│   │   │   │   ├── progress/
│   │   │   │   │   ├── complete/
│   │   │   │   │   │   └── route.ts       ← POST: mark lesson as complete
│   │   │   │   │   └── route.ts           ← GET: fetch user's full progress
│   │   │   │   │
│   │   │   │   ├── quiz/
│   │   │   │   │   ├── submit/
│   │   │   │   │   │   └── route.ts       ← POST: submit quiz answers, save score
│   │   │   │   │   └── route.ts           ← GET: fetch quiz questions for a lesson
│   │   │   │   │
│   │   │   │   └── certificates/
│   │   │   │       └── generate/
│   │   │   │           └── route.ts       ← POST: generate PDF certificate on completion
│   │   │   │
│   │   │   ├── middleware.ts              ← Global middleware — auth guard + paywall check
│   │   │   │                              ← Checks: is user logged in? is lesson free/paid?
│   │   │   │                              ← Redirects to /login or /upgrade accordingly
│   │   │   │
│   │   │   ├── layout.tsx                 ← Root layout — fonts, metadata, providers
│   │   │   ├── not-found.tsx              ← Custom 404 page
│   │   │   ├── error.tsx                  ← Global error boundary
│   │   │   └── loading.tsx                ← Global loading skeleton
│   │   │
│   │   ├── components/                    ← App-specific components (not shared)
│   │   │   │
│   │   │   ├── lessons/                   ← Lesson rendering components
│   │   │   │   ├── LessonRenderer.tsx     ← Wraps MDX content with layout + nav
│   │   │   │   ├── LessonHeader.tsx       ← Title, estimated time, progress indicator
│   │   │   │   ├── LessonNavigation.tsx   ← Previous / Next lesson buttons
│   │   │   │   ├── LessonSidebar.tsx      ← Unit outline, lesson list, completion dots
│   │   │   │   └── LessonCompletion.tsx   ← Completion card shown after quiz pass
│   │   │   │
│   │   │   ├── animations/                ← All GSAP + D3 + Framer Motion components
│   │   │   │   │
│   │   │   │   ├── charts/                ← D3-based interactive chart animations
│   │   │   │   │   ├── AnimatedCandlestickChart.tsx   ← Candles drawing themselves
│   │   │   │   │   ├── MovingAverageOverlay.tsx       ← MA line plotting animation
│   │   │   │   │   ├── SupportResistanceDraw.tsx      ← S/R lines auto-drawing
│   │   │   │   │   ├── FibonacciOverlay.tsx           ← Fib levels animating in
│   │   │   │   │   ├── BollingerBandBreath.tsx        ← Bands expanding/contracting
│   │   │   │   │   └── VolumeBarChart.tsx             ← Volume bars synced to candles
│   │   │   │   │
│   │   │   │   ├── concepts/              ← GSAP timeline concept explainers
│   │   │   │   │   ├── MarketHierarchyPyramid.tsx     ← Lesson 1.2 pyramid
│   │   │   │   │   ├── GlobalFlowMap.tsx              ← Lesson 1.1 world map
│   │   │   │   │   ├── StopHuntSequence.tsx           ← Lesson 1.2 stop hunt
│   │   │   │   │   ├── PairAnatomyDissection.tsx      ← Lesson 1.3 pair breakdown
│   │   │   │   │   ├── SessionClockAnimation.tsx      ← Lesson 1.5 session clock
│   │   │   │   │   ├── WyckoffSchematic.tsx           ← Unit 6 accumulation phases
│   │   │   │   │   ├── LiquiditySweepAnimation.tsx    ← Unit 7 liquidity concepts
│   │   │   │   │   ├── OrderBlockHighlight.tsx        ← Unit 7 order blocks
│   │   │   │   │   └── FairValueGapForm.tsx           ← Unit 7 FVG animation
│   │   │   │   │
│   │   │   │   └── formulas/              ← KaTeX step-by-step formula reveals
│   │   │   │       ├── FormulaReveal.tsx              ← Animated formula step revealer
│   │   │   │       ├── RiskRewardVisualizer.tsx       ← R:R ratio animation
│   │   │   │       └── KellyCriterionBreakdown.tsx    ← Kelly formula animation
│   │   │   │
│   │   │   ├── exercises/                 ← Interactive exercise components
│   │   │   │   ├── DragDropExercise.tsx   ← Generic drag-and-drop framework
│   │   │   │   ├── TrendlineDrawer.tsx    ← Student draws trendlines on chart
│   │   │   │   ├── PatternIdentifier.tsx  ← Click to identify chart patterns
│   │   │   │   ├── SRLevelPlacer.tsx      ← Drag S/R lines onto a chart
│   │   │   │   ├── RiskCalculatorEx.tsx   ← Fill in position sizing inputs
│   │   │   │   ├── MatchTheDriver.tsx     ← Lesson 1.1 drag-drop exercise
│   │   │   │   ├── WhosBehindTheMove.tsx  ← Lesson 1.2 scenario matching
│   │   │   │   ├── DecodeTheQuote.tsx     ← Lesson 1.3 quote decoder exercise
│   │   │   │   └── PythonExercise.tsx     ← Monaco editor + Pyodide runtime
│   │   │   │
│   │   │   ├── quiz/                      ← Quiz system components
│   │   │   │   ├── QuizBlock.tsx          ← Quiz container — loads questions
│   │   │   │   ├── QuizQuestion.tsx       ← Single MCQ with answer options
│   │   │   │   ├── QuizFeedback.tsx       ← Correct/incorrect animation + explanation
│   │   │   │   ├── QuizScore.tsx          ← Final score card + pass/fail state
│   │   │   │   └── QuizProgress.tsx       ← Q1/Q2/Q3... progress dots
│   │   │   │
│   │   │   ├── dashboard/                 ← Dashboard-specific components
│   │   │   │   ├── ProgressOverview.tsx   ← Module completion % cards
│   │   │   │   ├── StreakTracker.tsx       ← Daily streak counter + calendar
│   │   │   │   ├── RecentActivity.tsx     ← Last 5 lessons visited
│   │   │   │   ├── QuizScoreHistory.tsx   ← Score chart across lessons
│   │   │   │   └── SubscriptionStatus.tsx ← Free/Pro badge + upgrade CTA
│   │   │   │
│   │   │   ├── marketing/                 ← Landing page components
│   │   │   │   ├── HeroSection.tsx        ← Above-the-fold hero
│   │   │   │   ├── CurriculumPreview.tsx  ← Course outline teaser
│   │   │   │   ├── TestimonialsCarousel.tsx ← Social proof
│   │   │   │   ├── PricingCards.tsx       ← Free/Pro/Lifetime pricing
│   │   │   │   ├── FAQAccordion.tsx       ← Common questions
│   │   │   │   └── CTABanner.tsx          ← Bottom conversion CTA
│   │   │   │
│   │   │   └── shared/                    ← App-level shared components
│   │   │       ├── Navbar.tsx             ← Top navigation bar
│   │   │       ├── Footer.tsx             ← Site footer
│   │   │       ├── PaywallGate.tsx        ← Blurred content + upgrade prompt overlay
│   │   │       ├── ProgressBar.tsx        ← Lesson reading progress (top bar)
│   │   │       └── MobileMenu.tsx         ← Hamburger menu for mobile
│   │   │
│   │   ├── hooks/                         ← Custom React hooks
│   │   │   ├── useUser.ts                 ← Returns current auth user + profile
│   │   │   ├── useProgress.ts             ← Fetches + caches user lesson progress
│   │   │   ├── useLesson.ts               ← Loads current lesson data + metadata
│   │   │   ├── useQuiz.ts                 ← Quiz state management (answers, score)
│   │   │   ├── useSubscription.ts         ← Checks user tier (free/pro)
│   │   │   └── useStreak.ts               ← Calculates daily streak from progress data
│   │   │
│   │   ├── lib/                           ← App-level utility functions
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts              ← Supabase browser client (singleton)
│   │   │   │   ├── server.ts              ← Supabase server client (for RSC + API routes)
│   │   │   │   └── middleware.ts          ← Supabase session refresh in middleware
│   │   │   ├── stripe/
│   │   │   │   ├── client.ts              ← Stripe client initialisation
│   │   │   │   ├── products.ts            ← Price IDs, product config constants
│   │   │   │   └── webhook.ts             ← Webhook signature verification helper
│   │   │   ├── mdx/
│   │   │   │   ├── loader.ts              ← Reads + parses MDX files from /content
│   │   │   │   ├── components.ts          ← Maps MDX component names to React components
│   │   │   │   └── toc.ts                 ← Generates table of contents from MDX headings
│   │   │   └── utils/
│   │   │       ├── formatters.ts          ← Date, number, currency formatters
│   │   │       ├── lessonHelpers.ts       ← Slug generation, lesson ordering logic
│   │   │       └── progressCalc.ts        ← Progress % calculation utilities
│   │   │
│   │   ├── config/
│   │   │   ├── navigation.ts              ← Sidebar nav structure config
│   │   │   ├── site.ts                    ← Site metadata (name, URL, description)
│   │   │   └── tiers.ts                   ← Free/paid feature gate definitions
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css                ← Tailwind base + CSS custom properties
│   │   │   └── animations.css             ← Global keyframe animations (GSAP helpers)
│   │   │
│   │   ├── public/
│   │   │   ├── images/
│   │   │   │   ├── og/                    ← Open Graph images for social sharing
│   │   │   │   └── avatars/               ← Default user avatars
│   │   │   ├── fonts/                     ← Self-hosted fonts (performance)
│   │   │   ├── lottie/                    ← Lottie JSON animation files
│   │   │   │   ├── market-flow.json
│   │   │   │   ├── trade-mechanic.json
│   │   │   │   └── quiz-success.json
│   │   │   └── favicon.ico
│   │   │
│   │   ├── next.config.ts                 ← Next.js config (MDX, image domains, rewrites)
│   │   ├── tailwind.config.ts             ← Tailwind config (extends design tokens)
│   │   ├── tsconfig.json                  ← TypeScript config (extends root)
│   │   └── package.json                   ← App dependencies
│   │
│   └── admin/                             ← (Phase 4+) Separate admin dashboard
│       ├── app/
│       │   ├── page.tsx                   ← Admin home — overview stats
│       │   ├── users/
│       │   │   └── page.tsx               ← User management table
│       │   ├── content/
│       │   │   └── page.tsx               ← Lesson content management
│       │   ├── revenue/
│       │   │   └── page.tsx               ← Stripe revenue dashboard
│       │   └── layout.tsx                 ← Admin layout
│       ├── next.config.ts
│       └── package.json
│
├── packages/                              ← Shared code used across apps
│   │
│   ├── ui/                                ← Shared component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx             ← Button variants (primary, secondary, ghost)
│   │   │   │   ├── Card.tsx               ← Card container with variants
│   │   │   │   ├── Badge.tsx              ← Free/Pro/New badges
│   │   │   │   ├── Modal.tsx              ← Reusable modal with backdrop
│   │   │   │   ├── Tooltip.tsx            ← Hover tooltips
│   │   │   │   ├── Accordion.tsx          ← Expand/collapse sections
│   │   │   │   ├── Tabs.tsx               ← Tabbed content panels
│   │   │   │   ├── Skeleton.tsx           ← Loading skeleton placeholder
│   │   │   │   ├── Toast.tsx              ← Notification toasts
│   │   │   │   ├── Avatar.tsx             ← User avatar with fallback
│   │   │   │   └── ProgressRing.tsx       ← Circular progress indicator
│   │   │   └── index.ts                   ← Barrel export of all components
│   │   ├── tailwind.config.ts             ← Shared Tailwind config
│   │   └── package.json
│   │
│   ├── db/                                ← Database layer
│   │   ├── src/
│   │   │   ├── client.ts                  ← Supabase client factory
│   │   │   ├── queries/                   ← Typed query functions
│   │   │   │   ├── users.ts               ← getUserProfile, updateUserProfile
│   │   │   │   ├── progress.ts            ← getLessonProgress, markComplete
│   │   │   │   ├── quiz.ts                ← getQuizQuestions, saveQuizAttempt
│   │   │   │   ├── subscriptions.ts       ← getUserSubscription, upsertSubscription
│   │   │   │   └── certificates.ts        ← getCertificates, createCertificate
│   │   │   └── index.ts                   ← Barrel export
│   │   ├── prisma/
│   │   │   └── schema.prisma              ← Full Prisma schema (all tables defined)
│   │   ├── supabase/
│   │   │   ├── migrations/                ← Ordered SQL migration files
│   │   │   │   ├── 001_initial_schema.sql
│   │   │   │   ├── 002_rls_policies.sql
│   │   │   │   ├── 003_stripe_tables.sql
│   │   │   │   └── 004_certificates.sql
│   │   │   └── seed.sql                   ← Dev seed data (test users, sample progress)
│   │   └── package.json
│   │
│   └── types/                             ← Shared TypeScript types
│       ├── src/
│       │   ├── database.ts                ← Generated Supabase DB types
│       │   ├── lesson.ts                  ← LessonMeta, LessonContent, UnitMeta types
│       │   ├── user.ts                    ← UserProfile, UserTier, SubscriptionStatus
│       │   ├── quiz.ts                    ← QuizQuestion, QuizAttempt, QuizResult
│       │   ├── progress.ts                ← LessonProgress, ModuleProgress types
│       │   └── stripe.ts                  ← Stripe webhook event types
│       ├── index.ts                       ← Barrel export of all types
│       └── package.json
│
├── content/                               ← All MDX lesson files (Git-based CMS)
│   │
│   ├── beginner/                          ← Module 1 — Free tier
│   │   ├── _meta.json                     ← Module metadata (title, description, tier)
│   │   ├── unit-1-how-forex-works/
│   │   │   ├── _meta.json                 ← Unit metadata (order, title, lessons list)
│   │   │   ├── 1.1-what-is-forex.mdx
│   │   │   ├── 1.2-who-are-the-players.mdx
│   │   │   ├── 1.3-how-currency-pairs-work.mdx
│   │   │   ├── 1.4-bid-ask-spread.mdx
│   │   │   └── 1.5-forex-market-sessions.mdx
│   │   ├── unit-2-reading-forex-charts/
│   │   │   ├── _meta.json
│   │   │   ├── 2.1-candlesticks-explained.mdx
│   │   │   ├── 2.2-timeframes.mdx
│   │   │   ├── 2.3-bullish-patterns.mdx
│   │   │   ├── 2.4-bearish-patterns.mdx
│   │   │   ├── 2.5-support-resistance.mdx
│   │   │   └── 2.6-trendlines-channels.mdx
│   │   ├── unit-3-core-indicators/
│   │   ├── unit-4-chart-patterns/
│   │   └── unit-5-first-trade/
│   │
│   ├── intermediate/                      ← Module 2 — Paid tier
│   │   ├── _meta.json
│   │   ├── unit-6-market-structure/
│   │   ├── unit-7-smart-money-concepts/
│   │   ├── unit-8-multi-timeframe/
│   │   ├── unit-9-risk-management/
│   │   └── unit-10-trading-system/
│   │
│   └── advanced/                          ← Module 3 — Paid tier
│       ├── _meta.json
│       ├── unit-11-institutional-order-flow/
│       ├── unit-12-macro-fundamental/
│       ├── unit-13-algorithmic-trading/
│       ├── unit-14-quant-strategies/
│       └── unit-15-professional-operations/
│
├── scripts/                               ← Developer utility scripts
│   ├── seed-db.ts                         ← Populates local Supabase with test data
│   ├── generate-types.ts                  ← Pulls Supabase schema → generates TS types
│   ├── validate-content.ts               ← Checks all MDX files have valid frontmatter
│   ├── check-quiz-answers.ts             ← Validates all quiz questions have answer keys
│   └── generate-sitemap.ts               ← Generates sitemap.xml from content files
│
├── docs/                                  ← Project documentation
│   ├── PRD.md                             ← Product Requirements Document
│   ├── DATABASE_SCHEMA.md                 ← Full DB schema documentation
│   ├── API_SPEC.md                        ← Every API route documented
│   ├── ANIMATION_STORYBOARDS.md           ← Animation briefs for every lesson
│   ├── DESIGN_SYSTEM.md                   ← Colors, typography, spacing rules
│   ├── CONTENT_STYLE_GUIDE.md            ← Rules for writing lesson content
│   └── DEPLOYMENT.md                      ← Step by step deploy instructions
│
├── turbo.json                             ← Turborepo pipeline config
│                                          ← Defines: build, dev, lint, test task order
├── pnpm-workspace.yaml                    ← Declares all workspace packages
├── .env.example                           ← All required env vars documented (no secrets)
├── .eslintrc.js                           ← Shared ESLint config
├── .prettierrc                            ← Shared Prettier config
├── tsconfig.json                          ← Root TypeScript config (base for all apps)
├── .gitignore
└── README.md                              ← Project overview + setup instructions


## **Monorepo link for how much files i need**

https://vrd07.github.io/Trading_Course_schema/