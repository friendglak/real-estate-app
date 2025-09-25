import { render, screen } from '@testing-library/react'
import { PropertyGrid } from '../property-grid'
import type { PropertyDto } from '@/types/property'
import type { MockPropertyDetailModalProps, MockPaginationProps } from './test-types'

// Mock the child components
jest.mock('../property-card', () => ({
  PropertyCard: ({ property, onClick }: { property: PropertyDto; onClick: (property: PropertyDto) => void }) => (
    <div data-testid={`property-card-${property.id}`} onClick={() => onClick(property)}>
      {property.name}
    </div>
  ),
}))

jest.mock('../property-detail-modal', () => ({
  PropertyDetailModal: ({ isOpen, onClose, propertyId }: MockPropertyDetailModalProps) => (
    <div data-testid="property-detail-modal" data-is-open={isOpen} data-property-id={propertyId}>
      <button data-testid="close-modal" onClick={onClose}>Close</button>
    </div>
  ),
}))

jest.mock('../pagination', () => ({
  Pagination: ({ currentPage, totalPages, totalItems }: MockPaginationProps) => (
    <div data-testid="pagination" data-current-page={currentPage} data-total-pages={totalPages} data-total-items={totalItems}>
      Pagination
    </div>
  ),
}))

// Mock the hook
jest.mock('../../hooks/use-property-modal', () => ({
  usePropertyModal: () => ({
    selectedPropertyId: 'test-property-id',
    isModalOpen: false,
    openModalWithProperty: jest.fn(),
    closeModal: jest.fn(),
  }),
}))

const mockProperties: PropertyDto[] = [
  {
    id: '1',
    name: 'Test Property 1',
    addressProperty: '123 Test St',
    priceProperty: 500000,
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 1500,
    propertyType: 1,
    isAvailable: true,
    description: 'Test description',
    imageUrl: 'image1.jpg',
    idOwner: 'owner-1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Test Property 2',
    addressProperty: '456 Test Ave',
    priceProperty: 750000,
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 2000,
    propertyType: 2,
    isAvailable: true,
    description: 'Test description 2',
    imageUrl: 'image2.jpg',
    idOwner: 'owner-2',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
]

describe('PropertyGrid', () => {
  const defaultProps = {
    properties: mockProperties,
    totalPages: 5,
    currentPage: 1,
    totalCount: 50,
  }

  it('renders the grid with correct structure', () => {
    render(<PropertyGrid {...defaultProps} />)

    expect(screen.getByText('Showing 1 to 12 of 50 properties')).toBeInTheDocument()
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(screen.getByTestId('property-detail-modal')).toBeInTheDocument()
  })

  it('renders all properties in the grid', () => {
    render(<PropertyGrid {...defaultProps} />)

    expect(screen.getByTestId('property-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('property-card-2')).toBeInTheDocument()
  })

  it('displays correct results summary', () => {
    render(<PropertyGrid {...defaultProps} />)

    expect(screen.getByText('Showing 1 to 12 of 50 properties')).toBeInTheDocument()
  })

  it('displays correct results summary for different page', () => {
    render(<PropertyGrid {...defaultProps} currentPage={3} />)

    expect(screen.getByText('Showing 25 to 36 of 50 properties')).toBeInTheDocument()
  })

  it('displays correct results summary for last page', () => {
    render(<PropertyGrid {...defaultProps} currentPage={5} totalCount={50} />)

    expect(screen.getByText('Showing 49 to 50 of 50 properties')).toBeInTheDocument()
  })

  it('renders pagination with correct props', () => {
    render(<PropertyGrid {...defaultProps} />)

    const pagination = screen.getByTestId('pagination')
    expect(pagination).toHaveAttribute('data-current-page', '1')
    expect(pagination).toHaveAttribute('data-total-pages', '5')
    expect(pagination).toHaveAttribute('data-total-items', '50')
  })

  it('renders property detail modal', () => {
    render(<PropertyGrid {...defaultProps} />)

    const modal = screen.getByTestId('property-detail-modal')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveAttribute('data-is-open', 'false')
  })

  it('applies correct CSS classes to grid', () => {
    const { container } = render(<PropertyGrid {...defaultProps} />)

    const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3.gap-6')
    expect(grid).toBeInTheDocument()
  })

  it('applies correct CSS classes to results summary', () => {
    const { container } = render(<PropertyGrid {...defaultProps} />)

    const summary = container.querySelector('.flex.flex-col.sm\\:flex-row.sm\\:items-center.sm\\:justify-between.gap-4')
    expect(summary).toBeInTheDocument()
  })

  it('renders with different total count', () => {
    render(<PropertyGrid {...defaultProps} totalCount={100} />)

    expect(screen.getByText('Showing 1 to 12 of 100 properties')).toBeInTheDocument()
  })
})