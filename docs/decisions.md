# 🧠 DECISIONS — Architectural Decision Log
> **Every significant technical decision, why it was made, and what was rejected.**
> Cursor must read this before suggesting alternatives to any listed decision.

---

## How to Use This File

When Cursor (or anyone) suggests changing a technology or pattern, check here first. If the decision is logged, the reasoning has already been considered. Do not re-litigate closed decisions without new information.

When a new significant decision is made, add it here with full context.

---

## Decision Log

---

### D-001 — Next.js App Router (not Pages Router)
**Date:** Phase 0
**Status:** FINAL

**Decision:** Use Next.js 14 App Router exclusively.

**Why:**
- App Router is the current and future standard for Next.js
- React Server Components allow lesson pages to be rendered server-side without client JS for content
- Streaming and Suspense are native — lesson content can stream while animations load
- Route Groups (`(marketing)`, `(auth)`, `(dashboard)`, `(course)`) allow completely different layouts per section without URL impact

**Rejected:** Pages Router — legacy, no RSC support, would require `getServerSideProps` boilerplate

---

### D-002 — MDX Files for Lesson Content (not database)
**Date:** Phase 0
**Status:** FINAL

**Decision:** All lesson text, structure, and component references live in MDX files in the repository. The database stores only metadata (IDs, tiers, ordering).

**Why:**
- Version controlled — every lesson change has a git history
- No CMS dashboard needed — adding a lesson = adding a file + git push
- Static generation at build time — lesson pages are pre-rendered, zero DB query for content
- Easy to edit — any text editor works
- Portable — content is not locked in a database

**Rejected:**
- Contentful/Sanity — paid, external dependency, more complexity
- Storing in Supabase `lessons` table — no version control, requires custom editor, slow to iterate

---

### D-003 — Supabase (not Firebase or PlanetScale)
**Date:** Phase 0
**Status:** FINAL

**Decision:** Supabase as the backend — PostgreSQL, Auth, Storage.

**Why:**
- PostgreSQL — relational data model fits this project perfectly (users → progress → lessons → quizzes)
- Row Level Security (RLS) — content gating at the database level, not just application level
- Auth built-in — no separate auth service needed
- Generous free tier — 500MB DB, 1GB storage
- Open source — not locked into a proprietary platform
- Type generation — `supabase gen types typescript` gives fully typed DB client

**Rejected:**
- Firebase — NoSQL doesn't fit relational data; pricing scales poorly; no SQL
- PlanetScale — MySQL only, no RLS, separate auth needed, less generous free tier

---

### D-004 — D3 for Math Only, React Renders SVG
**Date:** Phase 0
**Status:** FINAL

**Decision:** D3.js is used exclusively for mathematical operations (scales, path generators, data transforms). React renders all SVG elements via JSX.

**Why:**
- D3's DOM manipulation model conflicts with React's virtual DOM — both trying to own the same nodes causes bugs
- React state-driven SVG is predictable and debuggable
- Framer Motion can animate React-rendered SVG elements natively
- This is the established modern pattern for D3 + React

**Rejected:** Letting D3 `.select()` and `.append()` SVG elements directly — causes state conflicts, breaks React reconciliation, incompatible with SSR

---

### D-005 — Zustand (not Redux or Jotai)
**Date:** Phase 0
**Status:** FINAL

**Decision:** Zustand for global client state management.

**Why:**
- Minimal boilerplate — no actions, reducers, or dispatchers
- No Provider required — stores are importable directly
- TypeScript support is excellent
- Middleware support (persist) works cleanly
- Sufficient for our use case — progress cache, UI state

**Rejected:**
- Redux Toolkit — overkill for this project, significant boilerplate
- Jotai — atomic model is less intuitive for object-shaped state like progress
- Context API — causes excessive re-renders for frequently-changing state

---

### D-006 — Stripe Checkout (not custom payment UI)
**Date:** Phase 0
**Status:** FINAL

**Decision:** Use Stripe-hosted Checkout page, not a custom payment form.

**Why:**
- No PCI compliance burden — Stripe handles card data entirely
- Stripe Checkout handles: 3D Secure, Apple Pay, Google Pay, currency conversion
- Zero frontend payment UI to build and maintain
- Stripe's conversion-optimised checkout outperforms custom implementations

**Rejected:** Custom card form with Stripe Elements — PCI compliance complexity, more maintenance, no upside for this use case

---

### D-007 — Freemium Model (not fully paid)
**Date:** Phase 0
**Status:** FINAL

**Decision:** Beginner module (28 lessons) is entirely free. Intermediate and Advanced are paid.

**Why:**
- Removes barrier to first engagement — students experience value before paying
- Free content is itself a marketing asset (SEO, word of mouth)
- 28 free lessons is enough to demonstrate quality and build commitment
- Industry standard for premium course platforms

**Rejected:**
- Fully free — unsustainable, no revenue
- Fully paid — high friction, kills top-of-funnel
- First 1-2 lessons free — not enough to demonstrate quality and build commitment

---

### D-008 — Pyodide for Python Exercises (not server-side Python execution)
**Date:** Phase 0
**Status:** FINAL

**Decision:** Python exercises run entirely in the browser via Pyodide (CPython compiled to WebAssembly).

**Why:**
- Zero server cost — execution is on the user's machine
- No sandboxing needed — WebAssembly is already sandboxed
- No latency — code runs locally
- Scales to unlimited users at zero marginal cost
- Supports numpy and pandas (needed for quant exercises)

**Rejected:**
- Server-side Python execution — server cost, sandboxing complexity, latency, scaling challenges
- Skulpt — less complete Python implementation, missing key scientific libraries

---

### D-009 — Turborepo + pnpm (not Nx or Lerna)
**Date:** Phase 0
**Status:** FINAL

**Decision:** Turborepo as monorepo task runner, pnpm as package manager.

**Why:**
- Turborepo: fastest incremental builds in the monorepo space, excellent caching, minimal config
- pnpm: fastest installs, strictest dependency isolation (no phantom dependencies), workspace support
- Both are officially recommended by Vercel (who also made Turborepo)

**Rejected:**
- Nx — more powerful but significantly more complex, overkill for this project size
- Lerna — largely superseded by Turborepo + pnpm
- npm workspaces — slower, no caching
- yarn workspaces — slower than pnpm

---

### D-010 — TanStack Query for Server State (not SWR)
**Date:** Phase 0
**Status:** FINAL

**Decision:** TanStack Query (React Query) for all client-side data fetching and caching.

**Why:**
- More powerful mutation API — optimistic updates are critical for instant progress feedback
- Better DevTools
- More granular cache invalidation
- Larger ecosystem and community
- Official support for React 18 streaming

**Rejected:** SWR — simpler but less powerful mutation support; optimistic updates are harder to implement cleanly

---

### D-011 — Two-Layer Content Gating (Middleware + RLS)
**Date:** Phase 0
**Status:** FINAL — THIS IS NON-NEGOTIABLE

**Decision:** Paid content is gated at TWO layers: Next.js middleware (route level) AND Supabase RLS (database level).

**Why:**
- Single-layer gating creates a single point of failure
- If middleware has a bug, RLS is the safety net
- If someone finds a way to bypass the route, they still cannot query paid DB data
- Security in depth is best practice for content that is actively sold

**Rejected:** Single-layer gating — insufficient for content that represents direct revenue

---

*Last updated: Phase 0*
*Add new decisions as they are made. Never delete entries — mark as SUPERSEDED if changed.*