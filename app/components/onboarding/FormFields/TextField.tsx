import { forwardRef } from 'react'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <input
          ref={ref}
          type="text"
          className={`
            w-full rounded-lg border bg-background px-4 py-2.5 text-foreground
            placeholder:text-muted-foreground focus:outline-none focus:ring-2
            ${error
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-border focus:ring-purple-500/20 focus:border-purple-500'
            }
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'

export default TextField
