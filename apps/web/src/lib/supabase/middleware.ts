import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import type { Database } from '@trading-course/types'
import { createServerClient } from '@supabase/auth-helpers-nextjs'

export function createSupabaseMiddlewareClient(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          res.cookies.set({ name, value, ...(options as any) })
        },
        remove(name: string, options: Record<string, unknown>) {
          res.cookies.set({ name, value: '', ...(options as any) })
        },
      },
    }
  )
  return { supabase, res }
}

