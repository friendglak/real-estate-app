import { render, screen } from '@testing-library/react'
import HomePage from '../page'

// Mock the components
jest.mock('../../components/header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}))

jest.mock('../../components/filter-sidebar', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FilterSidebar: ({ filters, onFiltersChange }: any) => (
    <div data-testid="filter-sidebar">
      Filter Sidebar
      <div data-testid="filters">{JSON.stringify(filters)}</div>
      <button onClick={() => onFiltersChange({ test: 'value' })}>
        Update Filters
      </button>
    </div>
  ),
}))

jest.mock('../../components/properties-container-with-suspense', () => ({
  PropertiesContainerWithSuspense: () => (
    <div data-testid="properties-container">Properties Container</div>
  ),
}))

// Mock the hook
jest.mock('../../hooks/use-sidebar-filters', () => ({
  useSidebarFilters: () => ({
    filters: { priceRange: [0, 1000000], propertyType: 'all' },
    setFilters: jest.fn(),
  }),
}))

describe('HomePage', () => {
  it('renders the main layout structure', () => {
    render(<HomePage />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('properties-container')).toBeInTheDocument()
  })

  it('renders the hero section', () => {
    render(<HomePage />)

    expect(screen.getByText('Our Apartment')).toBeInTheDocument()
    expect(screen.getByText(/Experience The Epitome Of Modern Living/)).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<HomePage />)

    // Check main container
    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-background')

    // Check main content
    const main = screen.getByRole('main')
    expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8')

    // Check grid layout
    const grid = main.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-4', 'gap-8')
  })

  it('renders sidebar with correct structure', () => {
    render(<HomePage />)

    // Find the parent div that contains the filter sidebar and has the lg:col-span-1 class
    const sidebar = screen.getByTestId('filter-sidebar').closest('.lg\\:col-span-1')
    expect(sidebar).toBeInTheDocument()
    expect(sidebar).toHaveClass('lg:col-span-1')
  })

  it('renders main content area with correct structure', () => {
    render(<HomePage />)

    // Find the parent div that contains the properties container and has the lg:col-span-3 class
    const mainContent = screen.getByTestId('properties-container').closest('.lg\\:col-span-3')
    expect(mainContent).toBeInTheDocument()
    expect(mainContent).toHaveClass('lg:col-span-3')
  })

  it('displays hero section content correctly', () => {
    render(<HomePage />)

    const heroTitle = screen.getByText('Our Apartment')
    expect(heroTitle).toHaveClass('text-gray-900', 'mb-2', 'text-xl', 'font-bold')

    const heroDescription = screen.getByText(/Experience The Epitome Of Modern Living/)
    expect(heroDescription).toHaveClass('text-muted-foreground', 'text-sm', 'leading-relaxed')
  })

  it('passes filters to FilterSidebar component', () => {
    render(<HomePage />)

    const filtersData = screen.getByTestId('filters')
    expect(filtersData).toHaveTextContent('{"priceRange":[0,1000000],"propertyType":"all"}')
  })

  it('handles responsive layout classes', () => {
    const { container } = render(<HomePage />)

    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-4')
  })

  it('renders all main sections', () => {
    render(<HomePage />)

    // Check that all main sections are present
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Our Apartment')).toBeInTheDocument()
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('properties-container')).toBeInTheDocument()
  })
})
