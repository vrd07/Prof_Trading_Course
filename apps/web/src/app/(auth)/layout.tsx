import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-14">
        <div className="w-full rounded-2xl border border-border bg-background-subtle p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

