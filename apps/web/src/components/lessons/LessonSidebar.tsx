import Link from 'next/link'

export function LessonSidebar({
  current,
  title,
  lessons,
}: {
  current: { module: string; unit: string; lesson: string }
  title: string
  lessons: Array<{ slug: string; title: string; lessonId: string }>
}) {
  return (
    <aside className="hidden w-[280px] flex-shrink-0 border-r border-border bg-background-subtle lg:block">
      <div className="p-6">
        <Link href="/learn" className="text-sm font-semibold text-primary">
          ← Back to Learn
        </Link>
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
            {title}
          </div>
          <div className="mt-3 space-y-1">
            {lessons.map((l) => {
              const isActive = current.lesson === l.slug
              return (
                <Link
                  key={l.slug}
                  href={`/learn/${current.module}/${current.unit}/${l.slug}`}
                  className={
                    isActive
                      ? 'block rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-medium'
                      : 'block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-background-muted'
                  }
                >
                  {l.lessonId} {l.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

