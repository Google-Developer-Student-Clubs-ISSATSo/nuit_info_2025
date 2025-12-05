'use client'

import { DynamicFormWithAvatar, DynamicFormData } from '@/components/form/DynamicFormWithAvatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Loader2, FileText, Heart, Users, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormMode = 'Établir le Contact' | 'Offrir un Don' | 'Rejoindre la Guilde des Bénévoles' | 'Demander des Informations'

const modeIcons = {
  'Établir le Contact': FileText,
  'Offrir un Don': Heart,
  'Rejoindre la Guilde des Bénévoles': Users,
  'Demander des Informations': HelpCircle,
}

const modeDescriptions = {
  'Établir le Contact': 'Envoyez-nous un message pour toute question ou suggestion',
  'Offrir un Don': 'Contribuez à notre mission avec un don financier ou matériel',
  'Rejoindre la Guilde des Bénévoles': 'Devenez bénévole et rejoignez notre équipe',
  'Demander des Informations': 'Obtenez plus d\'informations sur nos actions',
}

export default function DynamicFormPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<FormMode | null>(null)
  const [isLoadingForm, setIsLoadingForm] = useState(false)
  const [formData, setFormData] = useState<DynamicFormData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const modes: FormMode[] = [
    'Établir le Contact',
    'Offrir un Don',
    'Rejoindre la Guilde des Bénévoles',
    'Demander des Informations',
  ]

  const handleModeSelection = async (mode: FormMode) => {
    setSelectedMode(mode)
    setIsLoadingForm(true)
    setError(null)

    try {
      // Call your external API endpoint to generate the form
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: mode }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate form')
      }

      const data = await response.json()
      setFormData(data)
    } catch (err) {
      console.error('Error loading form:', err)
      setError('Impossible de charger le formulaire. Veuillez réessayer.')
      setSelectedMode(null)
    } finally {
      setIsLoadingForm(false)
    }
  }

  const handleFormSubmit = async (answers: Record<string, any>) => {
    console.log('Form submitted with answers:', answers)
    
    try {
      // Submit the form data to your backend
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: selectedMode,
          answers,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // Show success message or redirect
      alert('Formulaire soumis avec succès !')
      router.push('/') // or wherever you want to redirect
    } catch (err) {
      console.error('Error submitting form:', err)
      alert('Erreur lors de la soumission du formulaire')
    }
  }

  const handleCancel = () => {
    setSelectedMode(null)
    setFormData(null)
    setError(null)
  }

  // Show form with avatar if form data is loaded
  if (formData && selectedMode) {
    return (
      <DynamicFormWithAvatar
        formData={formData}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        avatarIntroduction={`Bonjour ! Vous avez choisi de "${selectedMode}". Je vais vous guider à travers ce formulaire. ${formData.description}`}
      />
    )
  }

  // Show loading state
  if (isLoadingForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950">
        <Card className="p-8 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-emerald-600" />
          <p className="mt-4 text-lg font-semibold">Génération du formulaire...</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Veuillez patienter un instant
          </p>
        </Card>
      </div>
    )
  }

  // Show mode selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Choisissez une option ci-dessous pour commencer
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950/30">
              <p className="text-center text-red-700 dark:text-red-300">{error}</p>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {modes.map((mode, index) => {
            const Icon = modeIcons[mode]
            return (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="group cursor-pointer transition-all hover:shadow-xl hover:scale-105"
                  onClick={() => handleModeSelection(mode)}
                >
                  <div className="p-6 md:p-8">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="rounded-full bg-emerald-100 p-4 transition-colors group-hover:bg-emerald-200 dark:bg-emerald-900/30 dark:group-hover:bg-emerald-800/50">
                        <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <h2 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">
                      {mode}
                    </h2>
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                      {modeDescriptions[mode]}
                    </p>
                    <Button
                      className="mt-6 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleModeSelection(mode)
                      }}
                    >
                      Continuer
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
