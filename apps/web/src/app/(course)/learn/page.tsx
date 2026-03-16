import Link from 'next/link'

const lessonLinks = [
  {
    title: 'Lesson 1.1 — What is Forex?',
    href: '/learn/beginner/unit-1-how-forex-works/1.1-what-is-forex',
    meta: 'Free · Unit 1 · ~9 mins',
  },
  {
    title: 'Lesson 1.2 — Who Are the Players?',
    href: '/learn/beginner/unit-1-how-forex-works/1.2-who-are-the-players',
    meta: 'Free · Unit 1 · ~10 mins',
  },
  {
    title: 'Lesson 1.3 — How Currency Pairs Work',
    href: '/learn/beginner/unit-1-how-forex-works/1.3-how-currency-pairs-work',
    meta: 'Free · Unit 1 · ~10 mins',
  },
]

export default function LearnIndexPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="space-y-2">
        <div className="text-sm font-medium text-foreground/70">Demo</div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Beginner · Unit 1</h1>
        <p className="text-foreground/70">
          This is a demo build rendering Lesson 1.1–1.3 from MDX.
        </p>
      </div>

      <div className="mt-10 grid gap-4">
        {lessonLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl border border-border bg-background-subtle p-5 transition-colors hover:bg-background-muted"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-base font-semibold">{l.title}</div>
                <div className="mt-1 text-sm text-foreground/70">{l.meta}</div>
              </div>
              <div className="text-sm text-primary">Open</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

