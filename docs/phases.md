# 🗺️ PHASES — Build Roadmap & Current Status
> **The complete build plan. Cursor must know what phase we are in and what is/isn't built yet.**

---

## Current Status: PHASE 0 — Content & Design

**Do not write application code until Phase 0 is complete.**
Phase 0 outputs are the inputs to Phase 1. Building without them causes rework.

---

## Phase 0 — Content & Design (Current)
*Goal: Every decision made, every word written, before a single line of app code.*

### Deliverables

| Deliverable | Status | Notes |
|---|---|---|
| Full curriculum map (88 lessons) | ✅ Complete | All titles, units, animation briefs |
| Lesson 1.1 — What is Forex? | ✅ Complete | Full content + exercise + quiz |
| Lesson 1.2 — Who Are the Players? | ✅ Complete | Full content + exercise + quiz |
| Lesson 1.3 — How Currency Pairs Work | ✅ Complete | Full content + exercise + quiz |
| Lesson 1.4 — The Bid, Ask & Spread | 🔄 In Progress | |
| Lesson 1.5 — Forex Market Sessions | ⏳ Pending | |
| Lessons 2.1–2.6 (Unit 2) | ⏳ Pending | |
| Lessons 3.1–3.6 (Unit 3) | ⏳ Pending | |
| Lessons 4.1–4.5 (Unit 4) | ⏳ Pending | |
| Lessons 5.1–5.6 (Unit 5) | ⏳ Pending | |
| Intermediate module content | ⏳ Pending | Phase 2 content |
| Advanced module content | ⏳ Pending | Phase 4 content |
| Monorepo schema documented | ✅ Complete | |
| Tech stack finalised | ✅ Complete | |
| Design system documented | ✅ Complete | |
| Database schema documented | ✅ Complete | |
| API spec documented | ✅ Complete | |
| File structure documented | ✅ Complete | |
| All documentation files | ✅ Complete | |
| User flow diagrams | ⏳ Pending | |
| Animation storyboards | ⏳ Pending | Detailed per-animation briefs |

**Phase 0 is complete when:** All Beginner module content (28 lessons) is written AND all documentation files are finalised.

---

## Phase 1 — Foundation
*Goal: A working app skeleton. Auth works. Lessons render. Nothing is interactive yet.*

### What Gets Built

```
Week 1: Monorepo setup
- Turborepo + pnpm workspace initialised
- Next.js 14 app created in apps/web/
- TypeScript, Tailwind, ESLint, Prettier configured
- Supabase project created, schema migrated
- Vercel connected to GitHub, auto-deploy working
- Environment variables configured

Week 2: Auth + Database
- Supabase Auth — email + Google OAuth working
- users_profile auto-created on signup
- Login, signup, forgot password pages built
- Protected route middleware working
- Dashboard skeleton (no data yet)

Week 3: MDX Pipeline
- next-mdx-remote installed and configured
- Lesson page route working: /learn/[module]/[unit]/[lesson]
- Frontmatter parsing working
- Lesson 1.1 renders as plain MDX (no animations yet)
- Lesson navigation (prev/next) working
- Lesson sidebar with unit outline

Week 4: Progress + Quiz (no UI polish)
- Quiz questions seeded to database
- QuizBlock renders and submits
- Quiz scoring working
- Lesson progress saved on quiz pass
- Dashboard shows real completion data
```

### Phase 1 Definition of Done
- [ ] User can sign up, log in, log out
- [ ] User can navigate to any free lesson
- [ ] Lesson 1.1 renders with correct content
- [ ] User can complete a quiz and have progress saved
- [ ] Dashboard shows real progress data
- [ ] Vercel deployment working on every push to main

---

## Phase 2 — Core Learning Experience
*Goal: The platform feels like Brilliant.org. Animations live. Exercises interactive.*

### What Gets Built

```
Weeks 5-8: Animation components
- GlobalFlowMap (Lesson 1.1)
- MarketHierarchyPyramid + StopHuntSequence (Lesson 1.2)
- PairAnatomyDissection + PairsSolarSystem (Lesson 1.3)
- BidAskSpreadVisualizer (Lesson 1.4)
- SessionClockAnimation (Lesson 1.5)
- AnimatedCandlestickChart (Units 2-4 base)
- All Unit 2 indicator animations (MA, RSI, MACD, Bollinger)
- Chart pattern animations (Unit 4)

Weeks 9-11: Interactive exercises
- DragDropExercise base component
- MatchTheDriver (Lesson 1.1)
- WhosBehindTheMove (Lesson 1.2)
- DecodeTheQuote (Lesson 1.3)
- TrendlineDrawer (Unit 2)
- PatternIdentifier (Unit 4)

Weeks 12-14: Polish + intermediate content
- Write all Intermediate module content (30 lessons)
- Build Unit 6-7 animations (Wyckoff, SMC, Order Blocks)
- Quiz UI polished with animation feedback
- Progress bar (reading scroll indicator)
- Streak tracking working
- Certificate generation on module completion
```

### Phase 2 Definition of Done
- [ ] All Beginner module lessons fully interactive with animations
- [ ] All Beginner exercises functional
- [ ] Quiz has animated feedback (correct/incorrect)
- [ ] Certificates generate on module completion
- [ ] Streak tracking works

---

## Phase 3 — Monetisation
*Goal: First paying customer can subscribe. Paywall works. Revenue flows.*

```
Weeks 15-17:
- Stripe products + prices created in dashboard
- Checkout session API route built
- Stripe webhook handler built + tested
- Subscriptions table synced from Stripe
- Middleware paywall working for paid lessons
- Supabase RLS policies for paid content
- Upgrade page with pricing cards
- PaywallGate component working
- Stripe Customer Portal (subscription management)
- Purchase confirmation email (Resend)

Week 18: Testing + hardening
- Stripe webhook tests written
- Auth middleware tests written
- E2E test: full purchase flow in Stripe test mode
- Sentry error monitoring live
```

### Phase 3 Definition of Done
- [ ] Test purchase works end-to-end in Stripe test mode
- [ ] Paying user can access all intermediate content
- [ ] Free user sees paywall on paid lessons
- [ ] Cancelled subscription correctly downgrades access
- [ ] Payment confirmation email received

---

## Phase 4 — Full Content + Launch
*Goal: All 88 lessons live. Platform publicly launched.*

```
Weeks 19-28:
- Write all Advanced module content (30 lessons)
- Build all Advanced module animations (Units 11-15)
- Python in-browser exercises (Pyodide + Monaco)
- KaTeX formula animations (quant lessons)
- Admin dashboard (basic — user count, revenue, lesson analytics)

Weeks 29-32:
- SEO audit — metadata, OG tags, sitemap
- Landing page optimisation
- Blog — 10 SEO articles on trading topics
- Performance audit (Core Web Vitals)
- Mobile responsiveness audit
- Beta launch to first 50 users
- Collect feedback, iterate

Week 33-34: Public launch
- Product Hunt launch
- Trading communities (Reddit, Twitter/X, Discord)
- YouTube companion channel (optional)
```

---

## What Cursor Should NEVER Build Until Its Phase

| Feature | Earliest Phase |
|---|---|
| Admin dashboard | Phase 4 |
| Blog CMS | Phase 4 |
| Affiliate system | Post-launch |
| Leaderboards | Phase 4 |
| Community features | Post-launch |
| Mobile app | Post-launch |
| Video lessons | Post-launch |
| Live trading integration | Post-launch |

---

*Last updated: Phase 0*
*Update status column as deliverables complete*