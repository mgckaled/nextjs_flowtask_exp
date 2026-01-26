'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import {
  ChartBarIcon,
  UsersIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import { useSession, signIn } from 'next-auth/react'
import AnimatedBackground from '../shared/AnimatedBackground'
import FeatureCard from './FeatureCard'

export default function HomePageContent() {
  const { data: session } = useSession()
  return (
    <div className="relative min-h-screen bg-background">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-5xl font-bold text-foreground md:text-6xl lg:text-7xl"
              >
                Gerencie Projetos com Inteligência e Simplicidade
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl"
              >
                FlowTask é a plataforma completa para gestão de projetos e tarefas.
                Organize seu time, acompanhe o progresso e alcance seus objetivos com eficiência.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <motion.button
                  onClick={() => session ? window.location.href = '/dashboard' : signIn(undefined, { callbackUrl: '/dashboard' })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {session ? 'Ir para Dashboard' : 'Começar Gratuitamente'}
                </motion.button>

                <Link href="/demo">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-8 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Ver Demonstração
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl"
            >
              Tudo que você precisa em um só lugar
            </motion.h2>

            <motion.div
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
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              <FeatureCard
                icon={<ChartBarIcon className="h-10 w-10 text-blue-600 dark:text-blue-500" />}
                title="Dashboards Intuitivos"
                description="Visualize o progresso de todos os projetos em tempo real com gráficos e métricas personalizadas"
              />

              <FeatureCard
                icon={<UsersIcon className="h-10 w-10 text-blue-600 dark:text-blue-500" />}
                title="Trabalho em Equipe"
                description="Colabore com seu time em tempo real, compartilhe arquivos e mantenha todos alinhados"
              />

              <FeatureCard
                icon={<BoltIcon className="h-10 w-10 text-blue-600 dark:text-blue-500" />}
                title="Automatize Tarefas"
                description="Crie fluxos de trabalho automatizados e economize horas de trabalho repetitivo"
              />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-3xl font-bold text-foreground md:text-4xl"
            >
              Pronto para aumentar sua produtividade?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
            >
              Junte-se a milhares de equipes que já transformaram sua forma de trabalhar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Ver Planos e Preços
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
