import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createServerClient } from '@/lib/supabase/server'

const querySchema = z.object({
  lessonId: z.string().regex(/^\d+\.\d+$/),
})

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const lessonId = url.searchParams.get('lessonId') ?? ''
    const parsed = querySchema.parse({ lessonId })

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('quiz_questions')
      .select('question_key, question_text, options, order')
      .eq('lesson_id', parsed.lessonId)
      .order('order', { ascending: true })

    const questions =
      (data as { question_key: string; question_text: string; options: string[]; order: number | null }[] | null) ??
      null

    if (error) {
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      lessonId: parsed.lessonId,
      questions: questions.map((q, idx) => ({
        id: `${parsed.lessonId}.${idx + 1}`,
        questionKey: q.question_key,
        questionText: q.question_text,
        options: q.options as string[],
        order: q.order ?? idx + 1,
      })),
      // Business rule from docs: pass threshold is 4/5
      passingScore: 4,
      totalQuestions: questions.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

