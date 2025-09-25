import { render, screen } from '@testing-library/react'
import { PropertyGridWrapper } from '../property-grid-wrapper'
import type { MockPropertyGridProps, MockEmptyStateProps, MockErrorDisplayProps } from './test-types'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('name=test&minPrice=100000'),
}))

// Mock the child components
jest.mock('../property-grid', () => ({
  PropertyGrid: ({ properties, totalPages, currentPage, totalCount }: MockPropertyGridProps) => (
    <div data-testid="property-grid">
      <div data-testid="properties-count">{properties.length}</div>
      <div data-testid="total-pages">{totalPages}</div>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="total-count">{totalCount}</div>
    </div>
  ),
}))

jest.mock('../loading-spinner', () => ({
  LoadingSpinner: ({ size, text }: { size: number; text: string }) => (
    <div data-testid="loading-spinner" data-size={size}>
      {text}
    </div>
  ),
}))

jest.mock('../empty-state', () => ({
  EmptyState: ({ title, description, icon, children }: MockEmptyStateProps) => (
    <div data-testid="empty-state">
      <div data-testid="empty-title">{title}</div>
      <div data-testid="empty-description">{description}</div>
      <div data-testid="empty-icon">{icon}</div>
      {children}
    </div>
  ),
}))

jest.mock('../error-display', () => ({
  ErrorDisplay: ({ title, message, onRetry }: MockErrorDisplayProps) => (
    <div data-testid="error-display">
      <div data-testid="error-title">{title}</div>
      <div data-testid="error-message">{message}</div>
      <button data-testid="retry-button" onClick={onRetry}>Retry</button>
    </div>
  ),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon">Home</div>,
  Search: () => <div data-testid="search-icon">Search</div>,
}))

// Mock the hook
jest.mock('../../hooks/use-properties', () => ({
  useProperties: jest.fn(),
}))

import { useProperties } from '../../hooks/use-properties'

const mockUseProperties = useProperties as jest.MockedFunction<typeof useProperties>

describe('PropertyGridWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    mockUseProperties.mockReturnValue({
      properties: [],
      loading: true,
      error: null,
      totalPages: 0,
      currentPage: 1,
      totalCount: 0,
      refetch: jest.fn(),
    })

    render(<PropertyGridWrapper />)

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toHaveAttribute('data-size', '32')
    expect(screen.getByText('Loading properties...')).toBeInTheDocument()
  })

  it('renders error state', () => {
    const mockRefetch = jest.fn()
    mockUseProperties.mockReturnValue({
      properties: [],
      loading: false,
      error: 'Failed to load properties',
      totalPages: 0,
      currentPage: 1,
      totalCount: 0,
      refetch: mockRefetch,
    })

    render(<PropertyGridWrapper />)

    expect(screen.getByTestId('error-display')).toBeInTheDocument()
    expect(screen.getByTestId('error-title')).toHaveTextContent('Error Loading Properties')
    expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to load properties')
  })

  it('calls refetch when retry button is clicked', () => {
    const mockRefetch = jest.fn()
    mockUseProperties.mockReturnValue({
      properties: [],
      loading: false,
      error: 'Failed to load properties',
      totalPages: 0,
      currentPage: 1,
      totalCount: 0,
      refetch: mockRefetch,
    })

    render(<PropertyGridWrapper />)

    const retryButton = screen.getByTestId('retry-button')
    retryButton.click()

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('renders empty state with clear filters button when filters are applied', () => {
    mockUseProperties.mockReturnValue({
      properties: [],
      loading: false,
      error: null,
      totalPages: 0,
      currentPage: 1,
      totalCount: 0,
      refetch: jest.fn(),
    })

    render(<PropertyGridWrapper />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByTestId('empty-title')).toHaveTextContent('No Properties Found')
    expect(screen.getByTestId('empty-description')).toHaveTextContent('Try adjusting your search filters to find more properties.')
    expect(screen.getByText('Clear All Filters')).toBeInTheDocument()
  })

  it('renders property grid when properties are available', () => {
    const mockProperties = [
      { id: '1', name: 'Property 1' },
      { id: '2', name: 'Property 2' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any

    mockUseProperties.mockReturnValue({
      properties: mockProperties,
      loading: false,
      error: null,
      totalPages: 2,
      currentPage: 1,
      totalCount: 24,
      refetch: jest.fn(),
    })

    render(<PropertyGridWrapper />)

    expect(screen.getByTestId('property-grid')).toBeInTheDocument()
    expect(screen.getByTestId('properties-count')).toHaveTextContent('2')
    expect(screen.getByTestId('total-pages')).toHaveTextContent('2')
    expect(screen.getByTestId('current-page')).toHaveTextContent('1')
    expect(screen.getByTestId('total-count')).toHaveTextContent('24')
  })

  it('passes correct search options to useProperties hook', () => {
    mockUseProperties.mockReturnValue({
      properties: [],
      loading: false,
      error: null,
      totalPages: 0,
      currentPage: 1,
      totalCount: 0,
      refetch: jest.fn(),
    })

    render(<PropertyGridWrapper />)

    expect(mockUseProperties).toHaveBeenCalledWith({
      name: 'test',
      address: undefined,
      minPrice: 100000,
      maxPrice: undefined,
      pageNumber: 1,
      pageSize: 12,
    })
  })


})
