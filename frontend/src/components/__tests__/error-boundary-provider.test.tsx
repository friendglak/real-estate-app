import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundaryProvider, useErrorContext } from '../error-boundary-provider'
import type { MockErrorFallbackProps } from './test-types'

// Mock the ErrorFallback component
jest.mock('../ui/error-fallback', () => ({
  ErrorFallback: ({ error, resetError, showDetails }: MockErrorFallbackProps) => (
    <div data-testid="error-fallback">
      <div data-testid="error-message">{error?.message}</div>
      <div data-testid="show-details">{showDetails ? 'true' : 'false'}</div>
      <button data-testid="reset-error" onClick={resetError}>
        Reset Error
      </button>
    </div>
  ),
}))

// Test component that uses the context
function TestComponent() {
  const { error, setError, clearError } = useErrorContext()

  return (
    <div>
      <div data-testid="error-state">{error ? error.message : 'no-error'}</div>
      <button data-testid="trigger-error" onClick={() => setError(new Error('Test error'))}>
        Trigger Error
      </button>
      <button data-testid="clear-error" onClick={clearError}>
        Clear Error
      </button>
    </div>
  )
}

describe('ErrorBoundaryProvider', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundaryProvider>
        <div data-testid="children">Test children</div>
      </ErrorBoundaryProvider>
    )

    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  it('provides error context to children', () => {
    render(
      <ErrorBoundaryProvider>
        <TestComponent />
      </ErrorBoundaryProvider>
    )

    expect(screen.getByTestId('error-state')).toHaveTextContent('no-error')
  })



  it('shows ErrorFallback when error occurs', () => {
    render(
      <ErrorBoundaryProvider>
        <TestComponent />
      </ErrorBoundaryProvider>
    )

    // Trigger an error
    fireEvent.click(screen.getByTestId('trigger-error'))

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument()
    expect(screen.getByTestId('error-message')).toHaveTextContent('Test error')
  })

  it('passes showErrorDetails prop to ErrorFallback', () => {
    render(
      <ErrorBoundaryProvider showErrorDetails={true}>
        <TestComponent />
      </ErrorBoundaryProvider>
    )

    // Trigger an error
    fireEvent.click(screen.getByTestId('trigger-error'))

    expect(screen.getByTestId('show-details')).toHaveTextContent('true')
  })

  it('uses custom fallback when provided', () => {
    const customFallback = <div data-testid="custom-fallback">Custom Error</div>

    render(
      <ErrorBoundaryProvider fallback={customFallback}>
        <TestComponent />
      </ErrorBoundaryProvider>
    )

    // Trigger an error
    fireEvent.click(screen.getByTestId('trigger-error'))

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('error-fallback')).not.toBeInTheDocument()
  })

  it('resets error when resetError is called from ErrorFallback', () => {
    render(
      <ErrorBoundaryProvider>
        <TestComponent />
      </ErrorBoundaryProvider>
    )

    // Trigger an error
    fireEvent.click(screen.getByTestId('trigger-error'))
    expect(screen.getByTestId('error-fallback')).toBeInTheDocument()

    // Reset error from ErrorFallback
    fireEvent.click(screen.getByTestId('reset-error'))

    // Should go back to children
    expect(screen.queryByTestId('error-fallback')).not.toBeInTheDocument()
    expect(screen.getByTestId('error-state')).toHaveTextContent('no-error')
  })

  it('throws error when useErrorContext is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useErrorContext must be used within an ErrorBoundaryProvider')

    consoleSpy.mockRestore()
  })
})
