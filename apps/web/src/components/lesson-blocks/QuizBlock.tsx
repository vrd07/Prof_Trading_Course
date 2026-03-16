import { QuizPlaceholder } from './QuizPlaceholder'

export function QuizBlock({ lessonId }: { lessonId: string; questionIds: string[] }) {
  return <QuizPlaceholder lessonId={lessonId} />
}

