import { render, screen } from '@testing-library/react'
import { EmptyState } from '../empty-state'

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Home: ({ size }: { size: number }) => (
    <div data-testid="home-icon" data-size={size}>
      Home Icon
    </div>
  ),
}))

describe('EmptyState', () => {
  it('renders with required props', () => {
    render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
      />
    )

    expect(screen.getByText('No properties found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument()
  })

  it('renders with default Home icon', () => {
    render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
      />
    )

    expect(screen.getByTestId('home-icon')).toBeInTheDocument()
    expect(screen.getByTestId('home-icon')).toHaveAttribute('data-size', '48')
  })

  it('renders with custom icon', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>

    render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
        icon={customIcon}
      />
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('home-icon')).not.toBeInTheDocument()
  })

  it('renders with children', () => {
    render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
      >
        <button>Refresh</button>
        <button>Clear filters</button>
      </EmptyState>
    )

    expect(screen.getByText('Refresh')).toBeInTheDocument()
    expect(screen.getByText('Clear filters')).toBeInTheDocument()
  })

  it('applies correct classes to container', () => {
    render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
      />
    )

    const container = screen.getByText('No properties found').closest('div')
    expect(container).toHaveClass(
      'flex', 'flex-col', 'items-center', 'justify-center',
      'py-12', 'text-center'
    )
  })

  it('applies correct classes to icon container', () => {
    render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
      />
    )

    const iconContainer = screen.getByTestId('home-icon').parentElement
    expect(iconContainer).toHaveClass('mb-4', 'text-slate-400')
  })

  it('applies correct classes to title', () => {
    render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
      />
    )

    const title = screen.getByText('No properties found')
    expect(title).toHaveClass(
      'text-xl', 'font-semibold', 'text-slate-900', 'mb-2'
    )
  })

  it('applies correct classes to description', () => {
    render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
      />
    )

    const description = screen.getByText('Try adjusting your search criteria')
    expect(description).toHaveClass(
      'text-slate-600', 'mb-6', 'max-w-md'
    )
  })

  it('renders with long title and description', () => {
    const longTitle = 'This is a very long title that should still be displayed correctly'
    const longDescription = 'This is a very long description that should be displayed correctly and should wrap to multiple lines if needed'

    render(
      <EmptyState
        title={longTitle}
        description={longDescription}
      />
    )

    expect(screen.getByText(longTitle)).toBeInTheDocument()
    expect(screen.getByText(longDescription)).toBeInTheDocument()
  })

  it('renders without children', () => {
    const { container } = render(
      <EmptyState
        title="No properties found"
        description="Try adjusting your search criteria"
      />
    )

    // Should not have any buttons or other children
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })
})
