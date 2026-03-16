import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createServerClient } from '@/lib/supabase/server'

const requestSchema = z.object({
  lessonId: z.string().regex(/^\d+\.\d+$/),
  answers: z.array(z.number().int().min(0).max(3)).length(5),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = requestSchema.parse(body)

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('quiz_questions')
      .select('question_key, correct_index, explanation, order')
      .eq('lesson_id', parsed.lessonId)
      .order('order', { ascending: true })

    const questions =
      (data as { question_key: string; correct_index: number; explanation: string; order: number | null }[] | null) ??
      null

    if (error) {
      return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const results = questions.map((q, i) => {
      const selectedIndex = parsed.answers[i]
      return {
        questionKey: q.question_key,
        selectedIndex,
        correctIndex: q.correct_index,
        isCorrect: selectedIndex === q.correct_index,
        explanation: q.explanation,
      }
    })

    const score = results.filter((r) => r.isCorrect).length
    const total = questions.length
    const passingScore = 4
    const passed = score >= passingScore

    // Try to persist attempt + progress if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let attemptNumber = 1

    if (user) {
      const { data: previousAttempts } = await supabase
        .from('quiz_attempts' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', parsed.lessonId)

      attemptNumber = (previousAttempts?.length ?? 0) + 1

      await supabase
        .from('quiz_attempts' as any)
        .insert({
          user_id: user.id,
          lesson_id: parsed.lessonId,
          score,
          total,
          passed,
          answers: parsed.answers,
          attempt_number: attemptNumber,
        } as any)

      if (passed) {
        await supabase
          .from('user_progress' as any)
          .upsert(
            { user_id: user.id, lesson_id: parsed.lessonId } as any,
            { onConflict: 'user_id,lesson_id' }
          )
      }
    }

    return NextResponse.json({
      score,
      total,
      passed,
      passingScore,
      results,
      attemptNumber,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

