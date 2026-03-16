# 🧠 SKILLS — How to Build Every Feature in This Project
> **The pattern library. Before building any component or feature, find the relevant pattern here and follow it exactly.**

---

## Table of Contents

1. [Component Architecture Rules](#1-component-architecture-rules)
2. [Building Lesson Pages](#2-building-lesson-pages)
3. [Building Animation Components](#3-building-animation-components)
4. [Building Interactive Exercises](#4-building-interactive-exercises)
5. [Building the Quiz System](#5-building-the-quiz-system)
6. [Building the Auth System](#6-building-the-auth-system)
7. [Building the Payment & Paywall System](#7-building-the-payment--paywall-system)
8. [Building the Progress System](#8-building-the-progress-system)
9. [Database Query Patterns](#9-database-query-patterns)
10. [API Route Patterns](#10-api-route-patterns)
11. [MDX Content Patterns](#11-mdx-content-patterns)
12. [TypeScript Patterns](#12-typescript-patterns)
13. [Error Handling Patterns](#13-error-handling-patterns)
14. [Performance Patterns](#14-performance-patterns)

---

## 1. Component Architecture Rules

### The Golden Rule: Server vs Client

Default to **Server Components**. Add `'use client'` only when the component needs:
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`)
- React hooks (`useState`, `useEffect`, `useRef`)
- Animation libraries (GSAP, Framer Motion, D3)

```typescript
// ✅ Server Component (default) — no directive needed
// apps/web/components/lessons/LessonHeader.tsx
import { getLessonMeta } from '@/lib/mdx/loader'

export async function LessonHeader({ lessonId }: { lessonId: string }) {
  const meta = await getLessonMeta(lessonId) // Direct async call — no useEffect
  return (
    <header>
      <h1>{meta.title}</h1>
      <span>{meta.estimatedMinutes} min</span>
    </header>
  )
}

// ✅ Client Component — needs hooks and event handlers
// apps/web/components/quiz/QuizBlock.tsx
'use client'
import { useState } from 'react'

export function QuizBlock({ questions }: QuizBlockProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  // ...
}
```

### Component File Structure

Every component file follows this structure, in this order:

```typescript
// 1. Imports — external first, internal second, types last
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LessonMeta } from '@trading-course/types'

// 2. Types / interfaces for this component only
interface AnimatedChartProps {
  data: CandleData[]
  width?: number
  height?: number
  className?: string
}

// 3. Constants (if any)
const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 400

// 4. The component — named export always, default export only at file bottom
export function AnimatedCandlestickChart({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className,
}: AnimatedChartProps) {
  // hooks first
  const svgRef = useRef<SVGSVGElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // derived values
  const chartWidth = width - PADDING.left - PADDING.right

  // handlers
  const handlePlay = () => setIsPlaying(true)

  // render
  return (
    <div className={cn('relative w-full', className)}>
      {/* ... */}
    </div>
  )
}

// 5. Default export at bottom if needed by Next.js page convention
export default AnimatedCandlestickChart
```

### Folder Conventions

```
components/
├── animations/
│   ├── charts/           ← AnimatedCandlestickChart.tsx, MovingAverageOverlay.tsx
│   ├── concepts/         ← GlobalFlowMap.tsx, StopHuntSequence.tsx
│   └── formulas/         ← FormulaReveal.tsx, RiskRewardVisualizer.tsx
├── exercises/            ← TrendlineDrawer.tsx, PatternIdentifier.tsx
├── quiz/                 ← QuizBlock.tsx, QuizQuestion.tsx, QuizFeedback.tsx
├── lessons/              ← LessonRenderer.tsx, LessonHeader.tsx, LessonSidebar.tsx
├── dashboard/            ← ProgressOverview.tsx, StreakTracker.tsx
├── marketing/            ← HeroSection.tsx, PricingCards.tsx
└── shared/               ← Navbar.tsx, Footer.tsx, PaywallGate.tsx
```

---

## 2. Building Lesson Pages

### The Lesson Page (`app/(course)/learn/[module]/[unit]/[lesson]/page.tsx`)

This is the most important page in the application. It renders MDX content with embedded React components.

```typescript
// app/(course)/learn/[module]/[unit]/[lesson]/page.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getLessonContent } from '@/lib/mdx/loader'
import { mdxComponents } from '@/lib/mdx/components'
import { LessonHeader } from '@/components/lessons/LessonHeader'
import { LessonNavigation } from '@/components/lessons/LessonNavigation'
import { LessonSidebar } from '@/components/lessons/LessonSidebar'

interface LessonPageProps {
  params: {
    module: string   // e.g., 'beginner'
    unit: string     // e.g., 'unit-1-how-forex-works'
    lesson: string   // e.g., '1-1-what-is-forex'
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const lessonData = await getLessonContent(params.module, params.unit, params.lesson)

  if (!lessonData) notFound()

  const { mdxSource, frontmatter } = lessonData

  return (
    <div className="flex min-h-screen">
      <LessonSidebar
        currentModule={params.module}
        currentLesson={frontmatter.lessonId}
      />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <LessonHeader
          title={frontmatter.title}
          unit={frontmatter.unit}
          estimatedMinutes={frontmatter.estimatedMinutes}
          tier={frontmatter.tier}
        />
        <article className="prose prose-invert prose-lg mt-8">
          <Suspense fallback={<LessonSkeleton />}>
            <MDXRemote source={mdxSource} components={mdxComponents} />
          </Suspense>
        </article>
        <LessonNavigation
          prev={frontmatter.prev}
          next={frontmatter.next}
        />
      </main>
    </div>
  )
}

// Generate static params for all lessons at build time
export async function generateStaticParams() {
  return getAllLessonPaths() // Returns [{module, unit, lesson}] for all 88 lessons
}
```

### MDX Frontmatter Type

```typescript
// packages/types/src/lesson.ts
export interface LessonFrontmatter {
  title: string
  unit: number
  lesson: number
  lessonId: string         // e.g., '1.1'
  tier: 'free' | 'paid'
  estimatedMinutes: number
  prerequisites: string[]
  animationComponent?: string
  prev?: { title: string; slug: string }
  next?: { title: string; slug: string }
}
```

---

## 3. Building Animation Components

### Pattern A — GSAP Concept Animation (Scroll-triggered)

Use for: concept explainers that play automatically as the student scrolls to them.

```typescript
// components/animations/concepts/MarketHierarchyPyramid.tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MarketHierarchyPyramid() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      // Animate each tier appearing from top down
      tl.from('.pyramid-apex', {
        opacity: 0, scaleX: 0, duration: 0.6, ease: 'back.out(1.7)',
      })
      .from('.pyramid-tier-2', {
        opacity: 0, scaleX: 0, duration: 0.5, ease: 'back.out(1.7)',
      }, '-=0.2')
      .from('.pyramid-tier-3', {
        opacity: 0, scaleX: 0, duration: 0.5, ease: 'back.out(1.7)',
      }, '-=0.2')
      .from('.pyramid-tier-4', {
        opacity: 0, scaleX: 0, duration: 0.5, ease: 'back.out(1.7)',
      }, '-=0.2')
      .from('.pyramid-base', {
        opacity: 0, scaleX: 0, duration: 0.5, ease: 'back.out(1.7)',
      }, '-=0.2')
      .from('.pyramid-labels', {
        opacity: 0, x: 20, duration: 0.4, stagger: 0.1,
      }, '-=0.3')

    }, containerRef) // Scope GSAP to this container

    // CRITICAL: Always return cleanup to prevent memory leaks
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full py-8">
      <svg viewBox="0 0 600 400" className="w-full">
        {/* Pyramid SVG shapes with className targets for GSAP */}
        <polygon className="pyramid-apex" points="300,20 340,80 260,80" fill="hsl(var(--primary))" />
        <polygon className="pyramid-tier-2" points="260,90 340,90 380,150 220,150" fill="hsl(var(--primary) / 0.8)" />
        {/* ... more tiers */}
        <g className="pyramid-labels">
          {/* Labels */}
        </g>
      </svg>
    </div>
  )
}
```

### Pattern B — D3 Chart Animation (React-controlled)

Use for: candlestick charts, moving averages, indicators — anything data-driven.

```typescript
// components/animations/charts/AnimatedCandlestickChart.tsx
'use client'
import { useMemo, useState } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import type { CandleData } from '@trading-course/types'

interface AnimatedCandlestickChartProps {
  data: CandleData[]
  visibleCount?: number    // Animate candles appearing one by one
  width?: number
  height?: number
}

const MARGIN = { top: 20, right: 20, bottom: 40, left: 60 }

export function AnimatedCandlestickChart({
  data,
  visibleCount = 0,
  width = 700,
  height = 350,
}: AnimatedCandlestickChartProps) {
  const innerWidth = width - MARGIN.left - MARGIN.right
  const innerHeight = height - MARGIN.top - MARGIN.bottom

  // D3 for math only — scales and domains
  const visibleData = visibleCount > 0 ? data.slice(0, visibleCount) : data

  const xScale = useMemo(() =>
    d3.scaleBand()
      .domain(visibleData.map(d => String(d.timestamp)))
      .range([0, innerWidth])
      .padding(0.2),
    [visibleData, innerWidth]
  )

  const yScale = useMemo(() => {
    const prices = visibleData.flatMap(d => [d.high, d.low])
    return d3.scaleLinear()
      .domain([d3.min(prices)! * 0.999, d3.max(prices)! * 1.001])
      .range([innerHeight, 0])
  }, [visibleData, innerHeight])

  // React renders SVG — not D3
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        {visibleData.map((candle, i) => {
          const x = xScale(String(candle.timestamp))!
          const candleWidth = xScale.bandwidth()
          const isBullish = candle.close >= candle.open

          return (
            // Framer Motion animates each candle appearing
            <motion.g
              key={candle.timestamp}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              style={{ transformOrigin: `${x + candleWidth / 2}px ${yScale(candle.low)}px` }}
            >
              {/* Wick */}
              <line
                x1={x + candleWidth / 2}
                x2={x + candleWidth / 2}
                y1={yScale(candle.high)}
                y2={yScale(candle.low)}
                stroke={isBullish ? '#34d399' : '#f87171'}
                strokeWidth={1}
              />
              {/* Body */}
              <rect
                x={x}
                y={yScale(Math.max(candle.open, candle.close))}
                width={candleWidth}
                height={Math.abs(yScale(candle.open) - yScale(candle.close)) || 1}
                fill={isBullish ? '#34d399' : '#f87171'}
                rx={1}
              />
            </motion.g>
          )
        })}
      </g>
    </svg>
  )
}
```

### Pattern C — Step-by-Step Formula Reveal (KaTeX)

Use for: mathematical formula breakdowns in quant lessons.

```typescript
// components/animations/formulas/FormulaReveal.tsx
'use client'
import { useState } from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@trading-course/ui'
import 'katex/dist/katex.min.css'

interface FormulaStep {
  label: string
  formula: string
  explanation: string
}

interface FormulaRevealProps {
  title: string
  steps: FormulaStep[]
}

export function FormulaReveal({ title, steps }: FormulaRevealProps) {
  const [visibleSteps, setVisibleSteps] = useState(1)

  return (
    <div className="rounded-xl border border-border bg-card p-6 my-6">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        <AnimatePresence>
          {steps.slice(0, visibleSteps).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex gap-4 items-start"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs
                              flex items-center justify-center flex-shrink-0 mt-1">
                {i + 1}
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">{step.label}</div>
                <BlockMath math={step.formula} />
                <p className="text-sm text-muted-foreground mt-2">{step.explanation}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {visibleSteps < steps.length && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setVisibleSteps(v => v + 1)}
        >
          Show next step →
        </Button>
      )}
    </div>
  )
}
```

---

## 4. Building Interactive Exercises

### Base Exercise Pattern

All exercises share a common pattern: instruction → interaction → validation → feedback.

```typescript
// components/exercises/DragDropExercise.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DragDropExerciseProps {
  items: ExerciseItem[]
  targets: ExerciseTarget[]
  onComplete: (score: number, total: number) => void
}

export function DragDropExercise({ items, targets, onComplete }: DragDropExerciseProps) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect' | null>>({})
  const [isChecked, setIsChecked] = useState(false)

  const handleDrop = (itemId: string, targetId: string) => {
    setMatches(prev => ({ ...prev, [targetId]: itemId }))
  }

  const handleCheck = () => {
    const newFeedback: Record<string, 'correct' | 'incorrect' | null> = {}
    let correct = 0

    targets.forEach(target => {
      const userAnswer = matches[target.id]
      const isCorrect = userAnswer === target.correctItemId
      newFeedback[target.id] = isCorrect ? 'correct' : 'incorrect'
      if (isCorrect) correct++
    })

    setFeedback(newFeedback)
    setIsChecked(true)
    onComplete(correct, targets.length)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 my-8">
      {/* Draggable items */}
      {/* Drop targets */}
      {/* Check button */}
      {/* Animated feedback */}
    </div>
  )
}
```

### Trendline Drawing Exercise

```typescript
// components/exercises/TrendlineDrawer.tsx
'use client'
import { useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'

// Students draw trendlines on a chart by clicking two points
// Validates against correct trendline angle range

export function TrendlineDrawer({ chartData, correctAngleRange }: TrendlineDrawerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [points, setPoints] = useState<[number, number][]>([])
  const [userLine, setUserLine] = useState<TrendLine | null>(null)
  const [validation, setValidation] = useState<'correct' | 'close' | 'incorrect' | null>(null)

  const handleSvgClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (points.length >= 2) return
    const svg = svgRef.current!
    const rect = svg.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const newPoints: [number, number][] = [...points, [x, y]]
    setPoints(newPoints)

    if (newPoints.length === 2) {
      const angle = Math.atan2(
        newPoints[1][1] - newPoints[0][1],
        newPoints[1][0] - newPoints[0][0]
      ) * (180 / Math.PI)
      setUserLine({ points: newPoints, angle })
      validateLine(angle)
    }
  }, [points])

  // ...
}
```

---

## 5. Building the Quiz System

### QuizBlock Component

The QuizBlock is embedded directly in MDX via `<QuizBlock questionIds={["q1","q2","q3"]} />`.

```typescript
// components/quiz/QuizBlock.tsx
'use client'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { QuizQuestion } from './QuizQuestion'
import { QuizScore } from './QuizScore'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizBlockProps {
  questionIds: string[]
  lessonId: string
  passingScore?: number    // Default 4 out of 5
}

export function QuizBlock({ questionIds, lessonId, passingScore = 4 }: QuizBlockProps) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quiz-questions', lessonId],
    queryFn: () => fetch(`/api/quiz?lessonId=${lessonId}`).then(r => r.json()),
  })

  const submitMutation = useMutation({
    mutationFn: (finalAnswers: number[]) =>
      fetch('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ lessonId, answers: finalAnswers }),
      }).then(r => r.json()),
    onSuccess: (data) => {
      if (data.passed) {
        // Mark lesson as complete
        fetch('/api/progress/complete', {
          method: 'POST',
          body: JSON.stringify({ lessonId }),
        })
      }
    },
  })

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    if (newAnswers.length === questions.length) {
      setIsComplete(true)
      submitMutation.mutate(newAnswers)
    } else {
      setTimeout(() => setCurrentQ(q => q + 1), 1200) // Delay for feedback animation
    }
  }

  if (isLoading) return <QuizSkeleton />

  if (isComplete) {
    const score = answers.filter((a, i) => a === questions[i].correctIndex).length
    return (
      <QuizScore
        score={score}
        total={questions.length}
        passed={score >= passingScore}
        lessonId={lessonId}
      />
    )
  }

  return (
    <div className="my-8 rounded-xl border border-border bg-card overflow-hidden">
      <QuizProgress current={currentQ + 1} total={questions.length} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <QuizQuestion
            question={questions[currentQ]}
            onAnswer={handleAnswer}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
```

---

## 6. Building the Auth System

### Signup Flow

```typescript
// app/(auth)/signup/page.tsx
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8">Start learning for free</h1>
        <SignupForm />
      </div>
    </div>
  )
}
```

```typescript
// components/auth/SignupForm.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { signupSchema, type SignupFormData } from '@trading-course/types'

