# 🎨 DESIGN SYSTEM — Visual Language & Component Rules
> **Every color, font, spacing value, and component rule. Cursor must read this before writing any CSS or component styling.**

---

## Design Philosophy

This platform teaches complex financial concepts. The design must:
- **Reduce cognitive load** — clean layouts, clear hierarchy, no visual noise
- **Convey credibility** — dark professional theme, precise typography, consistent spacing
- **Make interaction feel rewarding** — smooth animations, satisfying feedback states
- **Guide focus** — every lesson page directs attention to the content, not the chrome

The aesthetic is **dark professional + high-contrast accents** — think Bloomberg Terminal meets Brilliant.org.

---

## Color System

All colors are defined as CSS custom properties (HSL) in `apps/web/styles/globals.css`.
**Never hardcode hex values in components — always use CSS variables.**

### Base Palette (Dark Theme — Default)

```css
:root {
  /* Backgrounds — layered depth */
  --background:        222 47% 6%;    /* #090c10 — page background */
  --background-subtle: 222 40% 8%;    /* #0e1318 — card backgrounds */
  --background-muted:  222 35% 11%;   /* #141a22 — input backgrounds, code blocks */

  /* Borders */
  --border:            215 28% 14%;   /* #1e2a38 — default borders */
  --border-subtle:     215 25% 17%;   /* #253345 — hover borders */

  /* Text */
  --foreground:        210 40% 92%;   /* #e2eaf5 — primary text */
  --foreground-muted:  215 25% 35%;   /* #4a6070 — secondary/caption text */
  --foreground-subtle: 215 20% 20%;   /* #2a3a4a — placeholder text */

  /* Brand — Primary Blue */
  --primary:           213 94% 62%;   /* #3b82f6 — CTAs, links, active states */
  --primary-foreground: 0 0% 100%;   /* White text on primary */
  --primary-subtle:    213 94% 62% / 0.1;  /* Light primary tint */

  /* Accent Colors — Semantic */
  --success:           158 64% 52%;   /* #34d399 — correct answers, free tier, gains */
  --success-subtle:    158 64% 52% / 0.1;
  --warning:           38 92% 50%;    /* #f59e0b — warnings, intermediate tier */
  --warning-subtle:    38 92% 50% / 0.1;
  --destructive:       0 84% 60%;     /* #ef4444 — errors, losses, critical info */
  --destructive-subtle: 0 84% 60% / 0.1;
  --purple:            271 81% 60%;   /* #a855f7 — packages, advanced features */
  --purple-subtle:     271 81% 60% / 0.1;
  --orange:            25 95% 53%;    /* #fb923c — paid tier indicator */
  --orange-subtle:     25 95% 53% / 0.1;

  /* Chart Colors */
  --candle-bull:       158 64% 52%;   /* #34d399 — bullish candles */
  --candle-bear:       0 84% 60%;     /* #ef4444 — bearish candles */
  --chart-ma-fast:     213 94% 62%;   /* #3b82f6 — fast MA line */
  --chart-ma-slow:     38 92% 50%;    /* #f59e0b — slow MA line */
  --chart-grid:        215 28% 14%;   /* Same as --border */

  /* Tier Colors */
  --tier-free:         158 64% 52%;   /* Green — free content */
  --tier-paid:         25 95% 53%;    /* Orange — paid content */

  /* Radius */
  --radius:            0.5rem;        /* 8px — default border radius */
  --radius-sm:         0.25rem;       /* 4px */
  --radius-lg:         0.75rem;       /* 12px */
  --radius-xl:         1rem;          /* 16px */
  --radius-full:       9999px;        /* Pills */
}
```

### Usage Rules

```typescript
// ✅ Always use semantic variable names in components
<div className="bg-background border border-border text-foreground">
<p className="text-foreground-muted">

// ✅ For opacity variants, use Tailwind opacity modifier
<div className="bg-primary/10 border-primary/20">

// ❌ Never hardcode colors
<div className="bg-[#090c10]">
<div style={{ backgroundColor: '#3b82f6' }}>
```

---

## Typography

### Font Stack

```css
/* In globals.css, loaded via next/font */
--font-sans:    'Inter Variable', system-ui, sans-serif;      /* Body text */
--font-mono:    'JetBrains Mono', 'Fira Code', monospace;     /* Code, prices, stats */
--font-display: 'Syne', 'Inter Variable', sans-serif;         /* Headings, hero text */
```

**Load in `app/layout.tsx`:**
```typescript
import { Inter } from 'next/font/google'
import { Syne } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const syne = Syne({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
```

### Type Scale

