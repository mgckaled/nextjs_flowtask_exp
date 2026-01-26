import { forwardRef } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: readonly Option[]
  error?: string
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <select
          ref={ref}
          className={`
            w-full rounded-lg border bg-background px-4 py-2.5 text-foreground
            focus:outline-none focus:ring-2
            ${error
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-border focus:ring-purple-500/20 focus:border-purple-500'
            }
          `}
          {...props}
        >
          <option value="">Selecione...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'

export default SelectField
