import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50),
})

export type SignupFormData = z.infer<typeof signupSchema>