export function SignupForm() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { display_name: data.name },
      },
    })
    if (!error) router.push('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Fields */}
    </form>
  )
}
```

---

## 7. Building the Payment & Paywall System

### Paywall Gate Component

Wraps any content that requires a paid subscription.

```typescript
// components/shared/PaywallGate.tsx
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { UpgradePrompt } from './UpgradePrompt'

interface PaywallGateProps {
  children: React.ReactNode
  tier: 'free' | 'paid'
}

export async function PaywallGate({ children, tier }: PaywallGateProps) {
  if (tier === 'free') return <>{children}</>

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return <UpgradePrompt reason="auth" />

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', session.user.id)
    .eq('status', 'active')
    .single()

  if (!sub) return <UpgradePrompt reason="upgrade" />

  return <>{children}</>
}
```

### Checkout Button

```typescript
// components/shared/CheckoutButton.tsx
'use client'
import { useState } from 'react'
import { Button } from '@trading-course/ui'

interface CheckoutButtonProps {
  priceId: string
  label: string
  variant?: 'default' | 'outline'
}

export function CheckoutButton({ priceId, label, variant = 'default' }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const { url } = await res.json()
      window.location.href = url   // Redirect to Stripe hosted checkout
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Redirecting...' : label}
    </Button>
  )
}
```

---

## 8. Building the Progress System

### Progress Tracking Hook

```typescript
// hooks/useProgress.ts
'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useProgress() {
  const queryClient = useQueryClient()

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => fetch('/api/progress').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  const markComplete = useMutation({
    mutationFn: (lessonId: string) =>
      fetch('/api/progress/complete', {
        method: 'POST',
        body: JSON.stringify({ lessonId }),
      }),
    onMutate: async (lessonId) => {
      // Optimistic update — mark complete immediately in UI
      await queryClient.cancelQueries({ queryKey: ['progress'] })
      const previous = queryClient.getQueryData(['progress'])
      queryClient.setQueryData(['progress'], (old: any) => ({
        ...old,
        completedLessons: [...(old?.completedLessons ?? []), lessonId],
      }))
      return { previous }
    },
    onError: (_, __, context) => {
      // Rollback on error
      queryClient.setQueryData(['progress'], context?.previous)
    },
  })

  const isComplete = (lessonId: string) =>
    progress?.completedLessons?.includes(lessonId) ?? false

  const getModuleProgress = (moduleSlug: string): number => {
    if (!progress) return 0
    const moduleLessons = progress.lessonsByModule?.[moduleSlug] ?? []
    const completed = moduleLessons.filter((id: string) => isComplete(id)).length
    return moduleLessons.length > 0 ? (completed / moduleLessons.length) * 100 : 0
  }

  return { progress, markComplete, isComplete, getModuleProgress }
}
```

---

## 9. Database Query Patterns

### Typed Supabase Queries

```typescript
// packages/db/src/queries/progress.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@trading-course/types'

