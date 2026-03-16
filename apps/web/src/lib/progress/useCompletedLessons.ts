'use client'

import { useEffect, useMemo, useState } from 'react'

export function useCompletedLessons() {
  const [completed, setCompleted] = useState<string[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const res = await fetch('/api/progress')
      if (!res.ok) throw new Error('Failed to load progress')
      const j = (await res.json()) as { completedLessons?: string[] }
      if (!cancelled) setCompleted(j.completedLessons ?? [])
    }

    load().catch(() => {
      if (!cancelled) setCompleted([])
    })

    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => new Set(completed ?? []), [completed])
}

