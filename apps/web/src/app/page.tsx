import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide text-foreground/80">
            Prof Trading Course
          </div>
          <Link href="/learn" className="text-sm font-semibold text-primary">
            Open demo →
          </Link>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">
              Learn Forex by doing — animated, interactive lessons.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-foreground/70">
              This is the early build demo: Lesson 1.1–1.3 render from MDX with the course layout,
              nav, and placeholder interactive blocks.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/learn"
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white hover:opacity-95"
              >
                Start Unit 1 demo
              </Link>
              <Link
                href="/learn/beginner/unit-1-how-forex-works/1.1-what-is-forex"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background-subtle px-6 text-sm font-semibold hover:bg-background-muted"
              >
                Jump to Lesson 1.1
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background-subtle p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              Demo checklist
            </div>
            <ul className="mt-4 space-y-3 text-sm text-foreground/80">
              <li className="flex items-start justify-between gap-4">
                <span>MDX lessons render</span>
                <span className="text-success">OK</span>
              </li>
              <li className="flex items-start justify-between gap-4">
                <span>Course layout + nav</span>
                <span className="text-success">OK</span>
              </li>
              <li className="flex items-start justify-between gap-4">
                <span>Animations/exercises/quizzes</span>
                <span className="text-warning">Placeholders</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
