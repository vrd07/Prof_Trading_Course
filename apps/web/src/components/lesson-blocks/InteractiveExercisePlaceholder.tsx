export function InteractiveExercisePlaceholder({ id, lessonId }: { id: string; lessonId: string }) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-background-subtle p-6">
      <div className="text-sm font-semibold">🧩 Interactive Exercise</div>
      <div className="mt-2 text-sm text-foreground/70">
        Demo placeholder for <span className="font-mono">{id}</span> (lesson{' '}
        <span className="font-mono">{lessonId}</span>)
      </div>
      <div className="mt-4 rounded-xl border border-border bg-background-muted p-4 text-sm text-foreground/70">
        The full interactive implementation (drag/drop, validation, feedback) will come in Phase 2.
      </div>
    </div>
  )
}

