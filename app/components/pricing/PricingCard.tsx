'use client'

import { motion } from 'motion/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const planHierarchy = { free: 0, pro: 1, max: 2 }

export default function PricingCard({
  name,
  price,
  period = '/mês',
  description,
  features,
  buttonText,
  variant = 'default',
  isPopular = false,
  planId,
}: {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  variant?: 'default' | 'popular' | 'premium'
  isPopular?: boolean
  planId?: 'free' | 'pro' | 'max'
}) {
  const { data: session } = useSession()
  const router = useRouter()

  const userPlan = (session?.user?.plan || 'free') as 'free' | 'pro' | 'max'
  const isCurrentPlan = planId === userPlan
  const isLowerPlan = planId ? planHierarchy[planId] < planHierarchy[userPlan] : false
  const isDisabled = isCurrentPlan || isLowerPlan

  const getButtonText = () => {
    if (isCurrentPlan) return 'Plano Atual'
    if (isLowerPlan) return 'Plano Inferior'
    return buttonText
  }

  const handleSubscribe = () => {
    if (isDisabled) return

    // Plano Free - vai direto para dashboard/onboarding
    if (planId === 'free') {
      if (!session) {
        signIn(undefined, { callbackUrl: '/dashboard' })
      } else {
        router.push('/dashboard')
      }
      return
    }

    // Planos pagos
    if (!session) {
      // Se não autenticado, login com retorno para pricing
      signIn(undefined, { callbackUrl: `/pricing?plan=${planId}` })
      return
    }

    if (!session.user.hasCompletedProfile) {
      // Se não completou onboarding
      router.push(`/onboarding?callbackUrl=/checkout?plan=${planId}`)
      return
    }

    // Se autenticado e com perfil completo, vai para checkout
    router.push(`/checkout?plan=${planId}`)
  }

  // Estilos baseados na variante
  const borderStyle = {
    default: 'border-border',
    popular: 'border-blue-500 dark:border-blue-600 ring-2 ring-blue-500/50',
    premium: 'border-border',
  }

  const buttonStyle = {
    default:
      'border border-border text-foreground hover:bg-muted',
    popular:
      'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
    premium:
      'bg-foreground text-background hover:opacity-90',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative flex flex-col rounded-lg border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg ${borderStyle[variant]}`}
    >
      {/* Badge Plano Atual */}
      {isCurrentPlan && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span className="inline-block rounded-full bg-green-600 px-4 py-1 text-sm font-semibold text-white">
            Seu Plano
          </span>
        </motion.div>
      )}

      {/* Badge Popular (apenas se não for plano atual) */}
      {isPopular && !isCurrentPlan && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.span
            className="inline-block rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Mais Popular
          </motion.span>
        </motion.div>
      )}

      {/* Cabeçalho do Card */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-card-foreground">
          {name}
        </h3>
        <p className="mt-2 text-base text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-card-foreground">
            {price}
          </span>
          <span className="ml-2 text-lg text-muted-foreground">
            {period}
          </span>
        </div>
      </div>

      {/* Botão CTA */}
      <motion.button
        onClick={handleSubscribe}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
        className={`w-full rounded-lg px-6 py-3 font-semibold transition-colors ${
          isDisabled
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : buttonStyle[variant]
        }`}
      >
        {getButtonText()}
      </motion.button>

      {/* Features */}
      <motion.ul
        className="mt-8 space-y-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.li
            key={index}
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 },
            }}
            className="flex items-start gap-3"
          >
            <CheckIcon className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-500" />
            <span className="text-base text-card-foreground">
              {feature}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}
