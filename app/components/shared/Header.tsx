'use client'

import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { motion } from 'motion/react'
import { BoltIcon } from '@heroicons/react/24/solid'
import UserButton from './UserButton'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { data: session, status } = useSession()

  const isLoggedIn = !!session?.user
  const hasCompletedProfile = session?.user?.hasCompletedProfile
  const userPlan = session?.user?.plan || 'free'
  const showUpgrade = isLoggedIn && hasCompletedProfile && userPlan === 'free'

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8 border-b border-border relative">
        {/* Linha animada vibrante */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FlowTask
              </span>
            </motion.div>
          </Link>

          {/* Navegação Central */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden md:flex items-center gap-1"
          >
            {isLoggedIn && hasCompletedProfile && (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-purple-600 transition-colors rounded-lg hover:bg-muted"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-purple-600 transition-colors rounded-lg hover:bg-muted"
            >
              Preços
            </Link>
            {!isLoggedIn && (
              <Link
                href="/demo"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-purple-600 transition-colors rounded-lg hover:bg-muted"
              >
                Demo
              </Link>
            )}
          </motion.nav>

          {/* Ações (direita) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <ThemeToggle />

            {status === 'loading' ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              </div>
            ) : isLoggedIn ? (
              <>
                {/* Botão Upgrade Pro - apenas para plano Free */}
                {showUpgrade && (
                  <Link href="/checkout?plan=pro">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
                    >
                      <BoltIcon className="w-4 h-4" />
                      Upgrade Pro
                    </motion.button>
                  </Link>
                )}
                <UserButton user={session.user} />
              </>
            ) : (
              <>
                <button
                  onClick={() => signIn(undefined, { callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-purple-600 transition-colors"
                >
                  Entrar
                </button>
                <button
                  onClick={() => signIn(undefined, { callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
                >
                  Criar Conta Grátis
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  )
}
