import { NextRequest, NextResponse } from 'next/server'
import { FormGeneratorService } from '@/lib/services/form-generator'
import { FormRequestSchema } from '@/lib/schemas/form-request'

const formGeneratorService = new FormGeneratorService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = FormRequestSchema.parse(body)

    const content = await formGeneratorService.generateForm(
      validatedData.user_input,
    )

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error generating form:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    )
  }
}
