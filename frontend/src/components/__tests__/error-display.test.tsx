import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorDisplay } from '../error-display'
import type { MockButtonProps } from './test-types'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircle</div>,
  RefreshCw: () => <div data-testid="refresh-cw-icon">RefreshCw</div>,
}))

// Mock Button component
jest.mock('../ui/button', () => ({
  Button: ({ children, onClick, ...props }: MockButtonProps) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

describe('ErrorDisplay', () => {
  it('renders with default props', () => {
    render(<ErrorDisplay title="Error" message="Test error message" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('renders with custom title and message', () => {
    render(
      <ErrorDisplay
        title="Custom Error"
        message="Custom error message"
      />
    )

    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('renders with correct styling', () => {
    const { container } = render(
      <ErrorDisplay title="Error" message="Test message" />
    )

    const alert = container.querySelector('[role="alert"]')
    expect(alert).toHaveClass('bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'p-6')
  })

  it('renders retry button when onRetry is provided', () => {
    const onRetry = jest.fn()
    render(
      <ErrorDisplay
        title="Error"
        message="Test message"
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByLabelText('Retry loading')
    expect(retryButton).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn()
    render(
      <ErrorDisplay
        title="Error"
        message="Test message"
        onRetry={onRetry}
      />
    )

    const retryButton = screen.getByLabelText('Retry loading')
    fireEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorDisplay title="Error" message="Test message" />)

    expect(screen.queryByLabelText('Retry loading')).not.toBeInTheDocument()
  })

  it('renders message in correct structure', () => {
    render(<ErrorDisplay title="Error" message="Test message" />)

    const messageElement = screen.getByText('Test message')
    expect(messageElement).toHaveClass('text-red-700', 'text-sm', 'mb-3')
  })

  it('renders title in correct structure', () => {
    render(<ErrorDisplay title="Custom Title" message="Test message" />)

    const titleElement = screen.getByText('Custom Title')
    expect(titleElement).toHaveClass('text-red-800', 'font-semibold', 'mb-1')
  })

  it('renders with correct accessibility attributes', () => {
    const { container } = render(<ErrorDisplay title="Error" message="Test message" />)

    const alert = container.querySelector('[role="alert"]')
    expect(alert).toHaveAttribute('aria-live', 'polite')
  })

  it('renders icon with correct attributes', () => {
    render(<ErrorDisplay title="Error" message="Test message" />)

    const icon = screen.getByTestId('alert-circle-icon')
    expect(icon).toBeInTheDocument()
  })
})

