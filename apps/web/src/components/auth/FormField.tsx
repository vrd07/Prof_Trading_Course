'use client'

import type { ReactNode } from 'react'

export function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{label}</div>
      {children}
      {error ? <div className="text-xs text-destructive">{error}</div> : null}
    </div>
  )
}

