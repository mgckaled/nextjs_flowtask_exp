'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'motion/react'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const plan = searchParams.get('plan')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(`/api/auth/signin?callbackUrl=/checkout?plan=${plan}`)
      return
    }

    if (!session.user.hasCompletedProfile) {
      router.push(`/onboarding?callbackUrl=/checkout?plan=${plan}`)
      return
    }

    if (!plan || !['pro', 'max'].includes(plan)) {
      router.push('/pricing')
      return
    }

    // Criar checkout session
    const createCheckout = async () => {
      try {
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        })

        const data = await response.json()

        if (data.url) {
          window.location.href = data.url
        } else {
          setError(data.error || 'Erro ao criar sessão de checkout')
          setIsLoading(false)
        }
      } catch {
        setError('Erro ao processar pagamento')
        setIsLoading(false)
      }
    }

    createCheckout()
  }, [session, status, plan, router])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Erro no Checkout</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.push('/pricing')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Voltar para Planos
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-foreground">Preparando checkout...</h1>
        <p className="text-muted-foreground mt-2">Você será redirecionado para o pagamento</p>
      </motion.div>
    </div>
  )
}
