'use client'

import { useState } from 'react'
import Link from 'next/link'

import { useCompletedLessons } from '@/lib/progress/useCompletedLessons'
import { useProgressStore } from '@/store/useProgressStore'

export function MobileSidebar({
  title,
  lessons,
  module,
  unit,
  currentLesson,
}: {
  title: string
  lessons: Array<{ slug: string; title: string; lessonId: string }>
  module: string
  unit: string
  currentLesson: string
}) {
  const [open, setOpen] = useState(false)
  const localIsComplete = useProgressStore((s) => s.isComplete)
  const serverCompleted = useCompletedLessons()
  const isComplete = (lessonId: string) => localIsComplete(lessonId) || serverCompleted.has(lessonId)

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background-subtle px-4 py-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
            {title}
          </div>
          <div className="truncate text-sm font-semibold">{currentLesson}</div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-border bg-background-muted px-4 py-2 text-sm font-semibold"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
            aria-label="Close sidebar"
          />
          <div className="absolute left-0 top-0 h-full w-[320px] border-r border-border bg-background-subtle p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Lessons</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-primary"
              >
                Close
              </button>
            </div>
            <div className="mt-6 space-y-1">
              {lessons.map((l) => {
                const isActive = l.slug === currentLesson
                const idx = lessons.findIndex((x) => x.slug === l.slug)
                const prevLessonId = idx > 0 ? lessons[idx - 1]?.lessonId : null
                const isLocked = prevLessonId ? !isComplete(prevLessonId) : false
                const done = isComplete(l.lessonId)
                return (
                  <Link
                    key={l.slug}
                    href={`/learn/${module}/${unit}/${l.slug}`}
                    onClick={() => setOpen(false)}
                    className={
                      isActive
                        ? 'block rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium'
                        : isLocked
                          ? 'block cursor-not-allowed rounded-lg px-3 py-2 text-sm text-foreground/70 opacity-50'
                          : 'block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-background-muted'
                    }
                    aria-disabled={isLocked}
                    onClickCapture={(e) => {
                      if (isLocked) {
                        e.preventDefault()
                        e.stopPropagation()
                      }
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>
                        {l.lessonId} {l.title}
                      </span>
                      <span className="text-xs">
                        {done ? <span className="text-success">✓</span> : isLocked ? '🔒' : null}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

