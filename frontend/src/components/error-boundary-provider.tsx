'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { ErrorFallback } from './ui/error-fallback'

interface ErrorContextType {
  error: Error | null
  setError: (error: Error | null) => void
  clearError: () => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function useErrorContext() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorBoundaryProvider')
  }
  return context
}

interface ErrorBoundaryProviderProps {
  children: ReactNode
  fallback?: ReactNode
  showErrorDetails?: boolean
}

export function ErrorBoundaryProvider({
  children,
  fallback,
  showErrorDetails = false
}: ErrorBoundaryProviderProps) {
  const [error, setError] = useState<Error | null>(null)

  const clearError = () => setError(null)

  if (error) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <ErrorFallback
        error={error}
        resetError={clearError}
        showDetails={showErrorDetails}
      />
    )
  }

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  )
}