| Class | Size | Weight | Use case |
|---|---|---|---|
| `text-xs` | 12px | 400 | Captions, timestamps, metadata |
| `text-sm` | 14px | 400 | Secondary body, UI labels |
| `text-base` | 16px | 400 | Primary body text in lessons |
| `text-lg` | 18px | 400/500 | Lead paragraphs, callouts |
| `text-xl` | 20px | 600 | Section subheadings (H3) |
| `text-2xl` | 24px | 700 | Page section headings (H2) |
| `text-3xl` | 30px | 700 | Page titles (H1 in lessons) |
| `text-4xl` | 36px | 800 | Hero headings (display font) |
| `text-5xl` | 48px | 800 | Landing page hero |

**Heading font usage:**
```typescript
// Lesson H1 — display font, large
<h1 className="font-display text-3xl font-bold tracking-tight text-foreground">

// Section heading — sans, semibold
<h2 className="font-sans text-2xl font-semibold text-foreground">

// UI label — mono for numbers/stats
<span className="font-mono text-sm text-foreground-muted">
```

---

## Spacing System

Use **only** Tailwind's spacing scale. No custom pixel values.

| Scale | px | Use case |
|---|---|---|
| `space-1` | 4px | Icon gaps, tight groupings |
| `space-2` | 8px | Internal component padding |
| `space-3` | 12px | Compact card padding |
| `space-4` | 16px | Standard padding/margin |
| `space-6` | 24px | Section spacing within a card |
| `space-8` | 32px | Gap between major sections |
| `space-12` | 48px | Top/bottom page padding |
| `space-16` | 64px | Between major page sections |
| `space-24` | 96px | Large section gaps on landing page |

---

## Core Components

### Button

```typescript
// Variants available in packages/ui/src/components/Button.tsx
// Always import from @trading-course/ui

<Button variant="default">   {/* Primary blue — main CTA */}
<Button variant="outline">   {/* Border only — secondary action */}
<Button variant="ghost">     {/* No border — tertiary/nav */}
<Button variant="destructive"> {/* Red — delete/cancel */}

// Sizes
<Button size="sm">    {/* 32px height — inline actions */}
<Button size="default"> {/* 40px height — standard */}
<Button size="lg">    {/* 48px height — hero CTAs */}

// States — always handle these
<Button disabled={isLoading}>
  {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### Card

```typescript
// Standard lesson content card
<div className="rounded-xl border border-border bg-background-subtle p-6">

// Animation container card
<div className="rounded-xl border border-border bg-background-muted p-4 my-6">

// Callout / highlight card (blue tint)
<div className="rounded-lg border border-primary/20 bg-primary/5 p-4 my-4">

// Warning callout (amber tint)
<div className="rounded-lg border border-warning/20 bg-warning/5 p-4 my-4">

// Success card (green tint)
<div className="rounded-lg border border-success/20 bg-success/5 p-4 my-4">
```

### Badge / Tier Indicator

```typescript
// Free tier badge
<span className="inline-flex items-center rounded-full border border-success/30
                 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
  FREE
</span>

// Paid tier badge
<span className="inline-flex items-center rounded-full border border-orange/30
                 bg-orange/10 px-2.5 py-0.5 text-xs font-semibold text-orange">
  PRO
</span>
```

### Progress Bar

```typescript
// Lesson reading progress (top of page)
<div className="fixed top-0 left-0 z-50 h-0.5 bg-primary transition-all duration-300"
     style={{ width: `${scrollProgress}%` }} />

// Module completion bar
<div className="h-2 w-full rounded-full bg-background-muted">
  <div
    className="h-2 rounded-full bg-primary transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Quiz Option

```typescript
// Default state
<button className="w-full rounded-lg border border-border bg-background-subtle
                   p-4 text-left text-sm transition-colors hover:border-primary/50
                   hover:bg-primary/5">

// Selected (before reveal)
<button className="w-full rounded-lg border border-primary bg-primary/10
                   p-4 text-left text-sm">

// Correct answer (after submit)
<button className="w-full rounded-lg border border-success bg-success/10
                   p-4 text-left text-sm">

// Incorrect answer (after submit)
<button className="w-full rounded-lg border border-destructive bg-destructive/10
                   p-4 text-left text-sm">
```

---

## Animation Standards

### Timing Conventions

```typescript
// Fast — micro-interactions (hover, click)
transition={{ duration: 0.15 }}

// Normal — component mount/unmount
transition={{ duration: 0.3 }}

// Slow — page transitions, concept reveals
transition={{ duration: 0.5 }}

// Very slow — lesson completion celebrations
transition={{ duration: 0.8 }}

// Stagger children (list items appearing)
transition={{ staggerChildren: 0.08 }}
```

### Easing Conventions

