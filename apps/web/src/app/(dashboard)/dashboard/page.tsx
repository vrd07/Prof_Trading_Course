import Link from 'next/link'

import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Skeleton page — progress and streak come next.
            </p>
          </div>
          <Link href="/learn" className="text-sm font-semibold text-primary">
            Go to lessons →
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-background-subtle p-6">
          <div className="text-sm font-semibold">Session</div>
          <div className="mt-2 text-sm text-foreground/70">
            {session?.user?.email ? `Logged in as ${session.user.email}` : 'No session found'}
          </div>
        </div>
      </div>
    </div>
  )
}

