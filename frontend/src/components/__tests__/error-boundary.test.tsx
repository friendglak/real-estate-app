import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../error-boundary'

// Mock the ErrorFallback component
jest.mock('../ui/error-fallback', () => ({
  ErrorFallback: ({ error, resetError, showDetails }: {
    error?: Error;
    resetError: () => void;
    showDetails?: boolean
  }) => (
    <div data-testid="error-fallback">
      <p>Something went wrong</p>
      {showDetails && error && <p>Error: {error.message}</p>}
      <button onClick={resetError}>Try again</button>
    </div>
  ),
}))

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => { })
    jest.spyOn(console, 'warn').mockImplementation(() => { })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child component</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Child component')).toBeInTheDocument()
  })

  it('renders error fallback when child throws error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div data-testid="custom-fallback">Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByTestId('error-fallback')).not.toBeInTheDocument()
  })

  it('shows error details when showErrorDetails is true', () => {
    render(
      <ErrorBoundary showErrorDetails={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error: Test error')).toBeInTheDocument()
  })

  it('hides error details when showErrorDetails is false', () => {
    render(
      <ErrorBoundary showErrorDetails={false}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Error: Test error')).not.toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    )
  })

  it('handles multiple errors correctly', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument()

    // Reset and throw another error
    const resetButton = screen.getByText('Try again')
    fireEvent.click(resetButton)

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument()
  })
})
