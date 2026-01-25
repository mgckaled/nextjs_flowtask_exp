'use client'

import { motion } from 'motion/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { useSession, signIn } from 'next-auth/react'

export default function PricingCard({
  name,
  price,
  period = '/mês',
  description,
  features,
  buttonText,
  variant = 'default',
  isPopular = false,
}: {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  variant?: 'default' | 'popular' | 'premium'
  isPopular?: boolean
}) {
  const { data: session } = useSession()

  const handleSubscribe = () => {
    if (!session) {
      // Se não estiver autenticado, solicita login
      signIn('google', { callbackUrl: '/pricing' })
    } else {
      // Se autenticado, processa a assinatura
      alert(`Você selecionou o plano ${name}!`)
    }
  }

  // Estilos baseados na variante
  const borderStyle = {
    default: 'border-zinc-200 dark:border-zinc-800',
    popular: 'border-blue-500 dark:border-blue-600 ring-2 ring-blue-500/50',
    premium: 'border-zinc-300 dark:border-zinc-700',
  }

  const buttonStyle = {
    default:
      'border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800',
    popular:
      'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
    premium:
      'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`relative flex flex-col rounded-lg border bg-white dark:bg-zinc-950 p-8 shadow-sm transition-shadow hover:shadow-lg ${borderStyle[variant]}`}
    >
      {/* Badge Popular */}
      {isPopular && (
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
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {name}
        </h3>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">
            {price}
          </span>
          <span className="ml-2 text-lg text-zinc-600 dark:text-zinc-400">
            {period}
          </span>
        </div>
      </div>

      {/* Botão CTA */}
      <motion.button
        onClick={handleSubscribe}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`w-full rounded-lg px-6 py-3 font-semibold transition-colors ${buttonStyle[variant]}`}
      >
        {buttonText}
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
            <span className="text-base text-zinc-700 dark:text-zinc-300">
              {feature}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}
