import fs from 'node:fs/promises'
import path from 'node:path'

import { NextResponse } from 'next/server'
import { z } from 'zod'

const querySchema = z.object({
  lessonId: z.string().regex(/^\d+\.\d+$/),
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const lessonId = url.searchParams.get('lessonId') ?? ''
    const parsed = querySchema.parse({ lessonId })

    const filePath = path.join(process.cwd(), '..', '..', '..', 'content', 'quizzes', 'beginner.unit-1.json')
    const raw = await fs.readFile(filePath, 'utf8')
    const db = JSON.parse(raw) as QuizDb

    const lesson = db.lessons[parsed.lessonId]
    if (!lesson) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      lessonId: parsed.lessonId,
      questions: lesson.questions.map((q, idx) => ({
        id: `${parsed.lessonId}.${idx + 1}`,
        questionKey: q.questionKey,
        questionText: q.questionText,
        options: q.options,
        order: idx + 1,
      })),
      passingScore: db.passingScore,
      totalQuestions: lesson.questions.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

