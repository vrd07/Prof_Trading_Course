'use client'

import Link from 'next/link'

import type { LessonFrontmatter } from '@/lib/mdx/loader'
import { useProgressStore } from '@/store/useProgressStore'

export function LessonNavigationClient({
  frontmatter,
  module,
  unit,
}: {
  frontmatter: LessonFrontmatter
  module: string
  unit: string
}) {
  const isComplete = useProgressStore((s) => s.isComplete)

  const nextLocked =
    frontmatter.next && !isComplete(frontmatter.lessonId) ? true : false

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="min-h-[72px]">
        {frontmatter.prev ? (
          <Link
            href={`/learn/${module}/${unit}/${frontmatter.prev.slug}`}
            className="block rounded-xl border border-border bg-background-subtle p-4 transition-colors hover:bg-background-muted"
          >
            <div className="text-xs text-foreground/70">Previous</div>
            <div className="mt-1 font-medium">{frontmatter.prev.title}</div>
          </Link>
        ) : null}
      </div>
      <div className="min-h-[72px] sm:text-right">
        {frontmatter.next ? (
          <Link
            href={nextLocked ? '#' : `/learn/${module}/${unit}/${frontmatter.next.slug}`}
            aria-disabled={nextLocked}
            onClick={(e) => {
              if (nextLocked) e.preventDefault()
            }}
            className={[
              'block rounded-xl border border-border bg-background-subtle p-4 transition-colors hover:bg-background-muted',
              nextLocked ? 'cursor-not-allowed opacity-50' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="text-left sm:text-right">
                <div className="text-xs text-foreground/70">Next</div>
                <div className="mt-1 font-medium">{frontmatter.next.title}</div>
              </div>
              <div className="text-xs">{nextLocked ? '🔒' : '→'}</div>
            </div>
          </Link>
        ) : null}
      </div>
    </div>
  )
}

