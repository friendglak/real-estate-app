import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard } from '../property-card'
import type { PropertyDto } from '@/types/property'

// Mock the ImageWithFallback component
jest.mock('../ui/image-with-fallback', () => ({
  ImageWithFallback: ({ src, alt, className }: { src: string; alt: string; className: string }) => (
    <img src={src} alt={alt} className={className} data-testid="property-image" />
  ),
}))

const mockProperty: PropertyDto = {
  id: '1',
  idOwner: 'owner-1',
  name: 'Beautiful House',
  addressProperty: '123 Main Street, City, State 12345',
  priceProperty: 500000,
  imageUrl: 'https://example.com/image.jpg',
  description: 'A beautiful house with great views',
  bedrooms: 3,
  bathrooms: 2,
  squareMeters: 150.5,
  propertyType: 0,
  isAvailable: true,
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
}

const mockOnClick = jest.fn()
const mockOnFavorite = jest.fn()

describe('PropertyCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders property information correctly', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    expect(screen.getByText('Beautiful House')).toBeInTheDocument()
    expect(screen.getByText('123 Main Street, City, State 12345')).toBeInTheDocument()
    expect(screen.getByText('$500,000')).toBeInTheDocument()
    expect(screen.getByText('Available For Sale')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // bedrooms
    expect(screen.getByText('2')).toBeInTheDocument() // bathrooms
    expect(screen.getByText('150.5')).toBeInTheDocument() // square meters
  })

  it('renders property image with correct attributes', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    const image = screen.getByTestId('property-image')
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(image).toHaveAttribute('alt', 'Beautiful House')
    expect(image).toHaveClass('w-full h-48 object-cover')
  })

  it('calls onClick when property card is clicked', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    const card = screen.getByRole('img').closest('div')
    fireEvent.click(card!)

    expect(mockOnClick).toHaveBeenCalledWith(mockProperty)
  })

  it('calls onFavorite when favorite button is clicked', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    const favoriteButton = screen.getByRole('button')
    fireEvent.click(favoriteButton)

    expect(mockOnFavorite).toHaveBeenCalledWith('1')
  })

  it('prevents onClick when favorite button is clicked', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    const favoriteButton = screen.getByRole('button')
    fireEvent.click(favoriteButton)

    // onClick should not be called when favorite button is clicked
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('shows correct status for available property', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    expect(screen.getByText('Available For Sale')).toBeInTheDocument()
  })

  it('shows correct status for unavailable property', () => {
    const unavailableProperty = { ...mockProperty, isAvailable: false }

    render(
      <PropertyCard
        property={unavailableProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    expect(screen.getByText('Not Available')).toBeInTheDocument()
  })

  it('shows favorited state correctly', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
        isFavorited={true}
      />
    )

    const favoriteButton = screen.getByRole('button')
    expect(favoriteButton).toHaveClass('bg-red-500 text-white')
  })

  it('shows unfavorited state correctly', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
        isFavorited={false}
      />
    )

    const favoriteButton = screen.getByRole('button')
    expect(favoriteButton).toHaveClass('bg-white/90 text-gray-600 hover:bg-white')
  })

  it('handles missing optional properties gracefully', () => {
    const propertyWithoutOptional = {
      ...mockProperty,
      bedrooms: undefined,
      bathrooms: undefined,
      squareMeters: undefined,
    }

    render(
      <PropertyCard
        property={propertyWithoutOptional}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    expect(screen.getByText('Beautiful House')).toBeInTheDocument()
    expect(screen.getByText('$500,000')).toBeInTheDocument()
    // Should not render bedroom/bathroom/square meter info
    expect(screen.queryByText('3')).not.toBeInTheDocument()
    expect(screen.queryByText('2')).not.toBeInTheDocument()
    expect(screen.queryByText('150.5')).not.toBeInTheDocument()
  })

  it('formats price correctly', () => {
    const expensiveProperty = { ...mockProperty, priceProperty: 1500000 }

    render(
      <PropertyCard
        property={expensiveProperty}
        onClick={mockOnClick}
        onFavorite={mockOnFavorite}
      />
    )

    expect(screen.getByText('$1,500,000')).toBeInTheDocument()
  })

  it('works without onFavorite callback', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText('Beautiful House')).toBeInTheDocument()
    // Should not crash when onFavorite is not provided
  })
})
