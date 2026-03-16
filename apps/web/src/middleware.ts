import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  const { supabase, res } = createSupabaseMiddlewareClient(req)

  // Refresh session on every call
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname
  const isDashboardRoute = pathname.startsWith('/dashboard')

  if (isDashboardRoute && !session) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

