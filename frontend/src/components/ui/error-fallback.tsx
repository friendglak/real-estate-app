import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from './button'

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
  showDetails?: boolean
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function ErrorFallback({
  error,
  resetError,
  showDetails = false,
  title = 'Something went wrong',
  description = 'We apologize for the inconvenience. Please try refreshing the page.',
  actions
}: ErrorFallbackProps) {
  const defaultActions = (
    <div className="flex flex-col sm:flex-row gap-3">
      {resetError && (
        <Button onClick={resetError} variant="default">
          <RefreshCw size={16} />
          Try Again
        </Button>
      )}
      <Button
        onClick={() => window.location.href = '/'}
        variant="secondary"
      >
        <Home size={16} />
        Go Home
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <AlertCircle
          className="mx-auto text-red-500 mb-4"
          size={48}
          aria-hidden="true"
        />

        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          {title}
        </h1>

        <p className="text-slate-600 mb-6">
          {description}
        </p>

        {showDetails && error && (
          <details className="text-left bg-slate-50 rounded p-3 mb-6">
            <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
              Error Details
            </summary>
            <pre className="text-xs mt-2 whitespace-pre-wrap text-red-600 font-mono">
              {error.message}
            </pre>
          </details>
        )}

        {actions || defaultActions}
      </div>
    </div>
  )
}
