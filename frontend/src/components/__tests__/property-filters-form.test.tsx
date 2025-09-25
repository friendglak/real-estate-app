import { render, screen } from '@testing-library/react'
import { PropertyFiltersForm } from '../property-filters-form'
import type { MockButtonProps, MockInputProps, MockSelectProps, MockFormData, MockControllerProps } from './test-types'

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: (data: MockFormData) => void) => (e: React.FormEvent) => {
      e.preventDefault()
      fn({
        name: 'Test Property',
        address: '123 Test St',
        minPrice: '200000',
        maxPrice: '500000',
        propertyType: 'house',
        bedrooms: '3',
      })
    },
    watch: () => ({
      name: 'Test Property',
      address: '123 Test St',
      minPrice: '200000',
      maxPrice: '500000',
      propertyType: 'house',
      bedrooms: '3',
    }),
    reset: jest.fn(),
  }),
  Controller: ({ render }: MockControllerProps) => render({
    field: {
      value: 'test-value',
      onChange: jest.fn(),
    }
  }),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  X: () => <div data-testid="x-icon">X</div>,
}))

// Mock UI components
jest.mock('../ui/input', () => ({
  Input: ({ placeholder, type, min, step, disabled, className, ...props }: MockInputProps) => (
    <input
      {...props}
      placeholder={placeholder}
      type={type}
      min={min}
      step={step}
      disabled={disabled}
      className={className}
      data-testid="input"
    />
  ),
}))

jest.mock('../ui/button', () => ({
  Button: ({ children, onClick, disabled, type, className, ...props }: MockButtonProps) => (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      data-testid="button"
    >
      {children}
    </button>
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

describe('PropertyFiltersForm', () => {
  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<PropertyFiltersForm onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('Property Name')).toBeInTheDocument()
    expect(screen.getByText('Address')).toBeInTheDocument()
    expect(screen.getByText('Min Price')).toBeInTheDocument()
    expect(screen.getByText('Max Price')).toBeInTheDocument()
    expect(screen.getByText('House Type')).toBeInTheDocument()
    expect(screen.getByText('Rooms')).toBeInTheDocument()
  })

  it('renders all input fields with correct placeholders', () => {
    render(<PropertyFiltersForm onFiltersChange={mockOnFiltersChange} />)

    const inputs = screen.getAllByTestId('input')
    expect(inputs).toHaveLength(4)

    expect(screen.getByPlaceholderText('Enter property name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('£175,000')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('more than £300,000')).toBeInTheDocument()
  })

  it('renders price inputs with correct attributes', () => {
    render(<PropertyFiltersForm onFiltersChange={mockOnFiltersChange} />)

    const inputs = screen.getAllByTestId('input')
    const minPriceInput = inputs[2]
    const maxPriceInput = inputs[3]

    expect(minPriceInput).toHaveAttribute('type', 'number')
    expect(minPriceInput).toHaveAttribute('min', '0')
    expect(minPriceInput).toHaveAttribute('step', '1000')

    expect(maxPriceInput).toHaveAttribute('type', 'number')
    expect(maxPriceInput).toHaveAttribute('min', '0')
    expect(maxPriceInput).toHaveAttribute('step', '1000')
  })

  it('renders select components for property type and bedrooms', () => {
    render(<PropertyFiltersForm onFiltersChange={mockOnFiltersChange} />)

    const selects = screen.getAllByTestId('select')
    expect(selects).toHaveLength(2)
  })

  it('renders all property type options', () => {
    render(<PropertyFiltersForm onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByTestId('select-item-all')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-apartment')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-house')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-condo')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-villa')).toBeInTheDocument()
  })

  it('renders all bedroom options', () => {
    render(<PropertyFiltersForm onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByTestId('select-item-any')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-2')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-3')).toBeInTheDocument()
    expect(screen.getByTestId('select-item-4')).toBeInTheDocument()
  })

  it('shows clear filters button when there are active filters', () => {
    render(<PropertyFiltersForm onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText('Clear Filters')).toBeInTheDocument()
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
  })

  it('handles loading state correctly', () => {
    render(<PropertyFiltersForm onFiltersChange={mockOnFiltersChange} isLoading={true} />)

    const inputs = screen.getAllByTestId('input')
    inputs.forEach(input => {
      expect(input).toBeDisabled()
    })

    const buttons = screen.getAllByTestId('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })

    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })
})
