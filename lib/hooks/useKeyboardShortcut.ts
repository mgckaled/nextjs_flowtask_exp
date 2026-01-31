'use client'

import { useEffect, useCallback } from 'react'

type Options = {
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  preventDefault?: boolean
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: Options = {}
) {
  const { ctrl, meta, shift, alt, preventDefault = true } = options

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check modifiers
    const ctrlMatch = ctrl === undefined || e.ctrlKey === ctrl
    const metaMatch = meta === undefined || e.metaKey === meta
    const shiftMatch = shift === undefined || e.shiftKey === shift
    const altMatch = alt === undefined || e.altKey === alt

    // For shortcuts like Cmd/Ctrl+K, we want either ctrl OR meta
    const modifierMatch = (ctrl || meta)
      ? (e.ctrlKey || e.metaKey) && shiftMatch && altMatch
      : ctrlMatch && metaMatch && shiftMatch && altMatch

    if (e.key.toLowerCase() === key.toLowerCase() && modifierMatch) {
      if (preventDefault) {
        e.preventDefault()
      }
      callback()
    }
  }, [key, callback, ctrl, meta, shift, alt, preventDefault])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
