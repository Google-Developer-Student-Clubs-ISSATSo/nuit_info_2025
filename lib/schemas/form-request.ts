import { z } from 'zod'

export const FormRequestSchema = z.object({
  user_input: z.string().min(1, 'User input is required'),
})

export type FormRequest = z.infer<typeof FormRequestSchema>
