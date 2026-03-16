import Link from 'next/link'

import type { TocItem } from '@/lib/mdx/toc'

export function LessonToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null

  return (
    <aside className="hidden xl:block xl:w-[280px] xl:flex-shrink-0">
      <div className="sticky top-8 rounded-2xl border border-border bg-background-subtle p-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
          On this page
        </div>
        <nav className="mt-3 space-y-1">
          {items.map((i) => (
            <Link
              key={i.id}
              href={`#${i.id}`}
              className={
                i.depth === 2
                  ? 'block rounded-md px-2 py-1 text-sm text-foreground/80 hover:bg-background-muted'
                  : 'block rounded-md px-2 py-1 pl-5 text-sm text-foreground/70 hover:bg-background-muted'
              }
            >
              {i.text}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

