'use client'

import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, ...props },
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      className={[
        'h-11 w-full rounded-xl border border-border bg-background-muted px-3 text-sm text-foreground',
        'placeholder:text-foreground/40',
        'focus:outline-none focus:ring-2 focus:ring-primary/30',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
})