type TypedSupabaseClient = SupabaseClient<Database>

export async function getUserProgress(supabase: TypedSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('lesson_id, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch progress: ${error.message}`)
  return data
}

export async function markLessonComplete(
  supabase: TypedSupabaseClient,
  userId: string,
  lessonId: string
) {
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      { user_id: userId, lesson_id: lessonId, completed_at: new Date().toISOString() },
      { onConflict: 'user_id,lesson_id' }  // Idempotent — safe to call multiple times
    )

  if (error) throw new Error(`Failed to mark lesson complete: ${error.message}`)
}
```

---

## 10. API Route Patterns

### Standard API Route Structure

```typescript
// app/api/progress/complete/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { markLessonComplete } from '@trading-course/db'

const requestSchema = z.object({
  lessonId: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    // 1. Parse and validate request body
    const body = await req.json()
    const { lessonId } = requestSchema.parse(body)

    // 2. Get authenticated user
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 3. Execute business logic
    await markLessonComplete(supabase, session.user.id, lessonId)

    // 4. Return success
    return NextResponse.json({ success: true })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 })
    }
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## 11. MDX Content Patterns

### Lesson MDX File Template

```mdx
---
title: "Lesson Title Here"
unit: 1
lesson: 1
lessonId: "1.1"
tier: "free"
estimatedMinutes: 9
prerequisites: []
animationComponent: "GlobalFlowMap"
prev: null
next:
  title: "Who Are the Players?"
  slug: "1.2-who-are-the-players"
---

## Section Title

Lesson prose content here...

<GlobalFlowMap />

More prose content...

<InteractiveExercise id="match-the-driver" lessonId="1.1" />

## Key Takeaways

Summary content...

<QuizBlock lessonId="1.1" questionIds={["1.1.q1", "1.1.q2", "1.1.q3", "1.1.q4", "1.1.q5"]} />
```

