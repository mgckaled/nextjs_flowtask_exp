'use client'

import { signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'

interface UserButtonProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    plan?: string
  }
}

const planLabels: Record<string, { label: string; color: string }> = {
  free: { label: 'Free', color: 'bg-zinc-500' },
  pro: { label: 'Pro', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  max: { label: 'Max', color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
}

export default function UserButton({ user }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-muted/50 p-1 pr-3 hover:bg-muted/80 transition-colors"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-purple-500 to-pink-500">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border">
              <p className="font-semibold text-sm">{user.name || 'Usuário'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Plano:</span>
                <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${planLabels[user.plan || 'free']?.color || planLabels.free.color}`}>
                  {planLabels[user.plan || 'free']?.label || 'Free'}
                </span>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted/80 transition-colors text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
