import type { LessonFrontmatter } from '@/lib/mdx/loader'

const TIER_LABEL: Record<LessonFrontmatter['tier'], string> = {
  free: 'FREE',
  paid: 'PRO',
}

export function LessonHeader({ frontmatter }: { frontmatter: LessonFrontmatter }) {
  const tier = frontmatter.tier
  return (
    <header className="rounded-2xl border border-border bg-background-subtle p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={
            tier === 'free'
              ? 'inline-flex items-center rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success'
              : 'inline-flex items-center rounded-full border border-orange/30 bg-orange/10 px-2.5 py-0.5 text-xs font-semibold text-orange'
          }
        >
          {TIER_LABEL[tier]}
        </span>
        <div className="text-xs text-foreground/70">
          Unit {frontmatter.unit} · Lesson {frontmatter.lesson} · ~{frontmatter.estimatedMinutes} mins
        </div>
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">{frontmatter.title}</h1>
    </header>
  )
}

