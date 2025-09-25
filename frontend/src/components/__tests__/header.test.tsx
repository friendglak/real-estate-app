import { render, screen } from '@testing-library/react'
import { Header } from '../header'

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Home: ({ className }: { className: string }) => (
    <div data-testid="home-icon" className={className}>
      Home Icon
    </div>
  ),
}))

describe('Header', () => {
  it('renders the header with correct structure', () => {
    render(<Header />)

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('bg-white', 'border-b', 'border-border')
  })

  it('renders the logo and brand name', () => {
    render(<Header />)

    expect(screen.getByText('HOMECO')).toBeInTheDocument()
    expect(screen.getByText('Find your perfect home')).toBeInTheDocument()
  })

  it('renders the home icon', () => {
    render(<Header />)

    const homeIcon = screen.getByTestId('home-icon')
    expect(homeIcon).toBeInTheDocument()
    expect(homeIcon).toHaveClass('w-6', 'h-6', 'text-white')
  })

  it('applies correct CSS classes to container', () => {
    render(<Header />)

    const container = screen.getByRole('banner').firstChild as HTMLElement
    expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
  })

  it('applies correct CSS classes to flex container', () => {
    render(<Header />)

    const flexContainer = screen.getByText('HOMECO').closest('.flex')
    expect(flexContainer).toHaveClass('flex', 'items-center', 'gap-3')
  })

  it('applies correct CSS classes to logo container', () => {
    render(<Header />)

    const logoContainer = screen.getByTestId('home-icon').closest('.flex')
    expect(logoContainer).toHaveClass('flex', 'items-center', 'gap-3')
  })

  it('applies correct CSS classes to icon container', () => {
    render(<Header />)

    const iconContainer = screen.getByTestId('home-icon').parentElement
    expect(iconContainer).toHaveClass('p-2', 'bg-primary', 'rounded-lg')
  })

  it('applies correct CSS classes to brand name', () => {
    render(<Header />)

    const brandName = screen.getByText('HOMECO')
    expect(brandName).toHaveClass('text-primary', 'font-bold', 'text-xl')
  })

  it('applies correct CSS classes to tagline', () => {
    render(<Header />)

    const tagline = screen.getByText('Find your perfect home')
    expect(tagline).toHaveClass('text-sm', 'text-gray-600')
  })

  it('has proper semantic structure', () => {
    render(<Header />)

    const header = screen.getByRole('banner')
    const heading = screen.getByRole('heading', { level: 1 })

    expect(header).toContainElement(heading)
    expect(heading).toHaveTextContent('HOMECO')
  })

  it('renders all elements in correct order', () => {
    const { container } = render(<Header />)

    const elements = container.querySelectorAll('*')
    const homeIcon = screen.getByTestId('home-icon')
    const brandName = screen.getByText('HOMECO')
    const tagline = screen.getByText('Find your perfect home')

    expect(container).toContainElement(homeIcon)
    expect(container).toContainElement(brandName)
    expect(container).toContainElement(tagline)
  })
})
