'use client'

import { Avatar, DialogueBox } from '@/components/avatar/Avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface FormQuestion {
  id: string
  label: string
  type: 'text' | 'number' | 'email' | 'choice' | 'yes-no' | 'textarea'
  required: boolean
  placeholder?: string
  options?: string[]
  logic?: string
  default?: string | number | boolean
}

export interface DynamicFormData {
  title: string
  description: string
  estimated_questions: number
  questions: FormQuestion[]
}

interface DynamicFormWithAvatarProps {
  formData: DynamicFormData
  onSubmit: (answers: Record<string, any>) => void
  onCancel?: () => void
  avatarIntroduction?: string
}

export function DynamicFormWithAvatar({
  formData,
  onSubmit,
  onCancel,
  avatarIntroduction,
}: DynamicFormWithAvatarProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentAnswer, setCurrentAnswer] = useState<any>('')
  const [showError, setShowError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personalizedMessage, setPersonalizedMessage] = useState<string | null>(
    null,
  )
  const [isLoadingPersonalized, setIsLoadingPersonalized] = useState(false)

  const isIntro = currentQuestionIndex === -1
  const isComplete = currentQuestionIndex >= formData.questions.length
  const currentQuestion =
    !isIntro && !isComplete ? formData.questions[currentQuestionIndex] : null

  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = answers[currentQuestion.id]
      if (existingAnswer !== undefined) {
        setCurrentAnswer(existingAnswer)
      } else if (currentQuestion.default !== undefined) {
        setCurrentAnswer(currentQuestion.default)
      } else {
        // Reset to appropriate empty value based on question type
        if (currentQuestion.type === 'yes-no') {
          setCurrentAnswer(null) // Explicitly null for yes-no to distinguish from false
        } else if (currentQuestion.type === 'number') {
          setCurrentAnswer('')
        } else {
          setCurrentAnswer('')
        }
      }
      setShowError(false)
    }
  }, [currentQuestionIndex, currentQuestion, answers])

  const getAvatarDialogue = () => {
    if (isIntro) {
      return (
        avatarIntroduction ||
        `Bonjour ! Je vais vous guider pour remplir le formulaire : "${formData.title}". ${formData.description}. Cela prendra environ ${formData.estimated_questions} questions. Prêt à commencer ?`
      )
    }

    if (isComplete) {
      if (personalizedMessage) {
        return personalizedMessage
      }
      return 'Parfait ! Toutes les questions sont complétées. Vous pouvez maintenant soumettre votre formulaire.'
    }

    if (currentQuestion) {
      return (
        currentQuestion.label +
        (currentQuestion.required ? ' (obligatoire)' : ' (optionnel)')
      )
    }

    return ''
  }

  const validateAnswer = () => {
    if (!currentQuestion) return true
    if (currentQuestion.required) {
      if (currentQuestion.type === 'yes-no') {
        if (currentAnswer !== true && currentAnswer !== false) {
          return false
        }
      } else {
        if (
          currentAnswer === '' ||
          currentAnswer === null ||
          currentAnswer === undefined
        ) {
          return false
        }
      }
    }

    if (
      currentQuestion.type === 'number' &&
      currentAnswer !== '' &&
      currentAnswer !== null &&
      currentAnswer !== undefined
    ) {
      const num = Number(currentAnswer)
      if (isNaN(num)) return false
      if (currentQuestion.logic) {
        if (currentQuestion.logic.includes('> 0') && num <= 0) return false
      }
    }

    if (currentQuestion.type === 'email' && currentAnswer) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(currentAnswer)) return false
    }

    return true
  }

  const handleNext = () => {
    console.log('🔵 handleNext called', {
      isIntro,
      isComplete,
      currentQuestionIndex,
      isSubmitting,
    })

    setShowError(false)

    if (isIntro) {
      console.log('✅ Moving from intro to first question')
      setCurrentQuestionIndex(0)
      return
    }

    if (isComplete) {
      console.log('✅ Submitting form')
      handleSubmit()
      return
    }

    if (!validateAnswer()) {
      console.log('❌ Validation failed')
      setShowError(true)
      return
    }

    // Save answer
    if (currentQuestion) {
      console.log('✅ Saving answer and moving to next question', {
        questionId: currentQuestion.id,
        questionType: currentQuestion.type,
        currentAnswer,
      })
      const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer }
      setAnswers(newAnswers)

      // Check if this is the last question
      if (currentQuestionIndex === formData.questions.length - 1) {
        // Fetch personalized content
        fetchPersonalizedContent(newAnswers)
      }
    }

    setCurrentQuestionIndex((prev) => prev + 1)
  }

  const fetchPersonalizedContent = async (
    finalAnswers: Record<string, any>,
  ) => {
    setIsLoadingPersonalized(true)

    try {
      const answersDict: Record<string, string> = {}

      formData.questions.forEach((question) => {
        const answer = finalAnswers[question.id]
        // Use question label as key, convert answer to string as API expects Dict[str, str]
        answersDict[question.label] =
          answer !== undefined && answer !== null ? String(answer) : ''
      })

      const response = await fetch('/api/personalized-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answred_questions: [answersDict],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch personalized content')
      }

      const data = await response.json()
      if (data.status === 'success' && data.personalized_message) {
        setPersonalizedMessage(data.personalized_message)
      }
    } catch (err) {
      console.error('Error fetching personalized content:', err)
      // Fallback message if API fails
      setPersonalizedMessage(
        "Merci d'avoir complété le formulaire ! Vos réponses ont été enregistrées.",
      )
    } finally {
      setIsLoadingPersonalized(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > -1) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setShowError(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(answers)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestionInput = () => {
    if (!currentQuestion) return null

    const commonClasses =
      'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'

    switch (currentQuestion.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={currentQuestion.type}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className={commonClasses}
            autoFocus
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className={commonClasses}
            autoFocus
          />
        )

      case 'textarea':
        return (
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className={`${commonClasses} min-h-[120px] resize-y`}
            autoFocus
          />
        )

      case 'choice':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => setCurrentAnswer(option)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 ${
                  currentAnswer === option
                    ? 'border-emerald-500 bg-emerald-50 font-semibold dark:bg-emerald-950/50'
                    : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )

      case 'yes-no':
        return (
          <div className="space-y-2">
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentAnswer(true)}
                className={`flex-1 rounded-lg border px-6 py-4 text-base font-semibold transition-all hover:border-emerald-500 ${
                  currentAnswer === true
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                }`}
              >
                Oui
              </button>
              <button
                onClick={() => setCurrentAnswer(false)}
                className={`flex-1 rounded-lg border px-6 py-4 text-base font-semibold transition-all hover:border-red-500 ${
                  currentAnswer === false
                    ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                    : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                }`}
              >
                Non
              </button>
            </div>
            {currentAnswer === null && currentQuestion.required && (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Veuillez sélectionner une réponse
              </p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4 md:p-8 dark:from-slate-900 dark:to-emerald-950">
      <div className="mx-auto max-w-4xl">
        {/* Progress Bar */}
        {!isIntro && (
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Progression</span>
              <span>
                {Math.min(currentQuestionIndex + 1, formData.questions.length)}{' '}
                / {formData.questions.length}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(Math.min(currentQuestionIndex + 1, formData.questions.length) / formData.questions.length) * 100}%`,
                }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <Avatar
              type="human"
              position="center"
              name="Sophie"
              isSpeaking={false}
              isLarge
            />
          </motion.div>

          {/* Loading Overlay for Personalized Content */}
          {isLoadingPersonalized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-emerald-600" />
              <p className="text-slate-600 dark:text-slate-400">
                Génération de votre message personnalisé...
              </p>
            </motion.div>
          )}

          {/* Dialogue Box */}
          {!isLoadingPersonalized && (
            <DialogueBox
              key={currentQuestionIndex}
              text={getAvatarDialogue()}
              position="center"
              speakerType="human"
              isLarge
            />
          )}

          {/* Question Input Area */}
          {!isIntro && !isComplete && (
            <motion.div
              key={`input-${currentQuestionIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 md:p-8">
                {renderQuestionInput()}

                {showError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-red-600 dark:text-red-400"
                  >
                    {currentQuestion?.type === 'email'
                      ? 'Veuillez entrer une adresse email valide'
                      : currentQuestion?.type === 'number'
                        ? 'Veuillez entrer un nombre valide'
                        : currentQuestion?.type === 'yes-no'
                          ? 'Veuillez sélectionner Oui ou Non'
                          : 'Ce champ est obligatoire'}
                  </motion.p>
                )}
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              onClick={onCancel || handlePrevious}
              variant="outline"
              disabled={isIntro && !onCancel}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {isIntro ? 'Annuler' : 'Précédent'}
            </Button>

            <Button
              onClick={() => {
                console.log('🔘 Button clicked!', {
                  isIntro,
                  isSubmitting,
                  disabled: isSubmitting || isLoadingPersonalized,
                })
                handleNext()
              }}
              disabled={isSubmitting || isLoadingPersonalized}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : isLoadingPersonalized ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : isComplete ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Soumettre
                </>
              ) : isIntro ? (
                <>
                  Commencer
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
