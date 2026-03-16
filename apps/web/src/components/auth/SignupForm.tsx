'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { createBrowserClient } from '@/lib/supabase/client'

import { AuthButton } from './AuthButton'
import { FormField } from './FormField'
import { signupSchema, type SignupFormData } from './schemas'
import { TextInput } from './TextInput'

export function SignupForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', displayName: '' },
  })

  const onSubmit = async (data: SignupFormData) => {
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { display_name: data.displayName },
      },
    })

    if (error) {
      setError('root', { message: error.message })
      return
    }

    router.push('/learn')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Name" error={errors.displayName?.message}>
        <TextInput placeholder="Varad" {...register('displayName')} />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <TextInput type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <TextInput
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          {...register('password')}
        />
      </FormField>

      {errors.root?.message ? <div className="text-sm text-destructive">{errors.root.message}</div> : null}

      <AuthButton type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
        Create account
      </AuthButton>

      <div className="text-sm text-foreground/70">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </div>
    </form>
  )
}

