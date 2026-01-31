'use client'

import { useEffect, useState } from 'react'

type KeyboardShortcutProps = {
  shortcut: string
  className?: string
}

export default function KeyboardShortcut({ shortcut, className = '' }: KeyboardShortcutProps) {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'))
  }, [])

  // Substitui "mod" pelo modificador correto da plataforma
  const displayShortcut = shortcut.replace('mod', isMac ? '⌘' : 'Ctrl')

  return (
    <kbd className={`inline-flex items-center gap-0.5 rounded bg-white/20 px-1.5 py-0.5 text-xs font-medium ${className}`}>
      {displayShortcut}
    </kbd>
  )
}
