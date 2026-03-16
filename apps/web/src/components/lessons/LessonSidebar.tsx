import Link from 'next/link'

const unit1Lessons = [
  {
    slug: '1.1-what-is-forex',
    title: '1.1 What is Forex?',
  },
  {
    slug: '1.2-who-are-the-players',
    title: '1.2 Who Are the Players?',
  },
  {
    slug: '1.3-how-currency-pairs-work',
    title: '1.3 How Currency Pairs Work',
  },
]

export function LessonSidebar({
  current,
}: {
  current: { module: string; unit: string; lesson: string }
}) {
  return (
    <aside className="hidden w-[280px] flex-shrink-0 border-r border-border bg-background-subtle lg:block">
      <div className="p-6">
        <Link href="/learn" className="text-sm font-semibold text-primary">
          ← Back to Learn
        </Link>
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
            Beginner · Unit 1
          </div>
          <div className="mt-3 space-y-1">
            {unit1Lessons.map((l) => {
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
                  {l.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