```typescript
// Standard enter
ease: 'easeOut'

// Bouncy appear (buttons, badges)
ease: [0.34, 1.56, 0.64, 1]  // Spring-like

// Smooth exit
ease: 'easeIn'

// GSAP equivalents
ease: 'power2.out'   // Standard
ease: 'back.out(1.7)' // Bouncy
ease: 'sine.inOut'   // Smooth oscillation
```

### Standard Entry Animations

```typescript
// Fade up — default for content sections
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: 'easeOut' }}

// Scale in — cards, modals
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.3, ease: 'easeOut' }}

// Slide in from right — next lesson navigation
initial={{ opacity: 0, x: 24 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -24 }}
```

---

## Layout System

### Page Layouts

```
Landing page:      max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Lesson page:       Sidebar (256px fixed) + main (flex-1, max-w-3xl)
Dashboard:         Sidebar (256px fixed) + main (flex-1)
Auth pages:        Centered card, max-w-md mx-auto
```

### Lesson Page Specific

```typescript
// Lesson content width — optimised for readability (65-75 char line length)
<article className="prose prose-invert prose-lg max-w-prose">

// Animation containers — wider than prose
<div className="w-full my-8 -mx-4 px-4 sm:-mx-8 sm:px-8">  {/* Bleeds slightly */}

// Exercise containers — full content width
<div className="w-full rounded-xl border border-border bg-background-subtle my-8 p-6">
```

### Responsive Breakpoints

```
sm:   640px   — Larger phones, small tablets
md:   768px   — Tablets
lg:   1024px  — Laptops
xl:   1280px  — Desktops
2xl:  1536px  — Large monitors
```

**Mobile-first rules:**
- Sidebar collapses to hamburger menu on `< lg`
- Animation containers use `aspect-video` on mobile, fixed height on desktop
- Font sizes scale down one step on mobile: `text-3xl lg:text-4xl`
- Quiz options stack vertically on mobile (already default)

---

## Lesson Content Typography (`prose` customisation)

```typescript
// tailwind.config.ts — prose overrides for lesson content
typography: {
  invert: {
    css: {
      '--tw-prose-body': 'hsl(var(--foreground))',
      '--tw-prose-headings': 'hsl(var(--foreground))',
      '--tw-prose-lead': 'hsl(var(--foreground-muted))',
      '--tw-prose-links': 'hsl(var(--primary))',
      '--tw-prose-bold': 'hsl(var(--foreground))',
      '--tw-prose-counters': 'hsl(var(--foreground-muted))',
      '--tw-prose-bullets': 'hsl(var(--primary))',
      '--tw-prose-hr': 'hsl(var(--border))',
      '--tw-prose-quotes': 'hsl(var(--foreground-muted))',
      '--tw-prose-quote-borders': 'hsl(var(--primary))',
      '--tw-prose-captions': 'hsl(var(--foreground-muted))',
      '--tw-prose-code': 'hsl(var(--foreground))',
      '--tw-prose-pre-code': 'hsl(var(--foreground))',
      '--tw-prose-pre-bg': 'hsl(var(--background-muted))',
      '--tw-prose-th-borders': 'hsl(var(--border))',
      '--tw-prose-td-borders': 'hsl(var(--border))',
    },
  },
},
```

---

## Icons

Use **Lucide React** exclusively. No other icon libraries.

```typescript
import { ChevronRight, CheckCircle, Lock, Play, BookOpen } from 'lucide-react'

// Standard sizes
<ChevronRight className="h-4 w-4" />    // 16px — inline, buttons
<CheckCircle className="h-5 w-5" />     // 20px — status indicators
<Lock className="h-6 w-6" />            // 24px — feature icons
<BookOpen className="h-8 w-8" />        // 32px — section icons
```

---

## Loading States

**Every async operation must have a loading state.** No naked suspense without a skeleton.

```typescript
// Lesson content skeleton
export function LessonSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-3/4 rounded-lg bg-background-muted" />
      <div className="h-4 w-full rounded bg-background-muted" />
      <div className="h-4 w-5/6 rounded bg-background-muted" />
      <div className="h-64 w-full rounded-xl bg-background-muted" />
      <div className="h-4 w-full rounded bg-background-muted" />
      <div className="h-4 w-4/5 rounded bg-background-muted" />
    </div>
  )
}
```

---

## What To Never Do

```
❌ Purple gradients on white background (generic AI aesthetic)
❌ Rainbow or multi-color gradients
❌ Drop shadows on everything (use borders instead)
❌ Rounded corners > 16px on major containers
❌ More than 3 font weights on one page
❌ Animations that play on every hover (exhausting)
❌ More than 2 brand colors in a single component
❌ Font sizes below 12px
❌ Line lengths over 80 characters in prose
❌ Full-width buttons on desktop (max-w-xs or max-w-sm for single CTAs)
```

---

*Last updated: Phase 0*
*All values confirmed against Tailwind config and globals.css*