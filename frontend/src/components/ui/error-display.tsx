import { AlertCircle, X } from 'lucide-react'
import { Button } from './button'

interface ErrorDisplayProps {
  title?: string
  message?: string
  onDismiss?: () => void
  variant?: 'error' | 'warning' | 'info'
  className?: string
}

const variantStyles = {
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

const iconColors = {
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500'
}

export function ErrorDisplay({
  title = 'Error',
  message,
  onDismiss,
  variant = 'error',
  className = ''
}: ErrorDisplayProps) {
  if (!message) return null

  return (
    <div
      className={`
        border rounded-lg p-4 flex items-start gap-3
        ${variantStyles[variant]}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle 
        size={20} 
        className={`flex-shrink-0 mt-0.5 ${iconColors[variant]}`}
        aria-hidden="true"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium">{title}</h3>
        {message && (
          <p className="text-sm mt-1 opacity-90">{message}</p>
        )}
      </div>

      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="flex-shrink-0 p-1 h-auto"
          aria-label="Dismiss error"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  )
}
