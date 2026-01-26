'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import {
  onboardingSchema,
  type OnboardingFormData,
  companySizeOptions,
  howDidYouHearOptions,
  industryOptions,
} from '@/lib/validations/onboarding'
import { saveOnboardingProfile } from '@/app/actions/onboarding'
import PhoneInput from './FormFields/PhoneInput'
import TextField from './FormFields/TextField'
import SelectField from './FormFields/SelectField'
import OnboardingProgress from './OnboardingProgress'

interface OnboardingFormProps {
  userName: string
  callbackUrl?: string
}

const STEPS = [
  { id: 1, title: 'Informações Pessoais', fields: ['phone', 'jobTitle'] },
  { id: 2, title: 'Sobre a Empresa', fields: ['company', 'companySize', 'industry'] },
  { id: 3, title: 'Como nos Encontrou', fields: ['howDidYouHear'] },
]

export default function OnboardingForm({ userName, callbackUrl }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onBlur',
  })

  const handleNext = async () => {
    const fieldsToValidate = STEPS[currentStep].fields as (keyof OnboardingFormData)[]
    const isValid = await trigger(fieldsToValidate)

    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await saveOnboardingProfile(data)

      if (result.success) {
        router.push(callbackUrl || '/dashboard')
      } else {
        setError(result.message)
      }
    } catch {
      setError('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1
            className="text-3xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Bem-vindo, {userName}!
          </motion.h1>
          <p className="mt-2 text-muted-foreground">
            Complete seu perfil para começar a usar o FlowTask
          </p>
        </div>

        {/* Progress */}
        <OnboardingProgress
          steps={STEPS}
          currentStep={currentStep}
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
            <AnimatePresence mode="wait">
              {/* Step 1: Informações Pessoais */}
              {currentStep === 0 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-foreground">
                    {STEPS[0].title}
                  </h2>

                  <PhoneInput
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    error={errors.phone?.message}
                    value={watch('phone') || ''}
                    onChange={(value) => setValue('phone', value, { shouldValidate: true })}
                  />

                  <TextField
                    label="Cargo"
                    placeholder="Ex: Product Manager"
                    error={errors.jobTitle?.message}
                    {...register('jobTitle')}
                  />
                </motion.div>
              )}

              {/* Step 2: Sobre a Empresa */}
              {currentStep === 1 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-foreground">
                    {STEPS[1].title}
                  </h2>

                  <TextField
                    label="Nome da Empresa"
                    placeholder="Ex: Acme Inc."
                    error={errors.company?.message}
                    {...register('company')}
                  />

                  <SelectField
                    label="Tamanho da Empresa"
                    options={companySizeOptions}
                    error={errors.companySize?.message}
                    {...register('companySize')}
                  />

                  <SelectField
                    label="Setor de Atuação"
                    options={industryOptions}
                    error={errors.industry?.message}
                    {...register('industry')}
                  />
                </motion.div>
              )}

              {/* Step 3: Como nos Encontrou */}
              {currentStep === 2 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-foreground">
                    {STEPS[2].title}
                  </h2>

                  <SelectField
                    label="Como conheceu o FlowTask?"
                    options={howDidYouHearOptions}
                    error={errors.howDidYouHear?.message}
                    {...register('howDidYouHear')}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <motion.button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-border px-6 py-2 text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voltar
              </motion.button>

              {currentStep < STEPS.length - 1 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-white transition-opacity hover:opacity-90"
                >
                  Próximo
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Concluir'}
                </motion.button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
