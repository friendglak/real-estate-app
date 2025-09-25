import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '../loading-spinner'

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Loader2: ({ size, className }: { size: number; className: string }) => (
    <div data-testid="loader-icon" data-size={size} className={className}>
      Loader Icon
    </div>
  ),
}))

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)

    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByTestId('loader-icon')).toHaveAttribute('data-size', '24')
  })

  it('renders with custom size', () => {
    render(<LoadingSpinner size={32} />)

    expect(screen.getByTestId('loader-icon')).toHaveAttribute('data-size', '32')
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait..." />)

    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<LoadingSpinner className="custom-class" />)

    const container = screen.getByTestId('loader-icon').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('renders without text when text is empty string', () => {
    render(<LoadingSpinner text="" />)

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('renders without text when text is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<LoadingSpinner text={null as any} />)

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('applies correct classes to container', () => {
    render(<LoadingSpinner />)

    const container = screen.getByTestId('loader-icon').parentElement
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2')
  })

  it('applies correct classes to loader icon', () => {
    render(<LoadingSpinner />)

    const icon = screen.getByTestId('loader-icon')
    expect(icon).toHaveClass('animate-spin', 'text-primary')
  })

  it('applies correct classes to text', () => {
    render(<LoadingSpinner text="Custom text" />)

    const text = screen.getByText('Custom text')
    expect(text).toHaveClass('text-slate-600')
  })

  it('handles all props together', () => {
    render(
      <LoadingSpinner
        size={40}
        className="my-custom-class"
        text="Processing data..."
      />
    )

    const container = screen.getByTestId('loader-icon').parentElement
    const icon = screen.getByTestId('loader-icon')
    const text = screen.getByText('Processing data...')

    expect(container).toHaveClass('my-custom-class')
    expect(icon).toHaveAttribute('data-size', '40')
    expect(text).toBeInTheDocument()
  })
})
