'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { ErrorFallback } from './ui/error-fallback'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showErrorDetails?: boolean
  service?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with context
    const errorContext = {
      componentStack: errorInfo.componentStack,
      service: this.props.service,
      timestamp: new Date().toISOString()
    }

    // Check if this is a hydration error
    const isHydrationError = error.message.includes('hydrat') || 
                            error.message.includes('server rendered HTML') ||
                            error.message.includes('client properties')

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      if (isHydrationError) {
        console.warn('Hydration error detected (likely caused by browser extensions):', error.message)
      } else {
        console.error('ErrorBoundary caught an error:', error, errorContext)
      }
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorContext })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Use default error fallback component
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.handleReset}
          showDetails={this.props.showErrorDetails}
        />
      )
    }

    return this.props.children
  }
}