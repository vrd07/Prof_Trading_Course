interface AnimationPlaceholderProps {
  title: string
  takeaway: string
}

export function AnimationPlaceholder({ title, takeaway }: AnimationPlaceholderProps) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-background-muted p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold">🎬 Animation Checkpoint</div>
        <div className="text-xs text-foreground/70">Demo placeholder</div>
      </div>
      <div className="mt-3 text-base font-semibold">{title}</div>
      <p className="mt-2 text-sm text-foreground/70">{takeaway}</p>
    </div>
  )
}