### Adding a New Animation Component to MDX

When a new animation component is created, it must be registered in **two places**:

1. Create the component file in `apps/web/components/animations/`
2. Add it to `apps/web/lib/mdx/components.ts`

If step 2 is missed, the MDX will render nothing for that tag with no error — this is the most common bug when adding new animations.

---

## 12. TypeScript Patterns

### Strict No-Any Rule

```typescript
// ❌ Never
const data: any = await fetch(...)
function process(input: any) { ... }

// ✅ Always type explicitly
const data: LessonProgress[] = await fetch(...)
function process(input: QuizAnswer): ValidationResult { ... }

// ✅ When type is truly unknown, use unknown + type guard
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  }
}
```

### Shared Types Pattern

```typescript
// packages/types/src/lesson.ts
// All lesson-related types live here — imported by both apps/web and packages/db

export type LessonTier = 'free' | 'paid'
export type ModuleSlug = 'beginner' | 'intermediate' | 'advanced'

export interface LessonMeta {
  id: string
  title: string
  slug: string
  unit: number
  lesson: number
  tier: LessonTier
  estimatedMinutes: number
  module: ModuleSlug
}

export interface CandleData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}
```

---

## 13. Error Handling Patterns

### Client-Side Error Boundaries

```typescript
// app/error.tsx — catches rendering errors in the (course) layout
'use client'
export default function CourseError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-lg font-semibold">Something went wrong loading this lesson</h2>
      <p className="text-muted-foreground text-sm">{error.message}</p>
      <button onClick={reset} className="text-primary underline text-sm">Try again</button>
    </div>
  )
}
```

