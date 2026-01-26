'use client'

import { motion } from 'motion/react'
import { CheckIcon } from '@heroicons/react/24/solid'

interface Step {
  id: number
  title: string
  fields: string[]
}

interface OnboardingProgressProps {
  steps: Step[]
  currentStep: number
}

export default function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{
              scale: index === currentStep ? 1.1 : 1,
              backgroundColor: index < currentStep
                ? '#9333ea'
                : index === currentStep
                  ? '#ec4899'
                  : 'transparent'
            }}
            className={`
              flex h-10 w-10 items-center justify-center rounded-full border-2
              ${index <= currentStep
                ? 'border-purple-600'
                : 'border-muted-foreground/30'
              }
            `}
          >
            {index < currentStep ? (
              <CheckIcon className="h-5 w-5 text-white" />
            ) : (
              <span className={`text-sm font-medium ${index === currentStep ? 'text-white' : 'text-muted-foreground'
                }`}>
                {step.id}
              </span>
            )}
          </motion.div>

          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: index < currentStep ? 1 : 0.3 }}
              className={`h-0.5 w-12 sm:w-16 origin-left ${index < currentStep
                ? 'bg-purple-600'
                : 'bg-muted-foreground/30'
                }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
