'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorDisplayProps {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorDisplay({ title, message, onRetry }: ErrorDisplayProps) {
  return (
    <div 
      className="bg-red-50 border border-red-200 rounded-lg p-6"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <AlertCircle 
          className="text-red-600 flex-shrink-0 mt-0.5" 
          size={20} 
          aria-hidden="true"
        />
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">
            {title}
          </h3>
          <p className="text-red-700 text-sm mb-3">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors focus-ring"
              aria-label="Retry loading"
            >
              <RefreshCw size={16} aria-hidden="true" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}