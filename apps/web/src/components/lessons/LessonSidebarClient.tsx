'use client'

import Link from 'next/link'

import { useProgressStore } from '@/store/useProgressStore'

export function LessonSidebarClient({
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
  const isComplete = useProgressStore((s) => s.isComplete)

  return (
    <aside className="hidden w-[280px] flex-shrink-0 border-r border-border bg-background-subtle lg:block">
      <div className="p-6">
        <Link href="/learn" className="text-sm font-semibold text-primary">
          ← Back to Learn
        </Link>
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">{title}</div>
          <div className="mt-3 space-y-1">
            {lessons.map((l, idx) => {
              const isActive = currentLesson === l.slug
              const prevLessonId = idx > 0 ? lessons[idx - 1]?.lessonId : null
              const isLocked = prevLessonId ? !isComplete(prevLessonId) : false
              const done = isComplete(l.lessonId)

              return (
                <Link
                  key={l.slug}
                  href={isLocked ? '#' : `/learn/${module}/${unit}/${l.slug}`}
                  aria-disabled={isLocked}
                  className={[
                    'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm',
                    isActive ? 'border border-primary/30 bg-primary/10 font-medium' : '',
                    isLocked ? 'cursor-not-allowed opacity-50' : 'text-foreground/80 hover:bg-background-muted',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={(e) => {
                    if (isLocked) e.preventDefault()
                  }}
                >
                  <span>
                    {l.lessonId} {l.title}
                  </span>
                  <span className="text-xs">
                    {done ? <span className="text-success">✓</span> : isLocked ? '🔒' : null}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

