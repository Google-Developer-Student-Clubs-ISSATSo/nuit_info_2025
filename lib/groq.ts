import Groq from 'groq-sdk'

interface GroqLLMOptions {
  modelName: string
  temperature?: number
  maxTokens?: number
  systemPrompt: string
}

export class GroqLLM {
  private client: Groq
  private modelName: string
  private temperature: number
  private maxTokens: number
  private systemPrompt: string

  constructor(options: GroqLLMOptions) {
    const {
      modelName,
      temperature = 0.7,
      maxTokens = 1024,
      systemPrompt,
    } = options

    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    this.modelName = modelName
    this.temperature = temperature
    this.maxTokens = maxTokens
    this.systemPrompt = systemPrompt
  }

  async generate(prompt: string | Record<string, any>[]): Promise<string> {
    const userContent =
      typeof prompt === 'string' ? prompt : JSON.stringify(prompt)

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        {
          role: 'system',
          content:
            this.systemPrompt + '\n\nYou must respond with valid JSON only.',
        },
        { role: 'user', content: userContent },
      ],
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      response_format: { type: 'json_object' },
    })

    console.log(response)

    return response.choices[0]?.message?.content || '{}'
  }
}
