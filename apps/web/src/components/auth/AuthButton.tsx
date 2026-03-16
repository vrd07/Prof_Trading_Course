'use client'

import type { ButtonHTMLAttributes } from 'react'

export interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export function AuthButton({ isLoading, children, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      className={[
        'h-11 w-full rounded-full bg-primary px-4 text-sm font-semibold text-white hover:opacity-95',
        'disabled:cursor-not-allowed disabled:opacity-60',
        props.className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? 'Loading…' : children}
    </button>
  )
}

