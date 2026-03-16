import Link from 'next/link'

import { createServerClient } from '@/lib/supabase/server'

import { AccountMenu } from './AccountMenu'

export async function TopNav() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-wide text-foreground/90">
          Prof Trading Course
        </Link>

        <nav className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/learn" className="text-foreground/70 hover:text-foreground">
            Learn
          </Link>
          {user ? (
            <AccountMenu email={user.email ?? 'Account'} />
          ) : (
            <>
              <Link href="/login" className="text-foreground/70 hover:text-foreground">
                Log in
              </Link>
              <Link href="/signup" className="text-foreground/70 hover:text-foreground">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

