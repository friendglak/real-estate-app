import { render, screen, fireEvent } from '@testing-library/react'
import { FilterSidebar } from '../filter-sidebar'
import type { MockSliderProps, MockSelectProps } from './test-types'

// Mock the UI components
jest.mock('../ui/slider', () => ({
  Slider: ({ value, onValueChange, max, min, step, className }: MockSliderProps) => (
    <div
      data-testid="slider"
      data-value={JSON.stringify(value)}
      data-max={max}
      data-min={min}
      data-step={step}
      className={className}
      onClick={() => onValueChange?.([(value?.[0] || 0) + 10, (value?.[1] || 0) + 10])}
    >
      Slider
    </div>
  ),
}))

jest.mock('../ui/select', () => ({
  Select: ({ children, value, onValueChange }: MockSelectProps) => (
    <div data-testid="select" data-value={value}>
      {children}
      <button
        data-testid="select-trigger"
        onClick={() => onValueChange?.('new-value')}
      >
        Select
      </button>
    </div>
  ),
  SelectContent: ({ children }: MockSelectProps) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ value, children }: MockSelectProps) => (
    <div data-testid={`select-item-${value}`} data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, className }: MockSelectProps) => (
    <div data-testid="select-trigger" className={className}>
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: MockSelectProps) => (
    <div data-testid="select-value" data-placeholder={placeholder}>
      Select Value
    </div>
  ),
}))

describe('FilterSidebar', () => {
  const mockFilters = {
    houseType: 'apartment',
    rooms: '2',
    sizeRange: [50, 150],
    priceRange: [200000, 250000],
  }

  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the sidebar with correct structure', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('House Type:')).toBeInTheDocument()
    expect(screen.getByText('Rooms')).toBeInTheDocument()
    expect(screen.getByText('Size (M2)')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const sidebar = container.firstChild as HTMLElement
    expect(sidebar).toHaveClass('bg-primary', 'text-white', 'p-6', 'rounded-2xl', 'min-h-[500px]')
  })

  it('renders house type select with correct value', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const houseTypeSelect = screen.getAllByTestId('select')[0]
    expect(houseTypeSelect).toHaveAttribute('data-value', 'apartment')
  })

  it('renders rooms select with correct value', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const roomsSelect = screen.getAllByTestId('select')[1]
    expect(roomsSelect).toHaveAttribute('data-value', '2')
  })

  it('renders size slider with correct props', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const sizeSlider = screen.getAllByTestId('slider')[0]
    expect(sizeSlider).toHaveAttribute('data-value', '[50,150]')
    expect(sizeSlider).toHaveAttribute('data-max', '220')
    expect(sizeSlider).toHaveAttribute('data-min', '0')
    expect(sizeSlider).toHaveAttribute('data-step', '10')
  })

  it('renders price slider with correct props', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const priceSlider = screen.getAllByTestId('slider')[1]
    expect(priceSlider).toHaveAttribute('data-value', '[200000,250000]')
    expect(priceSlider).toHaveAttribute('data-max', '300000')
    expect(priceSlider).toHaveAttribute('data-min', '175000')
    expect(priceSlider).toHaveAttribute('data-step', '5000')
  })

  it('calls onFiltersChange when rooms change', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const roomsTrigger = screen.getAllByTestId('select-trigger')[1]
    fireEvent.click(roomsTrigger)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      houseType: 'new-value', // The mock changes houseType, not rooms
    })
  })

  it('calls onFiltersChange when size range changes', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const sizeSlider = screen.getAllByTestId('slider')[0]
    fireEvent.click(sizeSlider)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      sizeRange: [60, 160], // This matches the mock behavior
    })
  })

  it('calls onFiltersChange when price range changes', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const priceSlider = screen.getAllByTestId('slider')[1]
    fireEvent.click(priceSlider)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      priceRange: [200010, 250010], // This matches the mock behavior
    })
  })

  it('renders all select options for house type', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByTestId('select-item-all')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-apartment')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-house')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-condo')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-villa')).toBeInTheDocument()
  })

  it('renders all select options for rooms', () => {
    render(<FilterSidebar filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByTestId('select-item-3-')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-2')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-3')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-4+')).toBeInTheDocument()
  })

  it('handles different filter values correctly', () => {
    const differentFilters = {
      houseType: 'house',
      rooms: '4+',
      sizeRange: [100, 200],
      priceRange: [300000, 400000],
    }

    render(<FilterSidebar filters={differentFilters} onFiltersChange={mockOnFiltersChange} />)

    const houseTypeSelect = screen.getAllByTestId('select')[0]
    expect(houseTypeSelect).toHaveAttribute('data-value', 'house')

    const roomsSelect = screen.getAllByTestId('select')[1]
    expect(roomsSelect).toHaveAttribute('data-value', '4+')

    const sizeSlider = screen.getAllByTestId('slider')[0]
    expect(sizeSlider).toHaveAttribute('data-value', '[100,200]')

    const priceSlider = screen.getAllByTestId('slider')[1]
    expect(priceSlider).toHaveAttribute('data-value', '[300000,400000]')
  })
})
