import Link from 'next/link'

import type { LessonFrontmatter } from '@/lib/mdx/loader'

export function LessonNavigation({
  frontmatter,
  module,
  unit,
}: {
  frontmatter: LessonFrontmatter
  module: string
  unit: string
}) {
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
            href={`/learn/${module}/${unit}/${frontmatter.next.slug}`}
            className="block rounded-xl border border-border bg-background-subtle p-4 transition-colors hover:bg-background-muted"
          >
            <div className="text-xs text-foreground/70">Next</div>
            <div className="mt-1 font-medium">{frontmatter.next.title}</div>
          </Link>
        ) : null}
      </div>
    </div>
  )
}

