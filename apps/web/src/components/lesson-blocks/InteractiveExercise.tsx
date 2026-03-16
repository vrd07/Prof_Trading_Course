import { InteractiveExercisePlaceholder } from './InteractiveExercisePlaceholder'

export function InteractiveExercise({ id, lessonId }: { id: string; lessonId: string }) {
  return <InteractiveExercisePlaceholder id={id} lessonId={lessonId} />
}

