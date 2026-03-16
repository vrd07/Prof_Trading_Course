'use client'

import type { InputHTMLAttributes } from 'react'

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function TextInput(props: TextInputProps) {
  return (
    <input
      {...props}
      className={[
        'h-11 w-full rounded-xl border border-border bg-background-muted px-3 text-sm text-foreground',
        'placeholder:text-foreground/40',
        'focus:outline-none focus:ring-2 focus:ring-primary/30',
        props.className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

