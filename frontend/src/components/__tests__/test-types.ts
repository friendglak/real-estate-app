// Test types and interfaces for component mocks

export interface MockButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  variant?: string
  size?: string
  [key: string]: unknown
}

export interface MockInputProps {
  placeholder?: string
  type?: string
  min?: string | number
  step?: string | number
  disabled?: boolean
  className?: string
  [key: string]: unknown
}

export interface MockSelectProps {
  children?: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  placeholder?: string
}

export interface MockSliderProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
}

export interface MockImageProps {
  src?: string
  alt?: string
  [key: string]: unknown
}

export interface MockErrorDisplayProps {
  title?: string
  message?: string
  onDismiss?: () => void
  onRetry?: () => void
}

export interface MockEmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export interface MockPropertyGridProps {
  properties: unknown[]
  totalPages: number
  currentPage: number
  totalCount: number
}

export interface MockPropertyDetailModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId?: string
}

export interface MockPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface MockPropertyFiltersFormProps {
  onFiltersChange: (filters: unknown) => void
  isLoading?: boolean
  initialFilters?: unknown
}

export interface MockErrorFallbackProps {
  error?: Error
  resetError?: () => void
  showDetails?: boolean
}

export interface MockFormData {
  name: string
  address: string
  minPrice: string
  maxPrice: string
  propertyType: string
  bedrooms: string
}

export interface MockControllerProps {
  render: (props: { field: { value: string; onChange: () => void } }) => React.ReactNode
}
