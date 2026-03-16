import Link from 'next/link'

import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const completed =
    user
      ? await supabase
          .from('user_progress' as any)
          .select('lesson_id, completed_at')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
      : null

  const completedLessons =
    (completed && 'data' in completed ? ((completed as any).data as Array<{ lesson_id: string }> | null) : null) ?? []

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Your account progress (from Supabase).
            </p>
          </div>
          <Link href="/learn" className="text-sm font-semibold text-primary">
            Go to lessons →
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-background-subtle p-6">
          <div className="text-sm font-semibold">Session</div>
          <div className="mt-2 text-sm text-foreground/70">
            {user?.email ? `Logged in as ${user.email}` : 'Not logged in'}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-background-subtle p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="text-sm font-semibold">Progress</div>
            <div className="text-xs text-foreground/70">
              Completed lessons: {completedLessons.length}
            </div>
          </div>

          {user ? (
            completedLessons.length ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {completedLessons.map((l) => (
                  <div
                    key={l.lesson_id}
                    className="rounded-xl border border-border bg-background-muted px-4 py-3 text-sm"
                  >
                    Lesson {l.lesson_id} ✓
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-sm text-foreground/70">
                No completed lessons yet. Complete a lesson quiz to record progress.
              </div>
            )
          ) : (
            <div className="mt-3 text-sm text-foreground/70">
              Log in to save progress to your account.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

