import Link from 'next/link'

import { getLessonList, getModuleMeta, getUnitMeta } from '@/lib/content/course'

export default async function LearnIndexPage() {
  const moduleSlug = 'beginner'
  const unitSlug = 'unit-1-how-forex-works'

  const [moduleMeta, unitMeta, lessons] = await Promise.all([
    getModuleMeta(moduleSlug),
    getUnitMeta(moduleSlug, unitSlug),
    getLessonList(moduleSlug, unitSlug),
  ])

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="space-y-2">
        <div className="text-sm font-medium text-foreground/70">Demo</div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {moduleMeta.title} · {unitMeta.title}
        </h1>
        <p className="text-foreground/70">
          This is a demo build rendering Lesson 1.1–1.3 from MDX.
        </p>
      </div>

      <div className="mt-10 grid gap-4">
        {lessons.map((l) => (
          <Link
            key={l.slug}
            href={`/learn/${moduleSlug}/${unitSlug}/${l.slug}`}
            className="rounded-xl border border-border bg-background-subtle p-5 transition-colors hover:bg-background-muted"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-base font-semibold">
                  Lesson {l.lessonId} — {l.title}
                </div>
                <div className="mt-1 text-sm text-foreground/70">
                  {moduleMeta.tier === 'free' ? 'Free' : 'Paid'} · Unit {unitMeta.order}
                </div>
              </div>
              <div className="text-sm text-primary">Open</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

