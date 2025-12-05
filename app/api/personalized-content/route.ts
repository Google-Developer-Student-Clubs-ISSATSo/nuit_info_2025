import { NextRequest, NextResponse } from 'next/server'
import { PersonalizedContentService } from '@/lib/services/personalized-content'
import { PersonalizedContentRequestSchema } from '@/lib/schemas/personalized-content-request'

const personalizedContentService = new PersonalizedContentService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Received request:', body)

    const validatedData = PersonalizedContentRequestSchema.parse(body)

    const content = await personalizedContentService.generateContent(
      validatedData.answred_questions,
    )

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error generating personalized content:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    )
  }
}
