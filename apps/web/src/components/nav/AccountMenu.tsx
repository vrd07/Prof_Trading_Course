'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createBrowserClient } from '@/lib/supabase/client'

export function AccountMenu({ email }: { email: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const logout = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background-subtle px-4 py-2 text-sm font-semibold hover:bg-background-muted"
      >
        <span className="max-w-[180px] truncate">{email}</span>
        <span className="text-xs text-foreground/70">{open ? '▲' : '▼'}</span>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-[220px] overflow-hidden rounded-xl border border-border bg-background-subtle shadow-lg">
          <div className="px-4 py-3 text-xs text-foreground/70">Signed in</div>
          <div className="border-t border-border">
            <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-background-muted">
              Dashboard
            </Link>
            <Link href="/learn" className="block px-4 py-2 text-sm hover:bg-background-muted">
              Learn
            </Link>
          </div>
          <div className="border-t border-border">
            <button
              type="button"
              onClick={logout}
              className="w-full px-4 py-2 text-left text-sm font-semibold text-destructive hover:bg-background-muted"
            >
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

