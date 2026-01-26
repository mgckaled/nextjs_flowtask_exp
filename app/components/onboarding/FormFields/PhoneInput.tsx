'use client'

import { useCallback } from 'react'

interface PhoneInputProps {
  label: string
  placeholder?: string
  error?: string
  value: string
  onChange: (value: string) => void
}

export default function PhoneInput({
  label,
  placeholder,
  error,
  value,
  onChange,
}: PhoneInputProps) {
  const formatPhone = useCallback((input: string) => {
    // Remove tudo que não é dígito
    const digits = input.replace(/\D/g, '')

    // Aplica máscara
    if (digits.length <= 2) {
      return digits.length > 0 ? `(${digits}` : ''
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }

    // Limita a 11 dígitos
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    onChange(formatted)
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          w-full rounded-lg border bg-background px-4 py-2.5 text-foreground
          placeholder:text-muted-foreground focus:outline-none focus:ring-2
          ${error
            ? 'border-red-500 focus:ring-red-500/20'
            : 'border-border focus:ring-purple-500/20 focus:border-purple-500'
          }
        `}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
