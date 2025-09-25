import { render, screen } from '@testing-library/react'
import { PageHeader } from '../page-header'

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon">Home Icon</div>,
}))

describe('PageHeader', () => {
  it('renders the header with correct structure', () => {
    render(<PageHeader />)

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b', 'border-slate-200')
  })

  it('renders the logo and title', () => {
    render(<PageHeader />)

    expect(screen.getByText('Real Estate Properties')).toBeInTheDocument()
    expect(screen.getByText('Find your perfect home')).toBeInTheDocument()
  })

  it('renders the home icon', () => {
    render(<PageHeader />)

    const icon = screen.getByTestId('home-icon')
    expect(icon).toBeInTheDocument()
  })

  it('applies correct CSS classes to elements', () => {
    const { container } = render(<PageHeader />)

    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b', 'border-slate-200')

    const title = screen.getByText('Real Estate Properties')
    expect(title).toHaveClass('text-xl', 'font-bold', 'text-slate-900')

    const subtitle = screen.getByText('Find your perfect home')
    expect(subtitle).toHaveClass('text-sm', 'text-slate-600', 'hidden', 'sm:block')
  })

  it('renders the container with responsive classes', () => {
    const { container } = render(<PageHeader />)

    const containerDiv = container.querySelector('.container-responsive')
    expect(containerDiv).toBeInTheDocument()

    const flexContainer = container.querySelector('.flex.items-center.justify-between.h-16')
    expect(flexContainer).toBeInTheDocument()
  })
})
