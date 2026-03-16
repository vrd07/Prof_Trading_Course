export function QuizPlaceholder({ lessonId }: { lessonId: string }) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-background-subtle p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold">🧠 Quiz</div>
        <div className="text-xs text-foreground/70">Lesson {lessonId}</div>
      </div>
      <div className="mt-4 rounded-xl border border-border bg-background-muted p-4 text-sm text-foreground/70">
        Demo placeholder. In Phase 1/2 this will load questions, score 4/5 gating, and persist
        progress.
      </div>
    </div>
  )
}

