import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyDetailModal } from '../property-detail-modal'
import type { PropertyDto } from '@/types/property'
import type { MockImageProps, MockErrorDisplayProps, MockButtonProps } from './test-types'

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} data-testid="property-image" />
  ),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon">X</div>,
  MapPin: () => <div data-testid="map-pin-icon">MapPin</div>,
  User: () => <div data-testid="user-icon">User</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Share2: () => <div data-testid="share-icon">Share2</div>,
}))

// Mock the hooks
jest.mock('../../hooks/queries/property-queries', () => ({
  usePropertyQuery: jest.fn(),
}))

jest.mock('../../hooks/use-favorites', () => ({
  useFavorites: () => ({
    isFavorited: jest.fn(() => false),
    toggleFavorite: jest.fn(),
  }),
}))

jest.mock('../../hooks/use-scroll-lock', () => ({
  useScrollLock: jest.fn(),
}))

jest.mock('../../hooks/use-contact', () => ({
  useContact: () => ({
    openContactForm: jest.fn(),
  }),
}))

// Mock the child components
jest.mock('../loading-spinner', () => ({
  LoadingSpinner: ({ size, text }: { size: number; text: string }) => (
    <div data-testid="loading-spinner" data-size={size}>
      {text}
    </div>
  ),
}))

jest.mock('../ui/error-display', () => ({
  ErrorDisplay: ({ title, message, onDismiss }: MockErrorDisplayProps) => (
    <div data-testid="error-display">
      <div data-testid="error-title">{title}</div>
      <div data-testid="error-message">{message}</div>
      <button data-testid="error-dismiss" onClick={onDismiss}>Dismiss</button>
    </div>
  ),
}))

jest.mock('../ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, ...props }: MockButtonProps) => (
    <button
      {...props}
      onClick={onClick}
      className={`${variant} ${size} ${className}`}
      data-testid="button"
    >
      {children}
    </button>
  ),
}))

// Mock the formatters
jest.mock('../../utils/formatters', () => ({
  formatCurrency: (value: number) => `$${value.toLocaleString()}`,
}))

import { usePropertyQuery } from '../../hooks/queries/property-queries'

const mockUsePropertyQuery = usePropertyQuery as jest.MockedFunction<typeof usePropertyQuery>

const mockProperty: PropertyDto = {
  id: '1',
  name: 'Test Property',
  addressProperty: '123 Test Street',
  priceProperty: 500000,
  bedrooms: 3,
  bathrooms: 2,
  squareMeters: 150,
  propertyType: 0,
  description: 'A beautiful test property',
  imageUrl: 'test-image.jpg',
  idOwner: 'owner-123',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  isAvailable: true,
}

describe('PropertyDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    mockUsePropertyQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(
      <PropertyDetailModal isOpen={true} onClose={jest.fn()} propertyId="1" />
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText('Loading property details...')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUsePropertyQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Failed to load property' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(
      <PropertyDetailModal isOpen={true} onClose={jest.fn()} propertyId="1" />
    )

    expect(screen.getByTestId('error-display')).toBeInTheDocument()
    expect(screen.getByTestId('error-title')).toHaveTextContent('Error Loading Property')
    expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to load property')
  })

  it('renders property image when available', () => {
    render(
      <PropertyDetailModal isOpen={true} onClose={jest.fn()} property={mockProperty} />
    )

    const image = screen.getByTestId('property-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test Property')
  })

  it('renders close button', () => {
    render(
      <PropertyDetailModal isOpen={true} onClose={jest.fn()} property={mockProperty} />
    )

    const closeButton = screen.getByLabelText('Close modal')
    expect(closeButton).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn()
    render(
      <PropertyDetailModal isOpen={true} onClose={mockOnClose} property={mockProperty} />
    )

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const mockOnClose = jest.fn()
    render(
      <PropertyDetailModal isOpen={true} onClose={mockOnClose} property={mockProperty} />
    )

    const backdrop = screen.getByRole('dialog')
    fireEvent.click(backdrop)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('handles missing property data', () => {
    mockUsePropertyQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    render(
      <PropertyDetailModal isOpen={true} onClose={jest.fn()} propertyId="1" />
    )

    expect(screen.getByText('No property data available')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(
      <PropertyDetailModal isOpen={true} onClose={jest.fn()} property={mockProperty} />
    )

    const modal = container.querySelector('.fixed.inset-0.z-50')
    expect(modal).toBeInTheDocument()

    const content = container.querySelector('.relative.w-full.max-w-2xl')
    expect(content).toBeInTheDocument()
  })

  it('handles keyboard events', () => {
    const mockOnClose = jest.fn()
    render(
      <PropertyDetailModal isOpen={true} onClose={mockOnClose} property={mockProperty} />
    )

    // Simulate escape key press
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