### Async Operation Pattern

```typescript
// Always handle loading + error states for async data
function LessonContent({ lessonId }: { lessonId: string }) {
  const { data, isLoading, isError, error } = useQuery(...)

  if (isLoading) return <LessonSkeleton />
  if (isError) return <ErrorState message={error.message} />
  if (!data) return <NotFound />

  return <>{/* Render data */}</>
}
```

---

## 14. Performance Patterns

### Lazy Load Heavy Components

```typescript
// Never import Pyodide, Monaco, or D3 at the top level of a page
// Use dynamic imports to split them into separate chunks

import dynamic from 'next/dynamic'

const PythonExercise = dynamic(
  () => import('@/components/exercises/PythonExercise'),
  {
    loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" />,
    ssr: false,  // Browser-only — Pyodide needs window
  }
)

// Same pattern for heavy chart animations
const AnimatedCandlestickChart = dynamic(
  () => import('@/components/animations/charts/AnimatedCandlestickChart'),
  { ssr: false }
)
```

### Image Optimisation

```typescript
// Always use Next.js Image component — never <img> tags
import Image from 'next/image'

<Image
  src="/images/chart-example.png"
  alt="EUR/USD candlestick chart showing a head and shoulders pattern"
  width={800}
  height={400}
  className="rounded-xl"
  priority={false}   // Only true for above-the-fold images
/>
```

### Bundle Size Monitoring

```bash
# Run after each significant feature addition
pnpm --filter web run build
# Check .next/analyze/ for bundle composition
# No single route should exceed 200KB first-load JS
```

---

## Quick Reference: Which Tool for Which Animation

| What you're animating | Use |
|---|---|
| Page/route transitions | Framer Motion |
| Component mount/unmount | Framer Motion + AnimatePresence |
| Hover and tap interactions | Framer Motion |
| Multi-step concept explainer (timed) | GSAP timeline |
| Scroll-triggered concept reveal | GSAP + ScrollTrigger |
| Candlestick charts, price data | D3 (math) + React (render) + Framer Motion (transitions) |
| Technical indicators (MA, RSI, MACD) | D3 (math) + React (render) |
| Formula step-by-step reveals | KaTeX + Framer Motion |
| Quiz feedback (correct/incorrect) | Framer Motion |
| Pre-built illustrative animations | Lottie |
| Lesson completion celebration | Lottie |
| Python code exercises | Monaco Editor + Pyodide |

---

*Last updated: Phase 0 — Pre-build*
*Add new patterns to this file as they are established during Phase 1*