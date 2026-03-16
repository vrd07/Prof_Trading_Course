import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-foreground/70">Start learning with the free module.</p>
      <div className="mt-6">
        <SignupForm />
      </div>
    </div>
  )
}

