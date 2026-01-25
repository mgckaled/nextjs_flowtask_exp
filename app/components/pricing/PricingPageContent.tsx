'use client'

import { motion } from 'motion/react'
import PricingCard from './PricingCard'

export default function PricingPageContent() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho da Página */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Escolha seu plano
          </h1>
          <motion.p
            className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Encontre o plano perfeito para suas necessidades. Comece grátis e
            faça upgrade quando precisar.
          </motion.p>
        </motion.div>

        {/* Grid de Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {/* Plano Free */}
          <PricingCard
            name="Free"
            price="R$ 0"
            period="/mês"
            description="Perfeito para começar e explorar"
            features={[
              'Até 3 projetos',
              '100 MB de armazenamento',
              'Suporte por email',
              'Atualizações básicas',
            ]}
            buttonText="Começar Grátis"
            variant="default"
          />

          {/* Plano Pro (Popular) */}
          <PricingCard
            name="Pro"
            price="R$ 49"
            period="/mês"
            description="Ideal para profissionais e equipes"
            features={[
              'Projetos ilimitados',
              '10 GB de armazenamento',
              'Suporte prioritário',
              'Atualizações avançadas',
              'Integrações premium',
              'Análises detalhadas',
            ]}
            buttonText="Assinar Pro"
            variant="popular"
            isPopular={true}
          />

          {/* Plano Max */}
          <PricingCard
            name="Max"
            price="R$ 99"
            period="/mês"
            description="Recursos completos para empresas"
            features={[
              'Tudo do plano Pro',
              '100 GB de armazenamento',
              'Suporte 24/7 dedicado',
              'API personalizada',
              'Backups automáticos diários',
              'Gerenciamento de equipes',
              'SLA de 99.9% uptime',
              'Consultoria mensal inclusa',
            ]}
            buttonText="Assinar Max"
            variant="premium"
          />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Todos os planos incluem período de teste gratuito de 14 dias.
            Cancele a qualquer momento.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
