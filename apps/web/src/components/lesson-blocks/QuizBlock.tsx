/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useMemo, useState } from 'react'

import { useProgressStore } from '@/store/useProgressStore'

interface QuizQuestion {
  questionKey: string
  questionText: string
  options: string[]
  order: number
}

interface QuizGetResponse {
  lessonId: string
  questions: QuizQuestion[]
  passingScore: number
  totalQuestions: number
}

interface QuizSubmitResponse {
  score: number
  total: number
  passed: boolean
  passingScore: number
  results: Array<{
    questionKey: string
    selectedIndex: number
    correctIndex: number
    isCorrect: boolean
    explanation: string
  }>
}

export function QuizBlock({
  lessonId,
  questionIds,
  passingScore = 4,
}: {
  lessonId: string
  questionIds: string[]
  passingScore?: number
}) {
  const markComplete = useProgressStore((s) => s.markComplete)
  const isComplete = useProgressStore((s) => s.isComplete(lessonId))

  const [data, setData] = useState<QuizGetResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState<QuizSubmitResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const expectedCount = questionIds.length

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setError(null)
      const res = await fetch(`/api/quiz?lessonId=${encodeURIComponent(lessonId)}`)
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(j?.error ?? 'Failed to load quiz')
      }
      const j = (await res.json()) as QuizGetResponse
      if (!cancelled) setData(j)
    }

    load().catch((e: unknown) => {
      if (cancelled) return
      setError(e instanceof Error ? e.message : 'Failed to load quiz')
    })

    return () => {
      cancelled = true
    }
  }, [lessonId])

  const questions = useMemo(() => data?.questions ?? [], [data])
  const total = data?.totalQuestions ?? expectedCount
  const effectivePassing = data?.passingScore ?? passingScore

  const handleSelect = async (optionIndex: number) => {
    if (!data) return
    const nextAnswers = [...answers]
    nextAnswers[current] = optionIndex
    setAnswers(nextAnswers)

    const isLast = current + 1 >= questions.length
    if (!isLast) {
      setCurrent((c) => c + 1)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lessonId, answers: nextAnswers }),
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(j?.error ?? 'Failed to submit quiz')
      }
      const j = (await res.json()) as QuizSubmitResponse
      setSubmitted(j)
      if (j.passed) markComplete(lessonId)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to submit quiz')
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="my-8 rounded-2xl border border-border bg-background-subtle p-6">
        <div className="text-sm font-semibold">🧠 Quiz</div>
        <div className="mt-2 text-sm text-destructive">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="my-8 rounded-2xl border border-border bg-background-subtle p-6">
        <div className="text-sm font-semibold">🧠 Quiz</div>
        <div className="mt-2 text-sm text-foreground/70">Loading…</div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="my-8 rounded-2xl border border-border bg-background-subtle p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="text-sm font-semibold">🧠 Quiz</div>
          <div className="text-xs text-foreground/70">Lesson {lessonId}</div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="text-base font-semibold">
            Score: {submitted.score}/{submitted.total}
          </div>
          <div
            className={
              submitted.passed
                ? 'rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success'
                : 'rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive'
            }
          >
            {submitted.passed ? 'PASSED' : 'TRY AGAIN'}
          </div>
          <div className="text-xs text-foreground/70">Passing score: {effectivePassing}</div>
        </div>

        {submitted.passed ? (
          <div className="mt-4 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success">
            Lesson unlocked. (Progress saved locally for demo.)
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSubmitted(null)
              setCurrent(0)
              setAnswers([])
            }}
            className="mt-4 rounded-full border border-border bg-background-muted px-4 py-2 text-sm font-semibold"
          >
            Retry quiz
          </button>
        )}

        <div className="mt-6 space-y-3">
          {submitted.results.map((r) => (
            <div key={r.questionKey} className="rounded-xl border border-border bg-background-muted p-4">
              <div className="text-xs font-semibold text-foreground/70">{r.questionKey}</div>
              <div className="mt-2 text-sm">
                {r.isCorrect ? (
                  <span className="font-semibold text-success">Correct</span>
                ) : (
                  <span className="font-semibold text-destructive">Incorrect</span>
                )}
              </div>
              <div className="mt-2 text-sm text-foreground/70">{r.explanation}</div>
            </div>
          ))}
        </div>

        {isComplete ? (
          <div className="mt-6 text-xs text-foreground/70">Status: completed</div>
        ) : null}
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="my-8 rounded-2xl border border-border bg-background-subtle p-6">
      <div className="flex items-center justify-between gap-6">
        <div className="text-sm font-semibold">🧠 Quiz</div>
        <div className="text-xs text-foreground/70">
          Q{current + 1}/{total}
        </div>
      </div>
      <div className="mt-4 text-base font-semibold">{q.questionText}</div>
      <div className="mt-4 grid gap-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSelect(idx)}
            className="w-full rounded-xl border border-border bg-background-muted p-4 text-left text-sm transition-colors hover:bg-background-subtle disabled:opacity-60"
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs text-foreground/70">
        Must score {effectivePassing}/{total} to unlock next lesson.
      </div>
    </div>
  )
}

