'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { createBrowserClient } from '@/lib/supabase/client'

import { AuthButton } from './AuthButton'
import { FormField } from './FormField'
import { loginSchema, type LoginFormData } from './schemas'
import { TextInput } from './TextInput'

export function LoginForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError('root', { message: error.message })
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email" error={errors.email?.message}>
        <TextInput type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <TextInput
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
        />
      </FormField>

      {errors.root?.message ? <div className="text-sm text-destructive">{errors.root.message}</div> : null}

      <AuthButton type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
        Log in
      </AuthButton>

      <div className="text-sm text-foreground/70">
        New here?{' '}
        <Link href="/signup" className="font-semibold text-primary">
          Create an account
        </Link>
      </div>
    </form>
  )
}

