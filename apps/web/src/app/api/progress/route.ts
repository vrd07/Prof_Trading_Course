import { NextResponse } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ completedLessons: [] as string[] })
  }

  const { data, error } = await supabase
    .from('user_progress' as any)
    .select('lesson_id')
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 })
  }

  const completedLessons = (data as Array<{ lesson_id: string }> | null)?.map((r) => r.lesson_id) ?? []
  return NextResponse.json({ completedLessons })
}

