import { z } from 'zod'

export const PersonalizedContentRequestSchema = z.object({
  answred_questions: z.array(z.record(z.string(), z.string())),
})

export type PersonalizedContentRequest = z.infer<
  typeof PersonalizedContentRequestSchema
>
