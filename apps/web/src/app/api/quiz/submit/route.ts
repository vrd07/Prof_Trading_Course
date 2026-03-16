import fs from 'node:fs/promises'
import path from 'node:path'

import { NextResponse } from 'next/server'
import { z } from 'zod'

const requestSchema = z.object({
  lessonId: z.string().regex(/^\d+\.\d+$/),
  answers: z.array(z.number().int().min(0).max(3)).length(5),
})

type QuizDb = {
  passingScore: number
  lessons: Record<
    string,
    {
      lessonId: string
      questions: Array<{
        questionKey: string
        questionText: string
        options: string[]
        correctIndex: number
        explanation: string
      }>
    }
  >
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = requestSchema.parse(body)

    const filePath = path.join(process.cwd(), '..', '..', '..', 'content', 'quizzes', 'beginner.unit-1.json')
    const raw = await fs.readFile(filePath, 'utf8')
    const db = JSON.parse(raw) as QuizDb

    const lesson = db.lessons[parsed.lessonId]
    if (!lesson) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const results = lesson.questions.map((q, i) => {
      const selectedIndex = parsed.answers[i]
      return {
        questionKey: q.questionKey,
        selectedIndex,
        correctIndex: q.correctIndex,
        isCorrect: selectedIndex === q.correctIndex,
        explanation: q.explanation,
      }
    })

    const score = results.filter((r) => r.isCorrect).length
    const passed = score >= db.passingScore

    return NextResponse.json({
      score,
      total: lesson.questions.length,
      passed,
      passingScore: db.passingScore,
      results,
      attemptNumber: 1,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

